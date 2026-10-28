import { supabase } from "@/lib/supabase"
import { isUserAdmin } from "@/lib/auth-admin"
import { InsightArticle, ArticleBlock } from "./types"

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Hitung perkiraan waktu baca dalam menit
 */
export function calculateReadingTime(text: string): string {
  if (!text) return "1 menit"
  const wordCount = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(wordCount / 180))
  return `${minutes} menit`
}

/**
 * Konversi susunan Blocks menjadi string Markdown terstruktur
 * (kompatibel dengan konsep MateriDev)
 */
export function blocksToMarkdown(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading": {
          const hashes = "#".repeat(b.headingLevel || 2)
          return `${hashes} ${b.value.trim()}`
        }
        case "image": {
          if (!b.images || b.images.length === 0) return ""
          const validImgs = b.images.filter((img) => img.url && img.url.trim() !== "")
          if (validImgs.length === 0) return ""

          const align = b.imageAlign || "center"
          const ratio = b.imageRatio || "16:9"
          const width = (b as any).imageWidth || 100 // Width percentage 25-100

          const widthParam = width < 100 ? `&w=${width}` : ""

          return `![](${validImgs[0].url}#${align}&col=full&ratio=${ratio}${widthParam})`
        }
        case "quote": {
          const lines = b.value
            .trim()
            .split("\n")
            .map((l) => `> ${l}`)
            .join("\n")
          if (b.quoteAuthor) {
            return `${lines}\n> \n> — *${b.quoteAuthor}${b.quoteRole ? `, ${b.quoteRole}` : ""}*`
          }
          return lines
        }
        case "callout": {
          const type = b.calloutType || "info"
          const title = b.calloutTitle ? `**${b.calloutTitle}**\n` : ""
          return `> [!${type.toUpperCase()}]\n> ${title}${b.value.trim()}`
        }
        case "code": {
          const lang = b.codeLang || "bash"
          return `\`\`\`${lang}\n${b.value.trim()}\n\`\`\``
        }
        case "divider": {
          return `---`
        }
        case "text":
        default: {
          return b.value.trim()
        }
      }
    })
    .filter(Boolean)
    .join("\n\n")
}

/**
 * Konversi Markdown string kembali menjadi array Blocks
 */
export function markdownToBlocks(markdown: string): ArticleBlock[] {
  if (!markdown) {
    return [{ id: "b-initial", type: "text", value: "" }]
  }

  const blocks: ArticleBlock[] = []
  const paragraphs = markdown.split(/\n{2,}/)

  paragraphs.forEach((p, idx) => {
    const trimmed = p.trim()
    if (!trimmed) return

    // Heading test: ## Heading
    const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        id: `b-h-${idx}-${Date.now()}`,
        type: "heading",
        headingLevel: headingMatch[1].length as 2 | 3 | 4,
        value: headingMatch[2],
      })
      return
    }

    // Code block test: ```lang ... ```
    const codeMatch = trimmed.match(/^```(\w*)\r?\n([\s\S]*?)```$/)
    if (codeMatch) {
      blocks.push({
        id: `b-c-${idx}-${Date.now()}`,
        type: "code",
        codeLang: codeMatch[1] || "bash",
        value: codeMatch[2],
      })
      return
    }

    // Divider test: ---
    if (trimmed === "---") {
      blocks.push({
        id: `b-d-${idx}-${Date.now()}`,
        type: "divider",
        value: "---",
      })
      return
    }

    // Callout test: > [!TIP]
    const calloutMatch = trimmed.match(/^>\s*\[!(TIP|INFO|WARNING|SUCCESS|NOTE|CAUTION)\]\s*\n([\s\S]+)$/i)
    if (calloutMatch) {
      const typeStr = calloutMatch[1].toLowerCase()
      const rawBody = calloutMatch[2].replace(/^>\s?/gm, "").trim()
      blocks.push({
        id: `b-co-${idx}-${Date.now()}`,
        type: "callout",
        calloutType: (typeStr === "tip" ? "tip" : typeStr === "warning" ? "warning" : typeStr === "success" ? "success" : "info"),
        value: rawBody,
      })
      return
    }

    // Quote test: > Quote
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s?/gm, "").trim()
      blocks.push({
        id: `b-q-${idx}-${Date.now()}`,
        type: "quote",
        value: quoteText,
      })
      return
    }

    // Image test: ![Alt](url#hash)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const imgMatches = [...trimmed.matchAll(imgRegex)]
    if (imgMatches.length > 0 && trimmed.replace(imgRegex, "").trim() === "") {
      const images = imgMatches.map((m) => {
        const rawUrl = m[2]
        const cleanUrl = rawUrl.split("#")[0]
        return {
          url: cleanUrl,
          caption: m[1] || "",
        }
      })

      const firstUrl = imgMatches[0][2]
      const hashPart = firstUrl.split("#")[1] || ""
      const align = (hashPart.split("&")[0] || "center") as "left" | "center" | "right"
      const widthPart = hashPart.split("&").find((p) => p.startsWith("w="))
      const imageWidth = widthPart ? parseInt(widthPart.split("=")[1], 10) : 100
      const ratioPart = hashPart.split("&").find((p) => p.startsWith("ratio="))
      const ratio = ratioPart ? (ratioPart.split("=")[1] as "16:9" | "4:5" | "1:1") : "16:9"

      blocks.push({
        id: `b-img-${idx}-${Date.now()}`,
        type: "image",
        value: "",
        imageWidth: isNaN(imageWidth) ? 100 : imageWidth,
        imageAlign: align,
        imageRatio: ratio,
        images,
      })
      return
    }

    // Default text
    blocks.push({
      id: `b-txt-${idx}-${Date.now()}`,
      type: "text",
      value: trimmed,
    })
  })

  return blocks.length > 0 ? blocks : [{ id: "b-initial", type: "text", value: markdown }]
}

/**
 * Mengambil daftar artikel Insight dari Supabase
 */
export async function fetchInsights(options?: {
  category?: string
  onlyActive?: boolean
  search?: string
}): Promise<InsightArticle[]> {
  try {
    let query = supabase.from("article").select("*").order("created_at", { ascending: false })

    if (options?.onlyActive !== false) {
      query = query.eq("is_active", true)
    }

    if (options?.category && options.category !== "Semua") {
      query = query.eq("category", options.category)
    }

    const { data, error } = await query

    if (error) {
      console.warn("fetchInsights warning:", error.message)
      return []
    }

    if (!data) return []

    let articles: InsightArticle[] = data.map((row: any) => ({
      id: row.id,
      title: row.title || "Tanpa Judul",
      slug: row.slug || `article-${row.id}`,
      description: row.description || row.excerpt || "",
      excerpt: row.excerpt || row.description || "",
      category: row.category || "Panduan Bisnis",
      author: row.author || "Tim R&D Indo Green Nature",
      reading_time: row.reading_time || "5 menit",
      pembahasan: row.pembahasan || "CPOTB & BPOM",
      src: row.src || row.cover_image || "",
      cover_image: row.cover_image || row.src || "",
      content: row.content || row.description || "",
      blocks: Array.isArray(row.blocks) ? row.blocks : [],
      tags: Array.isArray(row.tags) ? row.tags : [],
      is_active: row.is_active ?? true,
      views: row.views || 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    if (options?.search && options.search.trim() !== "") {
      const q = options.search.toLowerCase().trim()
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          a.content.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    }

    return articles
  } catch (err) {
    console.error("fetchInsights error:", err)
    return []
  }
}

/**
 * Mengambil artikel tunggal berdasarkan slug
 */
export async function fetchInsightBySlug(slug: string): Promise<InsightArticle | null> {
  try {
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()

    if (error || !data) {
      // Coba fallback cari berdasarkan id jika slug numerik
      const numericId = parseInt(slug, 10)
      if (!isNaN(numericId)) {
        const { data: fallbackData } = await supabase
          .from("article")
          .select("*")
          .eq("id", numericId)
          .maybeSingle()

        if (fallbackData) {
          return {
            id: fallbackData.id,
            title: fallbackData.title || "Tanpa Judul",
            slug: fallbackData.slug || `article-${fallbackData.id}`,
            description: fallbackData.description || fallbackData.excerpt || "",
            excerpt: fallbackData.excerpt || fallbackData.description || "",
            category: fallbackData.category || "Panduan Bisnis",
            author: fallbackData.author || "Tim R&D Indo Green Nature",
            reading_time: fallbackData.reading_time || "5 menit",
            pembahasan: fallbackData.pembahasan || "CPOTB & BPOM",
            src: fallbackData.src || fallbackData.cover_image || "",
            cover_image: fallbackData.cover_image || fallbackData.src || "",
            content: fallbackData.content || fallbackData.description || "",
            blocks: Array.isArray(fallbackData.blocks) ? fallbackData.blocks : [],
            tags: Array.isArray(fallbackData.tags) ? fallbackData.tags : [],
            is_active: fallbackData.is_active ?? true,
            views: fallbackData.views || 0,
            created_at: fallbackData.created_at,
            updated_at: fallbackData.updated_at,
          }
        }
      }
      return null
    }

    return {
      id: data.id,
      title: data.title || "Tanpa Judul",
      slug: data.slug || `article-${data.id}`,
      description: data.description || data.excerpt || "",
      excerpt: data.excerpt || data.description || "",
      category: data.category || "Panduan Bisnis",
      author: data.author || "Tim R&D Indo Green Nature",
      reading_time: data.reading_time || "5 menit",
      pembahasan: data.pembahasan || "CPOTB & BPOM",
      src: data.src || data.cover_image || "",
      cover_image: data.cover_image || data.src || "",
      content: data.content || data.description || "",
      blocks: Array.isArray(data.blocks) ? data.blocks : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      is_active: data.is_active ?? true,
      views: data.views || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  } catch (err) {
    console.error("fetchInsightBySlug error:", err)
    return null
  }
}

/**
 * Simpan atau perbarui artikel Insight ke Supabase
 */
export async function saveInsight(
  article: Partial<InsightArticle>
): Promise<{ success: boolean; data?: InsightArticle; message?: string; error?: string }> {
  try {
    // 1. Verifikasi hak akses Admin sebelum menyimpan ke database
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.email || !isUserAdmin(session.user.email)) {
      return {
        success: false,
        message: "Akses ditolak: Anda harus login sebagai Admin resmi untuk membuat atau mengedit artikel.",
        error: "Unauthorized",
      }
    }

    const title = article.title?.trim()
    if (!title) {
      return { success: false, message: "Judul artikel wajib diisi.", error: "Judul artikel wajib diisi." }
    }

    const slug = article.slug ? generateSlug(article.slug) : generateSlug(title)
    const content = article.content || (article.blocks ? blocksToMarkdown(article.blocks) : "")
    const reading_time = article.reading_time || calculateReadingTime(content)
    const cover = article.cover_image || article.src || ""
    const excerpt = article.excerpt || article.description || ""

    const payload: any = {
      title,
      slug,
      description: excerpt,
      category: article.category || "Panduan Bisnis",
      author: article.author || "Tim R&D Indo Green Nature",
      reading_time,
      pembahasan: article.pembahasan || "CPOTB & BPOM",
      src: cover,
      content,
      blocks: article.blocks || [],
      tags: article.tags || [],
      is_active: article.is_active ?? true,
      updated_at: new Date().toISOString(),
    }

    let savedData: any = null

    if (article.id) {
      // Update existing
      const { data, error } = await supabase
        .from("article")
        .update(payload)
        .eq("id", article.id)
        .select()
        .single()

      if (error) throw error
      savedData = data
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("article")
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      savedData = data
    }

    // Revalidasi cache SEO & Sitemap secara on-demand
    if (savedData?.slug || slug) {
      import("@/app/actions/revalidate")
        .then((mod) => mod.revalidateInsightContent(savedData?.slug || slug))
        .catch(() => {})
    }

    return {
      success: true,
      data: savedData,
      message: article.id ? "Artikel berhasil diperbarui!" : "Artikel baru berhasil diterbitkan!",
    }
  } catch (err: any) {
    console.error("saveInsight error:", err)
    return {
      success: false,
      message: err.message || "Gagal menyimpan artikel.",
      error: err.message || "Gagal menyimpan artikel.",
    }
  }
}

/**
 * Hapus artikel dari Supabase
 */
export async function deleteInsight(
  id?: number,
  slug?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // 1. Verifikasi hak akses Admin sebelum menghapus dari database
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.email || !isUserAdmin(session.user.email)) {
      return {
        success: false,
        message: "Akses ditolak: Anda harus login sebagai Admin resmi untuk menghapus artikel.",
        error: "Unauthorized",
      }
    }

    let query = supabase.from("article").delete()
    if (id) {
      query = query.eq("id", id)
    } else if (slug) {
      query = query.eq("slug", slug)
    } else {
      return { success: false, message: "ID atau slug artikel wajib diberikan.", error: "ID atau slug artikel wajib diberikan." }
    }

    const { error } = await query
    if (error) throw error

    // Revalidasi cache SEO & Sitemap saat artikel dihapus
    import("@/app/actions/revalidate")
      .then((mod) => mod.revalidateInsightContent(slug))
      .catch(() => {})

    return { success: true, message: "Artikel berhasil dihapus." }
  } catch (err: any) {
    console.error("deleteInsight error:", err)
    return { success: false, message: err.message || "Gagal menghapus artikel.", error: err.message || "Gagal menghapus artikel." }
  }
}

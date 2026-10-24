"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  TypeIcon,
  ImageIcon,
  QuoteIcon,
  CodeIcon,
  Trash2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  CopyIcon,
  PlusIcon,
  SaveIcon,
  EyeIcon,
  ColumnsIcon,
  UploadCloudIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
  FolderIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  InfoIcon,
  LightbulbIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  HelpCircleIcon,
  XIcon,
  FileTextIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { uploadMedia } from "@/lib/storage"
import {
  InsightArticle,
  ArticleBlock,
  BlockType,
  ImageItem,
  CalloutType,
  INSIGHT_CATEGORIES,
} from "@/lib/insight/types"
import {
  generateSlug,
  calculateReadingTime,
  blocksToMarkdown,
  markdownToBlocks,
  saveInsight,
} from "@/lib/insight/db"
import { InsightViewer } from "./insight-viewer"

interface InsightEditorProps {
  initialArticle?: InsightArticle | null
  isEditMode?: boolean
}

const LOCAL_STORAGE_KEY = "ign_insight_editor_draft_v1"
const CUSTOM_CATEGORIES_KEY = "ign_insight_custom_categories"

const TITLE_SIZE_OPTIONS = [
  { value: "text-2xl", label: "Normal (2xl)" },
  { value: "text-3xl", label: "Besar (3xl)" },
  { value: "text-4xl", label: "Sangat Besar (4xl)" },
]

const HEADING_LEVEL_OPTIONS = [
  { value: "1", label: "H1 - Judul Bab Utama" },
  { value: "2", label: "H2 - Subjudul Bagian" },
  { value: "3", label: "H3 - Sub-subjudul Poin" },
]

const CALLOUT_TYPE_OPTIONS = [
  { value: "tip", label: "💡 Tips Formulasi Herbal" },
  { value: "bpom", label: "🛡️ Regulasi BPOM & Halal" },
  { value: "warning", label: "⚠️ Peringatan Penting" },
  { value: "info", label: "ℹ️ Informasi Tambahan" },
]

export function InsightEditor({ initialArticle, isEditMode = false }: InsightEditorProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)

  // Article metadata
  const [title, setTitle] = React.useState(initialArticle?.title || "")
  const [titleSize, setTitleSize] = React.useState<"text-2xl" | "text-3xl" | "text-4xl">("text-3xl")
  const [slug, setSlug] = React.useState(initialArticle?.slug || "")
  const [isAutoSlug, setIsAutoSlug] = React.useState(!initialArticle?.slug)
  const [category, setCategory] = React.useState(
    initialArticle?.category || "Panduan Bisnis"
  )

  // Dynamic categories state with persistence
  const [categories, setCategories] = React.useState<string[]>(() => {
    const defaults = [...INSIGHT_CATEGORIES]
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CUSTOM_CATEGORIES_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (initialArticle?.category && !parsed.includes(initialArticle.category)) {
              return [...parsed, initialArticle.category]
            }
            return parsed
          }
        }
      } catch (e) {
        console.warn("Gagal membaca kategori dari localStorage:", e)
      }
    }
    if (initialArticle?.category && !defaults.includes(initialArticle.category as any)) {
      return [...defaults, initialArticle.category]
    }
    return defaults
  })

  const [isAddingCategory, setIsAddingCategory] = React.useState(false)
  const [newCategoryInput, setNewCategoryInput] = React.useState("")
  const [isManagingCategories, setIsManagingCategories] = React.useState(false)

  const saveCategories = (newCategories: string[]) => {
    setCategories(newCategories)
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(newCategories))
    } catch (e) {
      console.warn("Gagal menyimpan kategori:", e)
    }
  }

  const handleAddCategory = (nameToAdd?: string) => {
    const trimmed = (nameToAdd || newCategoryInput).trim()
    if (!trimmed) {
      toast.error("Nama kategori tidak boleh kosong")
      return
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`Kategori "${trimmed}" sudah ada`)
      return
    }

    const updated = [...categories, trimmed]
    saveCategories(updated)
    setCategory(trimmed)
    setNewCategoryInput("")
    setIsAddingCategory(false)
    toast.success(`Kategori "${trimmed}" berhasil ditambahkan dan dipilih!`)
  }

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      toast.error("Minimal harus ada 1 kategori artikel!")
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${catToDelete}"?`)) {
      return
    }

    const updated = categories.filter((c) => c !== catToDelete)
    saveCategories(updated)

    if (category === catToDelete) {
      setCategory(updated[0])
    }
    toast.success(`Kategori "${catToDelete}" berhasil dihapus`)
  }

  const handleResetCategories = () => {
    if (confirm("Kembalikan daftar kategori ke pengaturan default?")) {
      saveCategories([...INSIGHT_CATEGORIES])
      if (!INSIGHT_CATEGORIES.includes(category as any)) {
        setCategory(INSIGHT_CATEGORIES[0])
      }
      toast.success("Daftar kategori dikembalikan ke default")
    }
  }

  const [coverImage, setCoverImage] = React.useState(
    initialArticle?.cover_image || ""
  )
  const [isUploadingCover, setIsUploadingCover] = React.useState(false)
  const [author, setAuthor] = React.useState(
    initialArticle?.author || "Tim R&D CV. Indo Green Nature"
  )
  const [pembahasan, setPembahasan] = React.useState(
    initialArticle?.pembahasan || "CPOTB & BPOM"
  )
  const [readingTime, setReadingTime] = React.useState(
    initialArticle?.reading_time || ""
  )
  const [tags, setTags] = React.useState<string[]>(
    initialArticle?.tags || ["Maklon Herbal", "Formulasi Alami"]
  )
  const [tagInput, setTagInput] = React.useState("")

  // Article blocks
  const [blocks, setBlocks] = React.useState<ArticleBlock[]>(() => {
    if (initialArticle?.blocks && initialArticle.blocks.length > 0) {
      return initialArticle.blocks
    }
    if (initialArticle?.content) {
      return markdownToBlocks(initialArticle.content)
    }
    return [
      {
        id: "intro-text",
        type: "text",
        value:
          "Industri produk herbal dan suplemen alami di Indonesia kini berkembang pesat seiring peningkatan kesadaran masyarakat akan gaya hidup sehat.",
      },
    ]
  })

  // Auto-generate slug when title changes
  React.useEffect(() => {
    if (isAutoSlug && title) {
      setSlug(generateSlug(title))
    }
  }, [title, isAutoSlug])

  // Try loading draft from localStorage for new article
  React.useEffect(() => {
    if (!isEditMode && !initialArticle) {
      try {
        const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft)
          if (parsed.title && confirm("Ditemukan draf artikel yang belum disimpan. Apakah Anda ingin melanjutkan draf tersebut?")) {
            setTitle(parsed.title || "")
            setSlug(parsed.slug || "")
            setCategory(parsed.category || "Panduan Bisnis")
            setCoverImage(parsed.coverImage || "")
            setAuthor(parsed.author || "Tim R&D CV. Indo Green Nature")
            if (parsed.pembahasan) setPembahasan(parsed.pembahasan)
            if (parsed.readingTime) setReadingTime(parsed.readingTime)
            setTags(parsed.tags || [])
            if (parsed.blocks?.length) setBlocks(parsed.blocks)
          }
        }
      } catch (err) {
        console.warn("Gagal memulihkan draf:", err)
      }
    }
  }, [isEditMode, initialArticle])

  // Auto-save draft locally every 5 seconds
  React.useEffect(() => {
    if (!isEditMode && title.trim()) {
      const timer = setTimeout(() => {
        try {
          const draftPayload = {
            title,
            slug,
            category,
            coverImage,
            author,
            pembahasan,
            readingTime,
            tags,
            blocks,
            updatedAt: new Date().toISOString(),
          }
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draftPayload))
        } catch (e) {
          // ignore quota error
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [title, slug, category, coverImage, author, pembahasan, readingTime, tags, blocks, isEditMode])

  // Auto-calculated reading time
  const autoReadingTime = React.useMemo(() => {
    const markdown = blocksToMarkdown(blocks)
    return calculateReadingTime(markdown)
  }, [blocks])

  // Inisialisasi otomatis readingTime jika masih kosong
  React.useEffect(() => {
    if (!readingTime && autoReadingTime) {
      setReadingTime(autoReadingTime)
    }
  }, [autoReadingTime, readingTime])

  // Full compiled markdown preview
  const compiledMarkdown = React.useMemo(() => {
    return blocksToMarkdown(blocks)
  }, [blocks])

  // Handler buka pratinjau di tab baru
  const handleOpenPreviewNewTab = () => {
    if (typeof window === "undefined") return

    const draftArticle: InsightArticle = {
      id: initialArticle?.id || 0,
      title: title.trim() || "Judul Artikel Insight",
      slug: slug.trim() || "preview",
      category: category || "Insight",
      excerpt: "",
      author: author.trim() || "Tim R&D CV. Indo Green Nature",
      reading_time: readingTime || autoReadingTime || "4 min baca",
      pembahasan: pembahasan.trim() || "CPOTB & BPOM",
      cover_image: coverImage.trim() || "",
      content: compiledMarkdown,
      tags: tags || [],
      created_at: initialArticle?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    }

    try {
      localStorage.setItem("ign_article_preview_draft", JSON.stringify(draftArticle))

      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel("ign_article_preview_channel")
        bc.postMessage({ type: "UPDATE_ARTICLE_DRAFT", data: draftArticle })
        setTimeout(() => bc.close(), 100)
      }
    } catch (err) {
      console.warn("Gagal menyimpan draft pratinjau:", err)
    }

    window.open("/insight/preview?preview=true", "_blank")
    toast.info("Pratinjau artikel dibuka di tab baru")
  }

  // Real-time auto sync ke tab preview jika tab sudah terbuka
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === "undefined") return
      const draftArticle: InsightArticle = {
        id: initialArticle?.id || 0,
        title: title.trim() || "Judul Artikel Insight",
        slug: slug.trim() || "preview",
        category: category || "Insight",
        excerpt: "",
        author: author.trim() || "Tim R&D CV. Indo Green Nature",
        reading_time: readingTime || autoReadingTime || "4 min baca",
        pembahasan: pembahasan.trim() || "CPOTB & BPOM",
        cover_image: coverImage.trim() || "",
        content: compiledMarkdown,
        tags: tags || [],
        created_at: initialArticle?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
      }

      try {
        localStorage.setItem("ign_article_preview_draft", JSON.stringify(draftArticle))
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("ign_article_preview_channel")
          bc.postMessage({ type: "UPDATE_ARTICLE_DRAFT", data: draftArticle })
          setTimeout(() => bc.close(), 50)
        }
      } catch {
        // Ignore
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [title, slug, category, author, pembahasan, readingTime, autoReadingTime, coverImage, compiledMarkdown, tags, initialArticle])

  // ==================== BLOCK OPERATIONS ====================
  const addBlock = (type: BlockType, afterIndex?: number) => {
    const newId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    let newBlock: ArticleBlock

    switch (type) {
      case "text":
        newBlock = { id: newId, type: "text", value: "" }
        break
      case "heading":
        newBlock = {
          id: newId,
          type: "heading",
          value: "Subjudul Baru",
          headingLevel: 2,
        }
        break
      case "image":
        newBlock = {
          id: newId,
          type: "image",
          value: "",
          imageRatio: "16:9",
          imageAlign: "center",
          imageWidth: 100,
          images: [{ url: "", caption: "", alt: "" }],
        }
        break
      case "callout":
        newBlock = {
          id: newId,
          type: "callout",
          value: "Tuliskan tips atau panduan penting di sini...",
          calloutType: "tip",
          calloutTitle: "Tips Formulasi",
        }
        break
      case "quote":
        newBlock = {
          id: newId,
          type: "quote",
          value: "Kualitas formulasi herbal berawal dari pemilihan ekstrak terstandar.",
          quoteAuthor: "Apoteker Penanggung Jawab IGN",
        }
        break
      case "code":
        newBlock = {
          id: newId,
          type: "code",
          value: "# Contoh parameter ekstraksi\nsuhu_optimal = 45 # Celcius\nwaktu_maserasi = 48 # Jam",
          codeLang: "python",
        }
        break
    }

    setBlocks((prev) => {
      if (typeof afterIndex === "number" && afterIndex >= 0) {
        const next = [...prev]
        next.splice(afterIndex + 1, 0, newBlock)
        return next
      }
      return [...prev, newBlock]
    })

    toast.success(`Blok ${type.toUpperCase()} ditambahkan`)
  }

  const updateBlock = (id: string, updates: Partial<ArticleBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )
  }

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      toast.error("Artikel harus memiliki minimal 1 blok.")
      return
    }
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  const duplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id)
    if (idx === -1) return
    const original = blocks[idx]
    const cloned: ArticleBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    }
    setBlocks((prev) => {
      const next = [...prev]
      next.splice(idx + 1, 0, cloned)
      return next
    })
    toast.success("Blok diduplikasi")
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id)
    if (idx === -1) return
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === blocks.length - 1) return

    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    setBlocks((prev) => {
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.splice(targetIdx, 0, item)
      return next
    })
  }

  // ==================== INLINE TEXT FORMATTING TOOLBAR ====================
  const handleFormatText = (blockId: string, format: string) => {
    const textarea = document.getElementById(
      `textarea-${blockId}`
    ) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const current = textarea.value
    const selected = current.substring(start, end)

    let prefix = ""
    let suffix = ""
    let placeholder = ""

    switch (format) {
      case "bold":
        prefix = "**"
        suffix = "**"
        placeholder = "Teks Tebal"
        break
      case "italic":
        prefix = "_"
        suffix = "_"
        placeholder = "Teks Miring"
        break
      case "h2":
        prefix = "\n## "
        placeholder = "Subjudul H2"
        break
      case "h3":
        prefix = "\n### "
        placeholder = "Subjudul H3"
        break
      case "list":
        prefix = "\n- "
        placeholder = "Poin baru"
        break
      case "numlist":
        prefix = "\n1. "
        placeholder = "Langkah nomor"
        break
      case "quote":
        prefix = "\n> "
        placeholder = "Kutipan penting"
        break
      case "badge-green":
      case "color-green":
        prefix = "@g "
        suffix = " @g"
        placeholder = "teks hijau"
        break
      case "badge-blue":
      case "color-blue":
        prefix = "@bl "
        suffix = " @bl"
        placeholder = "teks biru"
        break
      case "badge-warning":
      case "color-warning":
        prefix = "@w "
        suffix = " @w"
        placeholder = "teks kuning"
        break
      case "badge-alert":
      case "color-alert":
        prefix = "@r "
        suffix = " @r"
        placeholder = "teks merah"
        break
      case "color-purple":
        prefix = "@p "
        suffix = " @p"
        placeholder = "teks ungu"
        break
      case "badge-link":
        prefix = "@link "
        suffix = " Label Tautan @link"
        placeholder = "https://example.com"
        break
      case "text-small":
        prefix = "@sm "
        suffix = " @sm"
        placeholder = "Catatan tambahan"
        break
      case "text-large":
        prefix = "@lg "
        suffix = " @lg"
        placeholder = "Paragraf pembuka"
        break
      case "divider":
        prefix = "\n\n---\n\n"
        placeholder = ""
        break
    }

    const insert = prefix + (selected || placeholder) + suffix
    const updated = current.substring(0, start) + insert + current.substring(end)
    updateBlock(blockId, { value: updated })

    setTimeout(() => {
      textarea.focus()
      if (selected) {
        textarea.setSelectionRange(start + insert.length, start + insert.length)
      } else {
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + placeholder.length
        )
      }
    }, 15)
  }

  // ==================== COVER IMAGE UPLOAD ====================
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    try {
      const url = await uploadMedia(file, "insight/covers")
      if (url) {
        setCoverImage(url)
        toast.success("Cover gambar berhasil diunggah!")
      } else {
        toast.error("Gagal mengunggah cover gambar.")
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan:", { description: err.message })
    } finally {
      setIsUploadingCover(false)
    }
  }

  // ==================== IMAGE BLOCK UPLOAD ====================
  const handleBlockImageUpload = async (
    blockId: string,
    imgIndex: number,
    file: File
  ) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    toast.info("Mengunggah dan mengompresi gambar...")
    try {
      const url = await uploadMedia(file, "insight/content")
      if (url) {
        const nextImages = [...(block.images || [])]
        nextImages[imgIndex] = {
          ...nextImages[imgIndex],
          url,
          alt: file.name.replace(/\.[^/.]+$/, ""),
        }
        updateBlock(blockId, { images: nextImages })
        toast.success("Gambar berhasil disematkan!")
      } else {
        toast.error("Gagal mengunggah gambar.")
      }
    } catch (err: any) {
      toast.error("Upload error:", { description: err.message })
    }
  }

  // ==================== TAG CHIPS ====================
  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, "")
    if (!clean) return
    if (!tags.includes(clean)) {
      setTags([...tags, clean])
    }
    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // ==================== SAVE / PUBLISH ====================
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Judul artikel tidak boleh kosong!")
      return
    }

    const cleanSlug = (slug || generateSlug(title)).trim()
    if (!cleanSlug) {
      toast.error("Slug URL tidak boleh kosong!")
      return
    }

    setIsSaving(true)
    try {
      const articleData: Partial<InsightArticle> = {
        id: initialArticle?.id,
        title: title.trim(),
        slug: cleanSlug,
        category,
        excerpt: "",
        cover_image: coverImage || "/images/banner-default.jpg",
        content: compiledMarkdown,
        blocks,
        author: author.trim() || "Tim CV. Indo Green Nature",
        pembahasan: pembahasan.trim() || "CPOTB & BPOM",
        reading_time: readingTime || autoReadingTime || "4 min baca",
        tags,
      }

      const res = await saveInsight(articleData)
      if (res.success) {
        toast.success(
          isEditMode
            ? "Artikel berhasil diperbarui!"
            : "Artikel baru berhasil diterbitkan!"
        )
        // Clean draft storage
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY)
        } catch (e) { }

        // Navigate to the article or insight directory
        router.push(`/insight/${cleanSlug}`)
      } else {
        toast.error("Gagal menyimpan artikel:", { description: res.error || res.message })
      }
    } catch (err: any) {
      toast.error("Kesalahan jaringan / database:", { description: err.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top sticky studio action bar */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-xs">
        <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-[20px] py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <span>{isEditMode ? "Edit Insight" : "Studio Insight Baru"}</span>
              <Badge variant="outline" className="border-[#15803d]/30 text-[#15803d] dark:text-green-400 font-mono text-[10px] rounded-[5px]">
                {category}
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {readingTime} • {blocks.length} blok konten
            </p>
          </div>

          {/* Action Header: Pratinjau Tab Baru + Batal + Terbitkan */}
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenPreviewNewTab}
              className="text-xs gap-1.5 border-[#15803d]/40 text-[#15803d] dark:text-green-400 hover:bg-[#15803d]/10 font-semibold shadow-xs"
              title="Buka pratinjau hasil artikel secara penuh di tab baru"
            >
              <ExternalLinkIcon className="size-3.5" />
              <span>Pratinjau di Tab Baru</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/insight")}
              className="text-xs"
            >
              Batal
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs shadow-sm gap-1.5"
            >
              {isSaving ? (
                <RefreshCwIcon className="size-3.5 animate-spin" />
              ) : (
                <SaveIcon className="size-3.5" />
              )}
              <span>{isSaving ? "Menyimpan..." : isEditMode ? "Perbarui" : "Terbitkan"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Studio Area (Full-Width Fokus Tanpa Konsep Bagi Layar, Sejajar Top Bar) */}
      <main className="w-full max-w-[1440px] mx-auto px-4 lg:px-[20px] py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Metadata Card */}
          <div className="rounded-[5px] border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 flex items-center gap-1.5">
                <FolderIcon className="size-4" />
                Informasi & Metadata Artikel
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ClockIcon className="size-3.5" />
                Est. {readingTime}
              </span>
            </div>

            {/* Judul Artikel & Title Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Artikel / Insight <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan Nama Judul Artikel"
                  className={`font-bold ${titleSize} bg-background flex-1 rounded-[5px] h-9`}
                />
                <Select
                  value={titleSize}
                  onValueChange={(val) => {
                    if (val) setTitleSize(val as "text-2xl" | "text-3xl" | "text-4xl")
                  }}
                  items={TITLE_SIZE_OPTIONS}
                >
                  <SelectTrigger className="h-9 min-w-[140px] rounded-[5px] border-input bg-background text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#15803d]">
                    <SelectValue placeholder="Ukuran Judul" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[5px] border-border shadow-md">
                    <SelectGroup>
                      {TITLE_SIZE_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value} className="text-xs rounded-[3px] cursor-pointer">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Slug URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  URL Slug
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAutoSlug}
                    onChange={(e) => setIsAutoSlug(e.target.checked)}
                    className="rounded border-input text-[#15803d] focus:ring-[#15803d]"
                  />
                  <span>Otomatis dari judul</span>
                </label>
              </div>
              <div className="flex items-center rounded-[5px] border border-input bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground font-mono">
                <span className="select-none text-muted-foreground/70">/insight/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsAutoSlug(false)
                    setSlug(e.target.value)
                  }}
                  className="w-full bg-transparent text-foreground focus:outline-none font-mono"
                  placeholder="slug-artikel"
                />
              </div>
            </div>

            {/* Category & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <FolderIcon className="size-3.5 text-[#15803d]" />
                    <span>Kategori</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory((prev) => !prev)}
                      className="text-[11px] font-semibold text-[#15803d] dark:text-green-400 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Tambah Kategori Baru"
                    >
                      <PlusIcon className="size-3" />
                      <span>{isAddingCategory ? "Batal" : "Tambah"}</span>
                    </button>
                    <span className="text-muted-foreground/40 text-[10px]">•</span>
                    <button
                      type="button"
                      onClick={() => setIsManagingCategories(true)}
                      className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                      title="Kelola & Hapus Kategori"
                    >
                      <span>Kelola / Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Inline Quick Add Input */}
                {isAddingCategory && (
                  <div className="flex items-center gap-1.5 p-1.5 rounded-[5px] border border-[#15803d]/40 bg-emerald-50/50 dark:bg-emerald-950/20 animate-in fade-in-50 duration-150">
                    <Input
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCategory()
                        } else if (e.key === "Escape") {
                          setIsAddingCategory(false)
                        }
                      }}
                      placeholder="Nama kategori baru..."
                      className="h-7 text-xs bg-background rounded-[4px] flex-1"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddCategory()}
                      className="h-7 text-xs bg-[#15803d] hover:bg-[#166534] text-white px-2.5 font-semibold rounded-[4px]"
                    >
                      Simpan
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingCategory(false)
                        setNewCategoryInput("")
                      }}
                      className="h-7 text-xs text-muted-foreground hover:text-foreground px-2 rounded-[4px]"
                    >
                      Batal
                    </Button>
                  </div>
                )}

                <Select
                  value={category}
                  onValueChange={(val) => {
                    if (val) setCategory(val)
                  }}
                  items={categories.map((cat) => ({ value: cat, label: cat }))}
                >
                  <SelectTrigger className="w-full h-9 rounded-[5px] border-input bg-background text-xs font-medium focus-visible:ring-1 focus-visible:ring-[#15803d]">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[5px] border-border shadow-md">
                    <SelectGroup>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-xs rounded-[3px] cursor-pointer">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <div className="border-t border-border/60 my-1 pt-1 px-1 flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)}
                        className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-[#15803d] dark:text-green-400 font-semibold hover:bg-[#15803d]/10 rounded-[4px] transition-colors cursor-pointer text-left"
                      >
                        <PlusIcon className="size-3.5" />
                        <span>+ Tambah Kategori Baru</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsManagingCategories(true)}
                        className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-[4px] transition-colors cursor-pointer text-left"
                      >
                        <Trash2Icon className="size-3.5" />
                        <span>Kelola & Hapus Kategori...</span>
                      </button>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <UserIcon className="size-3.5" />
                  Penulis / Tim Riset
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tim R&D CV. Indo Green Nature"
                  className="h-9 text-xs bg-background rounded-[5px]"
                />
              </div>
            </div>

            {/* Pembahasan & Waktu Baca (Detail Publikasi) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <FileTextIcon className="size-3.5 text-[#15803d]" />
                  Pembahasan (Detail Publikasi)
                </label>
                <Input
                  value={pembahasan}
                  onChange={(e) => setPembahasan(e.target.value)}
                  placeholder="Contoh: CPOTB & BPOM, Formulasi Herbal, Regulasi Izin Edar..."
                  className="h-9 text-xs bg-background rounded-[5px]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <ClockIcon className="size-3.5 text-[#15803d]" />
                    Waktu Baca
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const calculated = calculateReadingTime(compiledMarkdown)
                      setReadingTime(calculated)
                      toast.info(`Waktu baca dihitung ulang: ${calculated}`)
                    }}
                    className="text-[11px] text-[#15803d] dark:text-green-400 hover:underline inline-flex items-center gap-1"
                    title="Hitung ulang otomatis berdasarkan panjang konten artikel"
                  >
                    <RefreshCwIcon className="size-3" />
                    <span>Hitung Otomatis ({calculateReadingTime(compiledMarkdown)})</span>
                  </button>
                </div>
                <Input
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  placeholder="Contoh: 4 min baca"
                  className="h-9 text-xs bg-background rounded-[5px]"
                />
              </div>
            </div>

            {/* Cover Image Upload / URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <ImageIcon className="size-3.5" />
                Cover Gambar Artikel
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex-1 w-full flex gap-2">
                  <Input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://... atau klik upload"
                    className="text-xs bg-background rounded-[5px]"
                  />
                  <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[5px] border border-[#15803d]/30 bg-green-50 dark:bg-green-950/30 px-3 py-2 text-xs font-semibold text-green-800 dark:text-green-300 hover:bg-green-100 transition-colors shrink-0">
                    <UploadCloudIcon className="size-4" />
                    <span>{isUploadingCover ? "Mengunggah..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                    />
                  </label>
                </div>

                {coverImage && (
                  <div className="relative h-12 w-20 overflow-hidden rounded-[5px] border border-border shrink-0">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5 text-white hover:bg-black"
                      title="Hapus Cover"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <TagIcon className="size-3.5" />
                Tagar / Topik
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs gap-1 pl-2.5 pr-1.5 py-0.5 font-normal"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Ketik tagar lalu tekan Enter..."
                  className="text-xs bg-background"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddTag}
                  className="text-xs"
                >
                  Tambah
                </Button>
              </div>
            </div>
          </div>

          {/* Block List Manager */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15803d] inline-block" />
                Blok Konten Artikel ({blocks.length})
              </h2>

              {/* Add Block Dropdown / Quick Bar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("text")}
                  className="h-8 gap-1 text-xs border-[#15803d]/30 text-green-800 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30"
                >
                  <TypeIcon className="size-3.5" />
                  <span>+ Teks</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("heading")}
                  className="h-8 gap-1 text-xs"
                >
                  <span>+ Subjudul</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("image")}
                  className="h-8 gap-1 text-xs"
                >
                  <ImageIcon className="size-3.5" />
                  <span>+ Gambar Grid</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("callout")}
                  className="h-8 gap-1 text-xs"
                >
                  <LightbulbIcon className="size-3.5" />
                  <span>+ Callout</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("quote")}
                  className="h-8 gap-1 text-xs"
                >
                  <QuoteIcon className="size-3.5" />
                  <span>+ Kutipan</span>
                </Button>
              </div>
            </div>

            {/* Blocks Container */}
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                className="group relative rounded-[5px] border border-border bg-card p-4 transition-all hover:border-[#15803d]/40 shadow-xs space-y-3"
              >
                {/* Block Header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <Badge
                      variant="outline"
                      className="font-mono uppercase text-[10px] font-semibold text-green-800 dark:text-green-300 border-[#15803d]/30"
                    >
                      {block.type}
                    </Badge>
                  </div>

                  {/* Block Controls (Move, Duplicate, Delete) */}
                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={idx === 0}
                      title="Pindah ke Atas"
                      className="size-7"
                    >
                      <ArrowUpIcon className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={idx === blocks.length - 1}
                      title="Pindah ke Bawah"
                      className="size-7"
                    >
                      <ArrowDownIcon className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => duplicateBlock(block.id)}
                      title="Duplikasi Blok"
                      className="size-7"
                    >
                      <CopyIcon className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBlock(block.id)}
                      title="Hapus Blok"
                      className="size-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* ================= BLOCK TYPE: TEXT ================= */}
                {block.type === "text" && (
                  <div className="space-y-2">
                    {/* Inline Format Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "bold")}
                        className="rounded px-2 py-1 font-bold hover:bg-muted"
                        title="Tebal (**teks**)"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "italic")}
                        className="rounded px-2 py-1 italic hover:bg-muted font-serif"
                        title="Miring (_teks_)"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "h2")}
                        className="rounded px-2 py-1 font-semibold hover:bg-muted"
                        title="Subjudul H2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "h3")}
                        className="rounded px-2 py-1 font-semibold hover:bg-muted"
                        title="Subjudul H3"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "list")}
                        className="rounded px-2 py-1 hover:bg-muted"
                        title="Daftar Poin (-)"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "quote")}
                        className="rounded px-2 py-1 hover:bg-muted"
                        title="Kutipan (>)"
                      >
                        “ Quote
                      </button>

                      <div className="h-4 w-px bg-border mx-1" />

                      {/* Warna Teks Khusus */}
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "color-green")}
                        className="rounded px-2 py-0.5 text-[11px] font-semibold text-[#15803d] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                        title="Teks Warna Hijau (@g teks @g)"
                      >
                        @g Hijau
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "color-blue")}
                        className="rounded px-2 py-0.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
                        title="Teks Warna Biru (@bl teks @bl)"
                      >
                        @bl Biru
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "color-warning")}
                        className="rounded px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                        title="Teks Warna Kuning (@w teks @w)"
                      >
                        @w Kuning
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "color-alert")}
                        className="rounded px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Teks Warna Merah (@r teks @r)"
                      >
                        @r Merah
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "color-purple")}
                        className="rounded px-2 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                        title="Teks Warna Ungu (@p teks @p)"
                      >
                        @p Ungu
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "badge-link")}
                        className="rounded bg-[#15803d]/10 px-2 py-0.5 text-[11px] font-semibold text-green-800 dark:text-green-300 border border-[#15803d]/25 hover:bg-[#15803d]/20"
                        title="Tautan Teks / Badge (@link url Label @link)"
                      >
                        @link
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatText(block.id, "divider")}
                        className="rounded px-2 py-1 text-[11px] hover:bg-muted"
                        title="Garis Pembatas (---)"
                      >
                        Garis
                      </button>
                    </div>

                    <Textarea
                      id={`textarea-${block.id}`}
                      value={block.value}
                      onChange={(e) =>
                        updateBlock(block.id, { value: e.target.value })
                      }
                      placeholder="Tulis narasi artikel... Gunakan tombol toolbar di atas untuk format teks tebal, miring, list, atau badge khusus."
                      rows={6}
                      className="font-normal text-sm leading-relaxed bg-background"
                    />
                  </div>
                )}

                {/* ================= BLOCK TYPE: HEADING ================= */}
                {block.type === "heading" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select
                        value={String(block.headingLevel || 2)}
                        onValueChange={(val) => {
                          if (val) updateBlock(block.id, { headingLevel: parseInt(val, 10) as 1 | 2 | 3 })
                        }}
                        items={HEADING_LEVEL_OPTIONS}
                      >
                        <SelectTrigger className="h-9 min-w-[195px] rounded-[5px] border-input bg-background text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#15803d]">
                          <SelectValue placeholder="Tingkat Subjudul" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px] border-border shadow-md">
                          <SelectGroup>
                            {HEADING_LEVEL_OPTIONS.map((item) => (
                              <SelectItem key={item.value} value={item.value} className="text-xs font-semibold rounded-[3px] cursor-pointer">
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Input
                        value={block.value}
                        onChange={(e) =>
                          updateBlock(block.id, { value: e.target.value })
                        }
                        placeholder="Tulis judul bagian..."
                        className="h-9 font-bold text-base bg-background flex-1 rounded-[5px]"
                      />
                    </div>
                  </div>
                )}

                {/* ================= BLOCK TYPE: IMAGE ================= */}
                {block.type === "image" && (
                  <div className="space-y-4">
                    {/* Settings: Image Size Bar, Alignment & Aspect Ratio */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 text-xs">
                      {/* Ukuran Bar Slider */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Ukuran:</span>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          step="5"
                          value={block.imageWidth || 100}
                          onChange={(e) =>
                            updateBlock(block.id, { imageWidth: Number(e.target.value) })
                          }
                          className="w-28 sm:w-44 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#15803d]"
                          title={`Ukuran gambar: ${block.imageWidth || 100}%`}
                        />
                        <span className="font-mono text-[11px] font-semibold text-foreground min-w-[38px]">
                          {block.imageWidth || 100}%
                        </span>
                        <div className="hidden sm:flex items-center gap-1 border-l border-border/60 pl-2">
                          {[50, 75, 100].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => updateBlock(block.id, { imageWidth: pct })}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${(block.imageWidth || 100) === pct
                                  ? "bg-[#15803d] text-white font-semibold"
                                  : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rasio & Align */}
                      <div className="flex items-center gap-3 ml-auto">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">Rasio:</span>
                          <div className="flex gap-1">
                            {(["16:9", "4:5", "1:1"] as const).map((ratio) => (
                              <button
                                key={ratio}
                                type="button"
                                onClick={() =>
                                  updateBlock(block.id, { imageRatio: ratio })
                                }
                                className={`px-2 py-1 rounded text-xs font-medium ${(block.imageRatio || "16:9") === ratio
                                    ? "bg-[#15803d] text-white font-semibold"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                                  }`}
                              >
                                {ratio}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Single Image Upload & Preview Container */}
                    {(() => {
                      const img = (block.images && block.images[0]) || { url: "", caption: "", alt: "" }
                      const ratio = block.imageRatio || "16:9"
                      const aspectClass =
                        ratio === "4:5"
                          ? "aspect-[4/5]"
                          : ratio === "1:1"
                            ? "aspect-square"
                            : "aspect-video"
                      const widthPct = block.imageWidth || 100

                      return (
                        <div
                          className="mx-auto transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        >
                          <div className="rounded-[5px] border border-border/80 bg-background p-3 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                              <span>Pratinjau Gambar ({widthPct}%)</span>
                              {img.url && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateBlock(block.id, {
                                      images: [{ url: "", caption: "", alt: "" }],
                                    })
                                  }}
                                  className="text-rose-500 hover:underline"
                                >
                                  Hapus Gambar
                                </button>
                              )}
                            </div>

                            {img.url ? (
                              <div className={`relative ${aspectClass} overflow-hidden rounded-[5px] border border-border bg-zinc-50 dark:bg-zinc-900`}>
                                <img
                                  src={img.url}
                                  alt={img.alt || "Preview"}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <label className={`flex ${aspectClass} cursor-pointer flex-col items-center justify-center rounded-[5px] border-2 border-dashed border-border hover:border-[#15803d] bg-muted/20 p-4 text-center transition-colors`}>
                                <UploadCloudIcon className="size-8 text-muted-foreground mb-1.5" />
                                <span className="text-xs font-semibold text-[#15803d] dark:text-green-400">
                                  Upload Gambar
                                </span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">
                                  WebP, PNG, JPG (Maks. 5MB)
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0]
                                    if (f) handleBlockImageUpload(block.id, 0, f)
                                  }}
                                />
                              </label>
                            )}

                            <Input
                              value={img.url}
                              onChange={(e) => {
                                updateBlock(block.id, {
                                  images: [{ url: e.target.value, caption: "", alt: "" }],
                                })
                              }}
                              placeholder="Atau tempel URL gambar (https://...)..."
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* ================= BLOCK TYPE: CALLOUT ================= */}
                {block.type === "callout" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Select
                        value={block.calloutType || "tip"}
                        onValueChange={(val) => {
                          if (val) updateBlock(block.id, { calloutType: val as CalloutType })
                        }}
                        items={CALLOUT_TYPE_OPTIONS}
                      >
                        <SelectTrigger className="h-9 min-w-[215px] rounded-[5px] border-input bg-background text-xs font-semibold focus-visible:ring-1 focus-visible:ring-[#15803d]">
                          <SelectValue placeholder="Tipe Callout" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px] border-border shadow-md">
                          <SelectGroup>
                            {CALLOUT_TYPE_OPTIONS.map((item) => (
                              <SelectItem key={item.value} value={item.value} className="text-xs font-semibold rounded-[3px] cursor-pointer">
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Input
                        value={block.calloutTitle || ""}
                        onChange={(e) =>
                          updateBlock(block.id, { calloutTitle: e.target.value })
                        }
                        placeholder="Judul Callout (opsional)..."
                        className="h-9 text-xs bg-background flex-1 rounded-[5px]"
                      />
                    </div>
                    <Textarea
                      value={block.value}
                      onChange={(e) =>
                        updateBlock(block.id, { value: e.target.value })
                      }
                      placeholder="Isi pesan callout / sorotan penting..."
                      rows={3}
                      className="text-xs leading-relaxed bg-background"
                    />
                  </div>
                )}

                {/* ================= BLOCK TYPE: QUOTE ================= */}
                {block.type === "quote" && (
                  <div className="space-y-2">
                    <Textarea
                      value={block.value}
                      onChange={(e) =>
                        updateBlock(block.id, { value: e.target.value })
                      }
                      placeholder="Teks kutipan..."
                      rows={3}
                      className="text-xs italic bg-background"
                    />
                    <Input
                      value={block.quoteAuthor || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { quoteAuthor: e.target.value })
                      }
                      placeholder="Sumber / Nama Peneliti / Apoteker..."
                      className="text-xs bg-background"
                    />
                  </div>
                )}

                {/* ================= BLOCK TYPE: CODE ================= */}
                {block.type === "code" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        Bahasa / Tipe:
                      </span>
                      <Input
                        value={block.codeLang || "bash"}
                        onChange={(e) =>
                          updateBlock(block.id, { codeLang: e.target.value })
                        }
                        placeholder="python / json / formula / bash"
                        className="text-xs h-7 w-36 bg-background font-mono"
                      />
                    </div>
                    <Textarea
                      value={block.value}
                      onChange={(e) =>
                        updateBlock(block.id, { value: e.target.value })
                      }
                      placeholder="Tulis kode, formula, atau spesifikasi teknis di sini..."
                      rows={5}
                      className="font-mono text-xs bg-zinc-950 text-zinc-100"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Add Block Bottom Action */}
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-border rounded-[5px] bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Tambah Blok Baru:
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("text")}
                  className="text-xs gap-1"
                >
                  <PlusIcon className="size-3.5" />
                  Teks
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("image")}
                  className="text-xs gap-1"
                >
                  <PlusIcon className="size-3.5" />
                  Gambar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("callout")}
                  className="text-xs gap-1"
                >
                  <PlusIcon className="size-3.5" />
                  Callout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dialog Kelola & Hapus Kategori */}
      <Dialog open={isManagingCategories} onOpenChange={setIsManagingCategories}>
        <DialogContent className="max-w-md rounded-[8px] p-5 shadow-xl border border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <FolderIcon className="size-4 text-[#15803d]" />
              Kelola & Hapus Kategori Insight
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tambah kategori baru atau hapus kategori yang tidak lagi dibutuhkan.
            </DialogDescription>
          </DialogHeader>

          {/* Input Tambah di dalam Modal */}
          <div className="flex gap-2 pt-1">
            <Input
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCategory()
                }
              }}
              placeholder="Ketik nama kategori baru..."
              className="h-9 text-xs bg-background rounded-[5px] flex-1"
            />
            <Button
              type="button"
              onClick={() => handleAddCategory()}
              className="h-9 text-xs bg-[#15803d] hover:bg-[#166534] text-white px-3 font-semibold rounded-[5px] gap-1 shrink-0"
            >
              <PlusIcon className="size-3.5" />
              <span>Tambah</span>
            </Button>
          </div>

          {/* Daftar Kategori dengan Tombol Hapus */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 border rounded-[5px] p-2 bg-muted/20">
            {categories.map((cat) => {
              const isCurrent = category === cat
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between p-2 rounded-[5px] bg-card border border-border/70 hover:border-border transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-foreground truncate">
                      {cat}
                    </span>
                    {isCurrent && (
                      <Badge className="bg-[#15803d]/15 text-[#15803d] dark:text-green-300 border-[#15803d]/30 text-[10px] px-1.5 py-0 font-medium rounded-[3px]">
                        Sedang Aktif
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(cat)}
                    disabled={categories.length <= 1}
                    className="h-7 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 rounded-[4px] shrink-0"
                    title={`Hapus kategori "${cat}"`}
                  >
                    <Trash2Icon className="size-3.5" />
                    <span>Hapus</span>
                  </Button>
                </div>
              )
            })}
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t border-border/60 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetCategories}
              className="text-xs text-muted-foreground hover:text-foreground h-8 rounded-[5px]"
            >
              Reset ke Default
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsManagingCategories(false)}
              className="bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs h-8 px-4 rounded-[5px]"
            >
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

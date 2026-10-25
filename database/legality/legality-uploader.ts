import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  LEGALITY_STORAGE_BUCKET,
  LEGALITY_STORAGE_FOLDER,
} from "./legality-config"

/**
 * Kompresi gambar dokumen tanpa merusak ketajaman teks (resolusi tinggi hingga 2000px).
 * Sertifikat/dokumen legal memerlukan ketajaman teks yang lebih tinggi dibandingkan gambar biasa.
 */
function compressDocumentImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Browser environment only"))

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX_DIMENSION = 2048 // Resolusi tajam untuk sertifikat/dokumen
        let width = img.width
        let height = img.height

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width)
            width = MAX_DIMENSION
          } else {
            width = Math.round((width * MAX_DIMENSION) / height)
            height = MAX_DIMENSION
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas tidak didukung"))

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error("Kompresi gambar gagal"))
          },
          "image/webp",
          0.88 // Kualitas tinggi agar teks pada sertifikat tetap terbaca jelas
        )
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

/**
 * Upload dokumen (Foto Sertifikat / PDF) ke Supabase Storage.
 * - Gambar otomatis dioptimasi dengan mempertahankan ketajaman teks.
 * - PDF diunggah langsung dengan MIME type application/pdf.
 * - Jika Supabase Storage offline/belum terkonfigurasi, otomatis fallback ke Data URL Base64.
 */
export async function uploadLegalityDocument(
  file: File,
  docId?: string
): Promise<{ url: string; isPdf: boolean; fileName: string }> {
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")

  const safePrefix = docId ? docId.replace(/[^a-zA-Z0-9_-]/g, "") : "doc"
  const timestamp = Date.now()

  let finalBlob: Blob = file
  let contentType = file.type || (isPdf ? "application/pdf" : "image/webp")
  let ext = isPdf ? "pdf" : "webp"

  // Optimasi jika berupa gambar
  if (!isPdf && file.type.startsWith("image/")) {
    try {
      finalBlob = await compressDocumentImage(file)
      contentType = "image/webp"
      ext = "webp"
    } catch (err) {
      console.warn("[LegalityUploader] Kompresi dilewati, menggunakan file asli:", err)
      ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      contentType = file.type || "image/jpeg"
    }
  }

  // 1. Coba upload ke Supabase Storage jika terkonfigurasi
  if (isSupabaseConfigured) {
    try {
      const filePath = `${LEGALITY_STORAGE_FOLDER}/${safePrefix}-${timestamp}.${ext}`

      const { data, error } = await supabase.storage
        .from(LEGALITY_STORAGE_BUCKET)
        .upload(filePath, finalBlob, {
          cacheControl: "31536000",
          upsert: true,
          contentType,
        })

      if (!error && data?.path) {
        const { data: urlData } = supabase.storage
          .from(LEGALITY_STORAGE_BUCKET)
          .getPublicUrl(data.path)

        if (urlData?.publicUrl) {
          return {
            url: urlData.publicUrl,
            isPdf,
            fileName: file.name,
          }
        }
      } else if (error) {
        console.warn("[LegalityUploader] Upload Supabase Storage gagal, menggunakan fallback:", error)
      }
    } catch (err) {
      console.warn("[LegalityUploader] Error saat mengunggah ke Supabase:", err)
    }
  }

  // 2. Fallback Base64 jika storage Supabase gagal / offline
  const base64Url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  return {
    url: base64Url,
    isPdf,
    fileName: file.name,
  }
}

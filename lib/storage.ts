import { supabase } from './supabase'

/**
 * Kompres file gambar menjadi WebP
 */
/**
 * Kompres gambar khusus untuk broadcast notifikasi FCM
 * FCM hanya mendukung JPEG/PNG — BUKAN WebP
 * Max 600px lebar, kualitas JPEG 0.75 (target <100KB)
 */
export const compressImageForBroadcast = (file: File | Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Bukan di browser'))

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 600
        let width = img.width
        let height = img.height

        // Pertahankan aspect ratio, max lebar 600px
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas tidak didukung'))

        // Background putih (penting untuk JPEG transparan)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        // Output JPEG — FCM tidak support WebP untuk gambar notifikasi
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Kompresi gagal'))
          },
          'image/jpeg',
          0.75
        )
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

export const compressImageToWebP = (file: File | Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Bukan di browser'))
    
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX_SIZE = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas tidak didukung"))

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error("Kompresi gagal"))
          },
          "image/webp",
          0.8
        )
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

/**
 * Upload a file to Supabase Storage bucket "media"
 * Automatically compresses to WebP first!
 * Returns the public URL of the uploaded file
 */
export async function uploadMedia(file: File, folder: string = 'images', forBroadcast: boolean = false): Promise<string | null> {
  let finalBlob: Blob = file
  let fileExt = forBroadcast ? 'jpg' : 'webp'
  let contentType = forBroadcast ? 'image/jpeg' : 'image/webp'

  try {
    if (forBroadcast) {
      // Khusus broadcast: pakai JPEG agar FCM support gambar di notifikasi
      finalBlob = await compressImageForBroadcast(file)
    } else {
      finalBlob = await compressImageToWebP(file)
    }
  } catch (err) {
    console.warn('Gagal kompresi, menggunakan file asli:', err)
    fileExt = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg'
    contentType = file.type || 'image/jpeg'
  }

  const cleanFolder = folder.replace(/^\/+|\/+$/g, '')
  const fileName = `${cleanFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt.toLowerCase()}`

  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, finalBlob, {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType
    })

  if (error) {
    console.error('[Storage] Upload error:', error.message || error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Upload logo khusus ke Supabase Storage bucket "media/topbar_logo"
 * Mempertahankan transparansi PNG/SVG dan mengompresi format lainnya
 */
export async function uploadLogoMedia(file: File): Promise<string | null> {
  const fileExt = file.name ? file.name.split('.').pop()?.toLowerCase() || 'png' : 'png'
  const isSvg = fileExt === 'svg' || file.type.includes('svg')
  const isPng = fileExt === 'png' || file.type.includes('png')

  let finalBlob: Blob = file
  let contentType = file.type || (isPng ? 'image/png' : isSvg ? 'image/svg+xml' : 'image/webp')

  if (!isSvg && !isPng) {
    try {
      finalBlob = await compressImageToWebP(file)
      contentType = 'image/webp'
    } catch (e) {
      // fallback to original file
    }
  }

  const cleanName = (file.name || 'logo').replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileName = `topbar_logo/${Date.now()}-${cleanName}`

  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, finalBlob, {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType,
    })

  if (error) {
    console.error('Upload logo error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Upload an avatar to Supabase Storage bucket "media"
 * Uses a fixed filename (userId) and upserts (overwrites) if it exists.
 */
export async function uploadAvatar(file: Blob, userId: string): Promise<string | null> {
  const fileName = `avatars/${userId}.webp`

  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/webp'
    })

  if (error) {
    console.error('Upload avatar error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(data.path)

  // Tambahkan query cache buster agar browser langsung memuat gambar baru
  return `${urlData.publicUrl}?v=${Date.now()}`
}

/**
 * Delete a file from the media bucket by its public URL
 */
export async function deleteMedia(publicUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const urlObj = new URL(publicUrl)
    // Mencari '/media/' di pathname
    const mediaIndex = urlObj.pathname.indexOf('/media/')
    if (mediaIndex === -1) return { success: false, error: "URL tidak valid (tidak ada /media/)" }

    // Mengambil semua karakter setelah '/media/'
    const filePath = decodeURIComponent(urlObj.pathname.substring(mediaIndex + 7))

    const { error } = await supabase.storage
      .from('media')
      .remove([filePath])

    if (error) {
      console.error("Gagal menghapus media:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("URL tidak valid untuk dihapus:", err)
    return { success: false, error: err.message }
  }
}

/**
 * Kompres gambar background dengan resolusi tinggi (1920px untuk desktop, 1080px untuk mobile)
 */
export const compressBackgroundToWebP = (file: File | Blob, maxSize: number = 1920): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Bukan di browser'))
    
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas tidak didukung"))

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error("Kompresi gagal"))
          },
          "image/webp",
          0.85
        )
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

/**
 * Upload background khusus pembuka ke Supabase Storage bucket "media/landing_bg"
 */
export async function uploadLandingBgMedia(file: File, type: 'desktop' | 'mobile'): Promise<string | null> {
  const maxSize = type === 'desktop' ? 1920 : 1080
  let finalBlob: Blob = file
  let contentType = 'image/webp'

  try {
    finalBlob = await compressBackgroundToWebP(file, maxSize)
  } catch (err) {
    console.warn('Gagal kompresi background, menggunakan file asli:', err)
    contentType = file.type || 'image/jpeg'
  }

  const cleanName = (file.name || 'bg').replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileName = `landing_bg/${Date.now()}-${type}-${cleanName}.webp`

  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, finalBlob, {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType,
    })

  if (error) {
    console.error('Upload background error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Upload media khusus halaman Our Products ke Supabase Storage bucket "media/our_products"
 * Folder terpisah dari halaman lain (about_us, jenis_produk, landing_bg, dll)
 * Otomatis kompresi ke WebP.
 */
export async function uploadOurProductsMedia(
  file: File,
  subfolder: 'banners' | 'stores' | 'cards' | 'store_cards' | 'slides' | 'products' | 'general' = 'general'
): Promise<string | null> {
  let finalBlob: Blob = file
  let contentType = 'image/webp'

  try {
    finalBlob = await compressImageToWebP(file)
  } catch (err) {
    console.warn('[OurProducts Storage] Gagal kompresi, menggunakan file asli:', err)
    contentType = file.type || 'image/jpeg'
  }

  const cleanName = (file.name || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileName = `our_products/${subfolder}/${Date.now()}-${cleanName}.webp`

  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, finalBlob, {
      cacheControl: '3600',
      upsert: false,
      contentType: contentType,
    })

  if (error) {
    console.error('[OurProducts Storage] Upload error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}


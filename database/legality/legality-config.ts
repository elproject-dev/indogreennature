/**
 * Konfigurasi Database Supabase Terpisah untuk Halaman Legality
 * CV. Indo Green Nature
 */

// Nama tabel khusus untuk konfigurasi legality
export const LEGALITY_PRIMARY_TABLE = "legality_config" as const

// Kunci unik konfigurasi di dalam tabel
export const LEGALITY_PRIMARY_KEY = "main_legality_data" as const

// Tabel & Kunci Fallback (kompatibilitas dengan app_config jika tabel belum dibuat)
export const LEGALITY_FALLBACK_TABLE = "app_config" as const
export const LEGALITY_FALLBACK_KEY = "legality_page_config" as const

// Konfigurasi Storage Supabase untuk upload dokumen
export const LEGALITY_STORAGE_BUCKET = "media" as const
export const LEGALITY_STORAGE_FOLDER = "legality_documents" as const

// LocalStorage key untuk cache sinkron di browser
export const LEGALITY_CACHE_KEY = "cv_legality_page_settings_data_v1" as const

// Channel broadcast lintas tab (untuk pratinjau real-time)
export const LEGALITY_BROADCAST_CHANNEL = "cv_legality_preview_channel" as const

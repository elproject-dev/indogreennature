import { supabase } from "@/lib/supabase"

export interface TrackClickParams {
  buttonType: "whatsapp_order" | "whatsapp_contact" | "tokopedia" | "shopee" | "tiktok" | string
  itemName?: string
  pagePath?: string
}

/**
 * Mencatat klik tombol ke tabel Supabase `button_clicks`
 * Dijalankan secara asinkron tanpa memblokir pembukaan URL/link pengguna
 */
export function trackButtonClick({ buttonType, itemName, pagePath }: TrackClickParams) {
  try {
    const path = pagePath || (typeof window !== "undefined" ? window.location.pathname : "")

    supabase
      .from("button_clicks")
      .insert([
        {
          button_type: buttonType,
          item_name: itemName || null,
          page_path: path,
        },
      ])
      .then(({ error }) => {
        if (error) {
          console.warn("Gagal mencatat klik:", error.message)
        }
      })
  } catch (err) {
    console.warn("Error tracking click:", err)
  }
}

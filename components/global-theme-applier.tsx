"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { applyGlobalTheme, getStoredTheme, saveStoredTheme } from "@/lib/theme"

export function GlobalThemeApplier() {
  // Terapkan konfigurasi setelah hidrasi selesai agar tidak memicu React error #418 pada elemen <html>
  useEffect(() => {
    const cached = getStoredTheme()
    applyGlobalTheme(cached)
  }, [])

  useEffect(() => {
    const cached = getStoredTheme()

    // 2. Sinkronkan dengan Supabase app_config
    const fetchRemote = async () => {
      try {
        const { data } = await supabase
          .from("app_config")
          .select("key, value")
          .in("key", [
            "global_primary_color",
            "global_font",
            "global_primary_soft",
            "global_brand_accent",
            "global_background_color",
          ])

        if (data && data.length > 0) {
          const cfg: Record<string, string> = {}
          data.forEach(item => {
            cfg[item.key] = item.value
          })
          const updated = {
            primary: cfg.global_primary_color || cached.primary,
            font: cfg.global_font || cached.font,
            primarySoft: cfg.global_primary_soft || cached.primarySoft,
            brandAccent: cfg.global_brand_accent || cached.brandAccent,
            background: cfg.global_background_color || cached.background || "#FFFFFF",
          }
          saveStoredTheme(updated)
          applyGlobalTheme(updated)
        }
      } catch (e) {
        // Mengabaikan kegagalan jaringan & tetap memakai cache
      }
    }
    fetchRemote()

    // 3. Pasang event listener untuk pembaruan tema live
    const handleUpdate = (e: any) => {
      if (e.detail) {
        applyGlobalTheme(e.detail)
      }
    }
    window.addEventListener("global-theme-updated", handleUpdate as EventListener)

    return () => {
      window.removeEventListener("global-theme-updated", handleUpdate as EventListener)
    }
  }, [])

  return null
}

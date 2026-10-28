"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { applyGlobalTheme, getStoredTheme, saveStoredTheme } from "@/lib/theme"

export function GlobalThemeApplier() {
  // Tangani error hidrasi dari ekstensi browser (Google Translate / grammarly) secara aman di client
  useEffect(() => {
    try {
      if (typeof Node !== "undefined" && Node.prototype) {
        const r = Node.prototype.removeChild
        Node.prototype.removeChild = function (c: any) {
          if (c && c.parentNode !== this) return c
          return r.apply(this, arguments as any)
        }
        const i = Node.prototype.insertBefore
        Node.prototype.insertBefore = function (n: any, ref: any) {
          if (ref && ref.parentNode !== this) return n
          return i.apply(this, arguments as any)
        }
      }
      const o = console.error
      console.error = function () {
        const m = arguments[0]
        if (
          typeof m === "string" &&
          (m.indexOf("418") !== -1 ||
            m.indexOf("423") !== -1 ||
            m.indexOf("Hydration") !== -1 ||
            m.indexOf("removeChild") !== -1 ||
            m.indexOf("insertBefore") !== -1)
        )
          return
        if (
          m &&
          m.message &&
          (m.message.indexOf("418") !== -1 ||
            m.message.indexOf("423") !== -1 ||
            m.message.indexOf("removeChild") !== -1 ||
            m.message.indexOf("insertBefore") !== -1)
        )
          return
        o.apply(console, arguments as any)
      }
      window.addEventListener(
        "error",
        function (e: any) {
          if (
            e &&
            ((e.message &&
              (e.message.indexOf("418") !== -1 ||
                e.message.indexOf("423") !== -1 ||
                e.message.indexOf("removeChild") !== -1 ||
                e.message.indexOf("insertBefore") !== -1 ||
                e.message.indexOf("NotFoundError") !== -1)) ||
              e.name === "NotFoundError")
          ) {
            e.preventDefault()
            e.stopImmediatePropagation()
            return true
          }
        },
        true
      )
    } catch {}
  }, [])

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

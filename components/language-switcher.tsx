"use client"

import React, { useEffect, useState, useTransition } from "react"
import { Check, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type Language = "id" | "en"

const LANGUAGES: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: "id", label: "Indonesia", flag: "🇮🇩", nativeName: "Bahasa Indonesia" },
  { code: "en", label: "English", flag: "🇬🇧", nativeName: "English (Auto)" },
]

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"))
  return match ? decodeURIComponent(match[3]) : null
}

function setLanguageCookie(lang: Language) {
  if (typeof window === "undefined") return

  const hostname = window.location.hostname
  const val = lang === "en" ? "/auto/en" : "/auto/id"

  // 1. Bersihkan semua cookie lama agar tidak terjadi konflik domain
  const domains = ["", hostname]
  if (hostname.includes(".")) {
    domains.push("." + hostname)
    const parts = hostname.split(".")
    if (parts.length >= 2) {
      domains.push("." + parts.slice(-2).join("."))
    }
  }

  domains.forEach((d) => {
    const dStr = d ? `; domain=${d}` : ""
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${dStr}`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=""${dStr}`
  })

  // 2. Tulis cookie baru yang bersih
  document.cookie = `googtrans=${val}; path=/; max-age=31536000; SameSite=Lax`
  if (lang === "en") {
    document.cookie = `googtrans=/id/en; path=/; max-age=31536000; SameSite=Lax`
  }
  if (hostname && hostname !== "localhost") {
    document.cookie = `googtrans=${val}; domain=${hostname}; path=/; max-age=31536000; SameSite=Lax`
  }
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const [currentLang, setCurrentLang] = useState<Language>("id")
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)

    // Cek dari cookie googtrans atau localStorage
    const cookieVal = getCookie("googtrans")
    const storedLang = localStorage.getItem("app_language") as Language | null

    if (cookieVal && cookieVal.includes("/en")) {
      setCurrentLang("en")
    } else if (storedLang === "en") {
      setCurrentLang("en")
    } else {
      setCurrentLang("id")
    }
  }, [])

  const handleSelectLanguage = (lang: Language) => {
    if (lang === currentLang) return

    startTransition(() => {
      setCurrentLang(lang)
      try {
        localStorage.setItem("app_language", lang)
      } catch (e) {}

      setLanguageCookie(lang)

      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null

      // Jika kembali ke bahasa Indonesia (ID):
      // Reload adalah cara paling bersih 100% untuk memulihkan seluruh text node asli
      if (lang === "id") {
        window.location.reload()
        return
      }

      // Jika berpindah ke English:
      if (combo) {
        combo.value = "en"
        combo.dispatchEvent(new Event("change", { bubbles: true }))

        // Verifikasi apakah Google Translate aktif dalam 600ms, jika belum, lakukan reload dengan cookie
        setTimeout(() => {
          const hasTranslated = document.querySelector("html.translated-ltr, html.translated-rtl")
          if (!hasTranslated) {
            window.location.reload()
          }
        }, 650)
      } else {
        // Jika script Google Translate belum selesai dimuat di DOM, reload langsung dengan cookie
        window.location.reload()
      }
    })
  }

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "notranslate flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 outline-none select-none",
          "bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-sm backdrop-blur-sm",
          isPending && "opacity-60 pointer-events-none",
          className
        )}
        translate="no"
        aria-label="Pilih Bahasa / Select Language"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin notranslate" />
        ) : (
          <span className="text-sm leading-none notranslate">{activeLangObj.flag}</span>
        )}
        <span className="text-[11px] font-bold tracking-wider uppercase notranslate">
          {activeLangObj.code}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-44 p-1.5 rounded-xl bg-card border border-border/60 shadow-xl backdrop-blur-md notranslate"
        translate="no"
      >
        <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase notranslate">
          Bahasa / Language
        </div>
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.code
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors notranslate",
                isSelected
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2 notranslate">
                <span className="text-base leading-none notranslate">{lang.flag}</span>
                <span className="notranslate">{lang.nativeName}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-primary notranslate" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

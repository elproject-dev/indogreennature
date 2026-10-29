"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

// Monkey-patch Node DOM manipulation to protect React against Google Translate mutations
if (typeof window !== "undefined" && typeof Node !== "undefined" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child && child.parentNode !== this) {
      return child
    }
    return originalRemoveChild.apply(this, arguments as any) as T
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode
    }
    return originalInsertBefore.apply(this, arguments as any) as T
  }
}

export function GoogleTranslator() {
  const pathname = usePathname()

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "id",
              includedLanguages: "id,en",
              autoDisplay: false,
            },
            "google_translate_element"
          )
        }
      } catch (err) {
        // Silently catch translation init errors
      }
    }

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit()
    }
  }, [])

  // Auto-translate ulang saat terjadi navigasi halaman di Next.js
  useEffect(() => {
    if (typeof window === "undefined") return

    const storedLang = localStorage.getItem("app_language")
    const cookie = document.cookie
    const isEnglish = storedLang === "en" || cookie.includes("/en")

    if (isEnglish) {
      const timer = setTimeout(() => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null
        if (combo) {
          combo.value = "en"
          combo.dispatchEvent(new Event("change", { bubbles: true }))
        }
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  return (
    <>
      <div id="google_translate_element" className="hidden" style={{ display: "none" }} />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </>
  )
}

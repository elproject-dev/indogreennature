import { getHeroFontClass, getHeroFontFamily, getAllHeroFontClasses } from "@/lib/fonts"

export interface GlobalThemeConfig {
  primary: string
  primarySoft: string
  brandAccent: string
  font: string
  background: string
}

export const DEFAULT_THEME: GlobalThemeConfig = {
  primary: "#23bc00",
  primarySoft: "#dcfce7",
  brandAccent: "#16a34a",
  font: "outfit",
  background: "#FFFFFF",
}

export const BACKGROUND_PRESETS = [
  { name: "Putih Bersih", hex: "#FFFFFF", desc: "Terang, bersih & minimalis (Default)" },
  { name: "Abu Slate Halus", hex: "#f8fafc", desc: "Modern, elegan & nyaman di mata" },
  { name: "Herbal Soft", hex: "#f0fdf4", desc: "Sentuhan nuansa herbal alami" },
  { name: "Warm Cream", hex: "#fefce8", desc: "Hangat, organik & lembut" },
  { name: "Off White", hex: "#f4f5f4", desc: "Netral natural" },
  { name: "Dark Slate", hex: "#0f172a", desc: "Nuansa gelap eksklusif & modern" },
  { name: "Hitam Pekat", hex: "#000000", desc: "Full dark kontras tinggi" },
]

export const COLOR_PRESETS = [
  { name: "Hijau Herbal", hex: "#23bc00", desc: "Default CV. Indo Green Nature" },
  { name: "Hijau Zamrud", hex: "#10b981", desc: "Emerald Fresh & Alami" },
  { name: "Hijau Hutan", hex: "#15803d", desc: "Forest Green Elegan" },
  { name: "Hijau Daun Teh", hex: "#059669", desc: "Teal Green Botanical" },
  { name: "Hijau Zaitun", hex: "#4d7c0f", desc: "Olive Herbal Alami" },
  { name: "Biru Samudra", hex: "#0284c7", desc: "Ocean Clean & Segar" },
  { name: "Biru Indigo", hex: "#4f46e5", desc: "Modern Tech & Premium" },
  { name: "Ungu Lavender", hex: "#7c3aed", desc: "Botanical Soft Purple" },
  { name: "Coklat Kayu", hex: "#844b09", desc: "Warm Herbal & Woody" },
  { name: "Merah Herbal", hex: "#b91c1c", desc: "Terracotta & Tegas" },
  { name: "Oranye Rempah", hex: "#ea580c", desc: "Warm Ginger & Spice" },
  { name: "Abu Slate", hex: "#334155", desc: "Minimalis & Netral" },
]

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
  }
  return null
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
  )
}

export function generateThemeColors(primaryHex: string): {
  primary: string
  primarySoft: string
  brandAccent: string
} {
  const rgb = hexToRgb(primaryHex)
  if (!rgb) {
    return {
      primary: primaryHex,
      primarySoft: "#dcfce7",
      brandAccent: "#16a34a",
    }
  }

  // Soft tint: mix 12% primary with 88% white
  const softR = rgb.r * 0.12 + 255 * 0.88
  const softG = rgb.g * 0.12 + 255 * 0.88
  const softB = rgb.b * 0.12 + 255 * 0.88
  const primarySoft = rgbToHex(softR, softG, softB)

  // Accent: 80% brightness of primary
  const accentR = rgb.r * 0.80
  const accentG = rgb.g * 0.80
  const accentB = rgb.b * 0.80
  const brandAccent = rgbToHex(accentR, accentG, accentB)

  return {
    primary: primaryHex,
    primarySoft,
    brandAccent,
  }
}

export function getStoredTheme(): GlobalThemeConfig {
  if (typeof window === "undefined") return DEFAULT_THEME
  try {
    const cached = localStorage.getItem("global_theme_config")
    if (cached) {
      const parsed = JSON.parse(cached)
      return {
        primary: parsed.primary || DEFAULT_THEME.primary,
        primarySoft: parsed.primarySoft || DEFAULT_THEME.primarySoft,
        brandAccent: parsed.brandAccent || DEFAULT_THEME.brandAccent,
        font: parsed.font || DEFAULT_THEME.font,
        background: parsed.background || DEFAULT_THEME.background,
      }
    }
  } catch (e) {}
  return DEFAULT_THEME
}

export function saveStoredTheme(config: GlobalThemeConfig) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("global_theme_config", JSON.stringify(config))
  } catch (e) {}
}

export function applyGlobalTheme(config: Partial<GlobalThemeConfig>) {
  if (typeof window === "undefined") return

  const primary = config.primary || DEFAULT_THEME.primary
  const primarySoft = config.primarySoft || DEFAULT_THEME.primarySoft
  const brandAccent = config.brandAccent || DEFAULT_THEME.brandAccent
  const fontId = config.font || DEFAULT_THEME.font
  const background = config.background || DEFAULT_THEME.background

  const root = document.documentElement

  // 1. Set CSS Variables for Colors
  root.style.setProperty("--primary", primary)
  root.style.setProperty("--ring", primary)
  root.style.setProperty("--sidebar-primary", primary)
  root.style.setProperty("--chart-1", primary)
  root.style.setProperty("--primary-soft", primarySoft)
  root.style.setProperty("--secondary", primarySoft)
  root.style.setProperty("--accent", primarySoft)
  root.style.setProperty("--brand-accent", brandAccent)

  // 2. Set Background Color & Adaptive Text Contrast
  root.style.setProperty("--background", background)
  root.style.setProperty("--card-alt", background)

  const rgb = hexToRgb(background)
  if (rgb) {
    const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    if (lum < 0.45) {
      root.style.setProperty("--foreground", "#f8fafc")
      root.style.setProperty("--card-foreground", "#f8fafc")
    } else {
      root.style.setProperty("--foreground", "#0f172a")
      root.style.setProperty("--card-foreground", "#0f172a")
    }
  }

  // 3. Set Font
  const fontFamily = getHeroFontFamily(fontId)
  root.style.setProperty("--font-sans", fontFamily)
  root.style.fontFamily = fontFamily

  if (document.body) {
    document.body.style.fontFamily = fontFamily

    const allFontClasses = getAllHeroFontClasses()
    allFontClasses.forEach(cls => {
      if (cls) document.body.classList.remove(cls)
    })
    const selectedCls = getHeroFontClass(fontId)
    if (selectedCls) {
      document.body.classList.add(selectedCls)
    }
  }
}

import {
  Outfit,
  Jockey_One,
  McLaren,
  Playfair_Display,
  Bebas_Neue,
  Caveat,
  Pacifico,
  Cinzel,
  Righteous,
  Lobster,
  Poiret_One,
  Plus_Jakarta_Sans,
  Abril_Fatface,
  Dancing_Script,
  Montserrat,
  Satisfy,
  Oswald,
  Great_Vibes,
  Poppins,
} from "next/font/google"

// Outfit adalah variable font: satu file mencakup semua weight (300-800).
export const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans", display: "swap", preload: false })
export const jockey = Jockey_One({ weight: "400", subsets: ["latin"], preload: false })
export const mclaren = McLaren({ weight: "400", subsets: ["latin"], preload: false })

export const playfair = Playfair_Display({ subsets: ["latin"], preload: false })
export const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], preload: false })
export const caveat = Caveat({ subsets: ["latin"], preload: false })
export const pacifico = Pacifico({ weight: "400", subsets: ["latin"], preload: false })
export const cinzel = Cinzel({ subsets: ["latin"], preload: false })
export const righteous = Righteous({ weight: "400", subsets: ["latin"], preload: false })
export const lobster = Lobster({ weight: "400", subsets: ["latin"], preload: false })
export const poiret = Poiret_One({ weight: "400", subsets: ["latin"], preload: false })
export const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], preload: false })
export const abril = Abril_Fatface({ weight: "400", subsets: ["latin"], preload: false })
export const dancing = Dancing_Script({ subsets: ["latin"], preload: false })
export const montserrat = Montserrat({ subsets: ["latin"], preload: false })
export const satisfy = Satisfy({ weight: "400", subsets: ["latin"], preload: false })
export const oswald = Oswald({ subsets: ["latin"], preload: false })
export const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], preload: false })
export const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"], display: "swap", preload: false })

export interface HeroFontOption {
  id: string
  name: string
  category: string
  description?: string
  className: string
  fontFamily: string
}

export const HERO_FONTS: HeroFontOption[] = [
  { id: "outfit", name: "Outfit", category: "Modern & Ramah", className: outfit.className, fontFamily: outfit.style.fontFamily, description: "Geometris & Minimalis (Default)" },
  { id: "plus_jakarta", name: "Plus Jakarta Sans", category: "Modern & Ramah", className: plusJakarta.className, fontFamily: plusJakarta.style.fontFamily, description: "Kontemporer Elegan" },
  { id: "poppins", name: "Poppins", category: "Modern & Ramah", className: poppins.className, fontFamily: poppins.style.fontFamily, description: "Geometris Populer & Bersih" },
  { id: "montserrat", name: "Montserrat", category: "Modern & Ramah", className: montserrat.className, fontFamily: montserrat.style.fontFamily, description: "Bersih & Populer" },
  { id: "mclaren", name: "McLaren", category: "Modern & Ramah", className: mclaren.className, fontFamily: mclaren.style.fontFamily, description: "Ceria & Bersahabat" },

  { id: "jockey", name: "Jockey One", category: "Display / Bold", className: jockey.className, fontFamily: jockey.style.fontFamily, description: "Bold & Sporty" },
  { id: "bebas", name: "Bebas Neue", category: "Display / Bold", className: bebas.className, fontFamily: bebas.style.fontFamily, description: "Tegas & Huruf Kapital Ramping" },
  { id: "righteous", name: "Righteous", category: "Display / Bold", className: righteous.className, fontFamily: righteous.style.fontFamily, description: "Modern Retro Display" },
  { id: "oswald", name: "Oswald", category: "Display / Bold", className: oswald.className, fontFamily: oswald.style.fontFamily, description: "Klasik Bold Tegak" },

  { id: "playfair", name: "Playfair Display", category: "Serif & Mewah", className: playfair.className, fontFamily: playfair.style.fontFamily, description: "Klasik Mewah & Estetik" },
  { id: "cinzel", name: "Cinzel", category: "Serif & Mewah", className: cinzel.className, fontFamily: cinzel.style.fontFamily, description: "Elegan Ala Butik" },
  { id: "abril", name: "Abril Fatface", category: "Serif & Mewah", className: abril.className, fontFamily: abril.style.fontFamily, description: "Tebal & Dramatis" },
  { id: "poiret", name: "Poiret One", category: "Serif & Mewah", className: poiret.className, fontFamily: poiret.style.fontFamily, description: "Art Deco Ramping" },

  { id: "caveat", name: "Caveat", category: "Tulisan Tangan / Script", className: caveat.className, fontFamily: caveat.style.fontFamily, description: "Papan Tulis Kafe Santai" },
  { id: "pacifico", name: "Pacifico", category: "Tulisan Tangan / Script", className: pacifico.className, fontFamily: pacifico.style.fontFamily, description: "Kuas Santai & Hangat" },
  { id: "lobster", name: "Lobster", category: "Tulisan Tangan / Script", className: lobster.className, fontFamily: lobster.style.fontFamily, description: "Retro Diner Klasik" },
  { id: "dancing", name: "Dancing Script", category: "Tulisan Tangan / Script", className: dancing.className, fontFamily: dancing.style.fontFamily, description: "Luwes Mengalir" },
  { id: "satisfy", name: "Satisfy", category: "Tulisan Tangan / Script", className: satisfy.className, fontFamily: satisfy.style.fontFamily, description: "Kaligrafi Lembut" },
  { id: "great_vibes", name: "Great Vibes", category: "Tulisan Tangan / Script", className: greatVibes.className, fontFamily: greatVibes.style.fontFamily, description: "Kaligrafi Anggun" },
]

export const getHeroFontClass = (id?: string | null): string => {
  if (!id) return outfit.className
  const found = HERO_FONTS.find(f => f.id === id)
  return found ? found.className : outfit.className
}

export const getHeroFontFamily = (id?: string | null): string => {
  if (!id) return outfit.style.fontFamily
  const found = HERO_FONTS.find(f => f.id === id)
  return found ? found.fontFamily : outfit.style.fontFamily
}

export const getAllHeroFontClasses = (): string[] => {
  return HERO_FONTS.map(f => f.className)
}

/**
 * Memastikan font Google Fonts tertentu telah selesai dimuat dan siap dirender oleh browser
 * sebelum elemen ditampilkan, guna mencegah FOUT (Flash of Unstyled Text / flashback font).
 */
export async function preloadHeroFont(id?: string | null): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined" || !document?.fonts) return
  const family = getHeroFontFamily(id)
  try {
    await Promise.allSettled([
      document.fonts.load(`1rem ${family}`),
      document.fonts.load(`bold 1rem ${family}`),
      document.fonts.load(`400 1rem ${family}`),
      document.fonts.load(`700 1rem ${family}`),
      document.fonts.load(`bold 42px ${family}`),
      document.fonts.ready,
    ])
  } catch {
    // Abaikan error jaringan jika offline
  }
}


export interface HeroFontSizeOption {
  id: string
  name: string
  desc: string
  className: string
}

export const HERO_FONT_SIZES: HeroFontSizeOption[] = [
  { id: "sm", name: "Kecil (Small)", desc: "17px - 40px", className: "text-[17px] sm:text-[20px] md:text-[26px] lg:text-[32px] xl:text-[40px]" },
  { id: "md", name: "Sedang (Normal - Bawaan)", desc: "19px - 48px", className: "text-[19px] sm:text-[22px] md:text-[30px] lg:text-[38px] xl:text-[48px]" },
  { id: "lg", name: "Besar (Large)", desc: "21px - 56px", className: "text-[21px] sm:text-[25px] md:text-[34px] lg:text-[46px] xl:text-[56px]" },
  { id: "xl", name: "Ekstra Besar (XL)", desc: "24px - 66px", className: "text-[24px] sm:text-[28px] md:text-[40px] lg:text-[54px] xl:text-[66px]" },
]

export const parseHeroFontSizeNumber = (id?: string | number | null): number => {
  if (!id) return 34
  if (typeof id === 'number') return Math.min(72, Math.max(16, id))
  if (id === 'sm') return 24
  if (id === 'md') return 34
  if (id === 'lg') return 44
  if (id === 'xl') return 56
  const num = parseInt(id, 10)
  return isNaN(num) ? 34 : Math.min(72, Math.max(16, num))
}

export const getHeroFontSizeStyle = (id?: string | number | null): React.CSSProperties => {
  const num = parseHeroFontSizeNumber(id)
  const minPx = Math.max(16, Math.round(num * 0.48))
  return {
    fontSize: `clamp(${minPx}px, 4.2vw, ${num}px)`,
  }
}

export const getHeroFontSizeClass = (id?: string | number | null): string => {
  if (!id) return ""
  if (typeof id === 'string') {
    const found = HERO_FONT_SIZES.find(s => s.id === id)
    if (found) return found.className
  }
  return ""
}

export interface HeroFontWeightOption {
  id: string
  name: string
  weight: number
  className: string
  description: string
}

export const HERO_FONT_WEIGHTS: HeroFontWeightOption[] = [
  { id: "light", name: "Light", weight: 300, className: "font-light", description: "300 - Tipis Elegan" },
  { id: "normal", name: "Normal", weight: 400, className: "font-normal", description: "400 - Regular (Bawaan)" },
  { id: "medium", name: "Medium", weight: 500, className: "font-medium", description: "500 - Sedang / Bersih" },
  { id: "semibold", name: "Semi Bold", weight: 600, className: "font-semibold", description: "600 - Semi Tebal (Populer)" },
  { id: "bold", name: "Bold", weight: 700, className: "font-bold", description: "700 - Tebal Menonjol" },
  { id: "extrabold", name: "Extra Bold", weight: 800, className: "font-extrabold", description: "800 - Ekstra Tebal" },
  { id: "black", name: "Black", weight: 900, className: "font-black", description: "900 - Paling Tebal / Tegas" },
]

export const parseHeroFontWeightNumber = (val?: string | number | null): number => {
  if (!val) return 400
  if (typeof val === 'number') return Math.min(900, Math.max(300, val))
  if (val === 'light') return 300
  if (val === 'normal' || val === 'regular') return 400
  if (val === 'medium') return 500
  if (val === 'semibold' || val === 'semi-bold') return 600
  if (val === 'bold') return 700
  if (val === 'extrabold' || val === 'extra-bold') return 800
  if (val === 'black') return 900
  const num = parseInt(val, 10)
  return isNaN(num) ? 400 : Math.min(900, Math.max(300, num))
}

export const getHeroFontWeightClass = (val?: string | number | null): string => {
  const num = parseHeroFontWeightNumber(val)
  if (num <= 350) return "font-light"
  if (num <= 450) return "font-normal"
  if (num <= 550) return "font-medium"
  if (num <= 650) return "font-semibold"
  if (num <= 750) return "font-bold"
  if (num <= 850) return "font-extrabold"
  return "font-black"
}

export interface HeroImageAspectOption {
  id: string
  name: string
  ratioLabel: string
  className: string
}

export const HERO_IMAGE_ASPECTS: HeroImageAspectOption[] = [
  { id: "2:1", name: "Banner Lebar", ratioLabel: "2:1", className: "aspect-[2/1] w-full" },
  { id: "16:9", name: "Layar Lebar", ratioLabel: "16:9", className: "aspect-[16/9] w-full" },
  { id: "square", name: "Persegi (Square)", ratioLabel: "1:1", className: "aspect-square w-full" },
  { id: "4:5", name: "Potret (Portrait)", ratioLabel: "4:5", className: "aspect-[4/5] w-full" },
]

export const getHeroImageAspectClass = (id?: string | null): string => {
  if (!id) return "aspect-[2/1] w-full"
  const found = HERO_IMAGE_ASPECTS.find(a => a.id === id)
  return found ? found.className : "aspect-[2/1] w-full"
}

export const parseHeroImageSizeNumber = (val?: string | number | null): number => {
  if (!val) return 450
  if (typeof val === 'number') return Math.min(700, Math.max(180, val))
  const num = parseInt(val, 10)
  return isNaN(num) ? 450 : Math.min(700, Math.max(180, num))
}

export const getHeroImageContainerStyle = (size?: string | number | null): React.CSSProperties => {
  const num = parseHeroImageSizeNumber(size)
  return {
    width: `min(100%, ${num}px)`,
    maxWidth: '100%',
  }
}

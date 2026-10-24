export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "callout"
  | "quote"
  | "code"
  | "divider"

export type CalloutType = "tip" | "info" | "warning" | "success" | "bpom"

export interface ImageItem {
  url: string
  caption?: string
  alt?: string
}

export interface ArticleBlock {
  id: string
  type: BlockType
  value: string
  // Untuk heading
  headingLevel?: 1 | 2 | 3 | 4
  // Untuk image
  imageAlign?: "left" | "center" | "right"
  imageRatio?: "16:9" | "4:5" | "1:1"
  imageWidth?: number
  gridCols?: 1 | 2 | 3 | 4 | number
  images?: ImageItem[]
  // Untuk callout
  calloutType?: CalloutType
  calloutTitle?: string
  // Untuk quote
  quoteAuthor?: string
  quoteRole?: string
  // Untuk code / parameter
  codeLang?: string
}

export interface InsightArticle {
  id?: number
  title: string
  slug: string
  description?: string
  excerpt?: string
  category: string
  author: string
  reading_time: string
  pembahasan?: string
  src?: string // Cover image URL
  cover_image?: string // Alias for src
  content: string // Full markdown content
  blocks?: ArticleBlock[]
  tags?: string[]
  is_active?: boolean
  views?: number
  created_at?: string
  updated_at?: string
}

export const INSIGHT_CATEGORIES = [
  "Panduan Bisnis",
  "Regulasi & Legalitas",
  "R&D & Formulasi",
  "Tren Pasar",
  "Studi Bahan Alam",
] as const

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number]

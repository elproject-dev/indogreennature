"use client"

import React, { useState } from "react"
import {
  ShoppingBag,
  ExternalLink,
  Flame,
  Clock,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react"
import { FaWhatsapp, FaTiktok, FaBagShopping, FaStore } from "react-icons/fa6"
import { SiShopee } from "react-icons/si"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

export interface ClickRecord {
  id: string
  button_type: string
  item_name: string | null
  page_path: string | null
  created_at: string
}

export interface ProductClickSummary {
  name: string
  total: number
  wa: number
  marketplace: number
}

interface ConversionHubProps {
  recentClicks: ClickRecord[]
  totalCount: number
}

const CHANNEL_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; text: string; border: string }
> = {
  whatsapp_order: {
    label: "WhatsApp Order",
    color: "#25D366",
    bg: "bg-[#25D366]/10",
    text: "text-[#25D366]",
    border: "border-[#25D366]/30",
  },
  whatsapp_contact: {
    label: "WhatsApp CS",
    color: "#16A34A",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/40",
  },
  shopee: {
    label: "Shopee",
    color: "#EE4D2D",
    bg: "bg-[#EE4D2D]/10",
    text: "text-[#EE4D2D]",
    border: "border-[#EE4D2D]/30",
  },
  tokopedia: {
    label: "Tokopedia",
    color: "#03AC0E",
    bg: "bg-[#03AC0E]/10",
    text: "text-[#03AC0E]",
    border: "border-[#03AC0E]/30",
  },
  tiktok: {
    label: "TikTok Shop",
    color: "#000000",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-900 dark:text-zinc-100",
    border: "border-zinc-300 dark:border-zinc-700",
  },
  lazada: {
    label: "Lazada",
    color: "#0F146D",
    bg: "bg-[#0F146D]/10",
    text: "text-[#0F146D] dark:text-blue-400",
    border: "border-[#0F146D]/30 dark:border-blue-800/40",
  },
  contact_form_submit: {
    label: "Form Kontak",
    color: "#8B5CF6",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800/40",
  },
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 60) return "Baru saja"
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch {
    return dateString
  }
}

function renderChannelIcon(type: string, className = "w-3 h-3") {
  switch (type) {
    case "whatsapp_order":
    case "whatsapp_contact":
      return <FaWhatsapp className={className} />
    case "shopee":
      return <SiShopee className={className} />
    case "tokopedia":
      return <FaBagShopping className={className} />
    case "tiktok":
      return <FaTiktok className={className} />
    case "lazada":
      return <FaStore className={className} />
    default:
      return <ShoppingBag className={className} />
  }
}

export function ConversionHub({ recentClicks, totalCount }: ConversionHubProps) {
  const [activeTab, setActiveTab] = useState<"products" | "channels" | "feed">("products")

  // 1. Hitung total per channel
  const channelCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    recentClicks.forEach((c) => {
      counts[c.button_type] = (counts[c.button_type] || 0) + 1
    })
    return counts
  }, [recentClicks])

  // 2. Hitung total per produk
  const productSummaries: ProductClickSummary[] = React.useMemo(() => {
    const map: Record<string, ProductClickSummary> = {}
    recentClicks.forEach((c) => {
      if (!c.item_name) return
      if (!map[c.item_name]) {
        map[c.item_name] = { name: c.item_name, total: 0, wa: 0, marketplace: 0 }
      }
      map[c.item_name].total += 1
      if (c.button_type === "whatsapp_order" || c.button_type === "whatsapp_contact") {
        map[c.item_name].wa += 1
      } else {
        map[c.item_name].marketplace += 1
      }
    })
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [recentClicks])

  const waTotal = (channelCounts["whatsapp_order"] || 0) + (channelCounts["whatsapp_contact"] || 0)
  const marketplaceTotal =
    (channelCounts["shopee"] || 0) +
    (channelCounts["tokopedia"] || 0) +
    (channelCounts["tiktok"] || 0) +
    (channelCounts["lazada"] || 0)

  const maxProductClicks = productSummaries[0]?.total || 1

  return (
    <Card className="flex flex-col h-full shadow-sm border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
              Aksi Pengunjung
            </CardTitle>
            <CardDescription className="text-xs hidden sm:block">
              Statistik klik tombol WhatsApp, Marketplace & Formulir Kontak secara real-time
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              {totalCount.toLocaleString("id-ID")} total interaksi
            </span>
          </div>
        </div>

        {/* Ringkasan Saluran Mini (6 Saluran Lengkap) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
          {/* 1. WhatsApp */}
          <div className="p-2.5 rounded-lg border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block font-medium">WhatsApp</span>
              <span className="text-base font-bold text-[#25D366]">{waTotal}</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
              <FaWhatsapp className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Shopee */}
          <div className="p-2.5 rounded-lg border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block font-medium">Shopee</span>
              <span className="text-base font-bold text-[#EE4D2D]">
                {channelCounts["shopee"] || 0}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#EE4D2D]/10 text-[#EE4D2D] flex items-center justify-center shrink-0">
              <SiShopee className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Tokopedia */}
          <div className="p-2.5 rounded-lg border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block font-medium">Tokopedia</span>
              <span className="text-base font-bold text-[#03AC0E]">
                {channelCounts["tokopedia"] || 0}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#03AC0E]/10 text-[#03AC0E] flex items-center justify-center shrink-0">
              <FaBagShopping className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. TikTok Shop */}
          <div className="p-2.5 rounded-lg border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block font-medium">TikTok Shop</span>
              <span className="text-base font-bold text-foreground">
                {channelCounts["tiktok"] || 0}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
              <FaTiktok className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 5. Lazada (Terpisah Sendiri) */}
          <div className="p-2.5 rounded-lg border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block font-medium">Lazada</span>
              <span className="text-base font-bold text-[#0F146D] dark:text-blue-400">
                {channelCounts["lazada"] || 0}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#0F146D]/10 dark:bg-blue-950/50 text-[#0F146D] dark:text-blue-400 flex items-center justify-center shrink-0">
              <FaStore className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 6. Total Marketplace */}
          <div className="p-2.5 rounded-lg border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block font-medium">Total Click Marketplace</span>
              <span className="text-base font-bold text-foreground">{marketplaceTotal}</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 border-b pt-3 overflow-x-auto whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-3 py-1.5 text-xs font-semibold transition-all border-b-2 cursor-pointer shrink-0 flex items-center gap-1 ${activeTab === "products"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <span>🏆</span>
            <span className="sm:hidden">Produk</span>
            <span className="hidden sm:inline">Produk Paling Diminati</span>
            <span className="text-[11px] opacity-80">({productSummaries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("channels")}
            className={`px-3 py-1.5 text-xs font-semibold transition-all border-b-2 cursor-pointer shrink-0 flex items-center gap-1 ${activeTab === "channels"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <span>📊</span>
            <span className="sm:hidden">Saluran</span>
            <span className="hidden sm:inline">Saluran / Channel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("feed")}
            className={`px-3 py-1.5 text-xs font-semibold transition-all border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${activeTab === "feed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="sm:hidden">Riwayat</span>
            <span className="hidden sm:inline">Riwayat Klik Terkini</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 py-2">
        {/* TAB 1: Produk Terpopuler */}
        {activeTab === "products" && (
          <div className="space-y-3">
            {productSummaries.length > 0 ? (
              productSummaries.map((prod, index) => {
                const pct = Math.round((prod.total / maxProductClicks) * 100)
                return (
                  <div key={prod.name} className="p-3 rounded-lg border bg-card/40 space-y-2">
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${index === 0
                            ? "bg-amber-400 text-amber-950 shadow-xs"
                            : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-semibold text-foreground text-sm line-clamp-1">
                          {prod.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-sm text-foreground">
                          {prod.total} <span className="text-[10px] text-muted-foreground font-normal">klik</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Breakdown */}
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
                      {prod.wa > 0 && (
                        <div
                          className="h-full bg-[#25D366]"
                          style={{ width: `${(prod.wa / prod.total) * pct}%` }}
                          title={`WhatsApp: ${prod.wa} klik`}
                        />
                      )}
                      {prod.marketplace > 0 && (
                        <div
                          className="h-full bg-[#EE4D2D]"
                          style={{ width: `${(prod.marketplace / prod.total) * pct}%` }}
                          title={`Marketplace: ${prod.marketplace} klik`}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 text-[#25D366] font-medium">
                        <FaWhatsapp className="w-3 h-3" />
                        {prod.wa} via WhatsApp
                      </span>
                      <span className="flex items-center gap-1 text-[#EE4D2D] font-medium">
                        <ShoppingBag className="w-3 h-3" />
                        {prod.marketplace} via Marketplace
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col h-[200px] items-center justify-center text-center p-4 border-2 border-dashed rounded-lg">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs font-medium text-muted-foreground">Belum ada klik produk</p>
                <p className="text-[10px] text-muted-foreground/75 mt-0.5">
                  Klik tombol order WhatsApp atau marketplace di produk akan tercatat di sini.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Distribusi Saluran */}
        {activeTab === "channels" && (
          <div className="space-y-3">
            {Object.keys(channelCounts).length > 0 ? (
              Object.entries(channelCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const cfg = CHANNEL_CONFIG[type] || {
                    label: type,
                    color: "#6B7280",
                    bg: "bg-gray-100 dark:bg-gray-800",
                    text: "text-gray-700 dark:text-gray-300",
                    border: "border-gray-200 dark:border-gray-700",
                  }
                  const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0

                  return (
                    <div key={type} className="p-3 rounded-lg border bg-card/40 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{count} klik</span>
                          <span className="text-[11px] text-muted-foreground w-10 text-right font-medium">
                            {pct}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                        />
                      </div>
                    </div>
                  )
                })
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                Belum ada data saluran
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Feed Riwayat Klik Terkini */}
        {activeTab === "feed" && (
          <div className="space-y-2">
            {recentClicks.length > 0 ? (
              recentClicks.slice(0, 15).map((click) => {
                const cfg = CHANNEL_CONFIG[click.button_type] || {
                  label: click.button_type,
                  color: "#6B7280",
                  bg: "bg-gray-100 dark:bg-gray-800",
                  text: "text-gray-700 dark:text-gray-300",
                  border: "border-gray-200 dark:border-gray-700",
                }

                return (
                  <div
                    key={click.id}
                    className="p-2.5 rounded-lg border bg-card/30 flex items-center justify-between gap-3 text-xs hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="font-medium text-foreground truncate">
                        {click.item_name || click.page_path || "Interaksi Pengunjung"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-[11px]">
                      <span className="hidden sm:inline text-xs text-muted-foreground/60">
                        {click.page_path}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {formatRelativeTime(click.created_at)}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                Belum ada riwayat aktivitas klik
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-center sm:justify-end text-[11px] text-muted-foreground border-t pt-3 mt-auto">
        <span className="text-[10px]">Menampilkan {recentClicks.length} aktivitas terbaru</span>
      </CardFooter>
    </Card>
  )
}

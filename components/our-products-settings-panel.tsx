"use client"

import React, { useState, useEffect } from "react"
import {
  ShoppingBag,
  MessageCircle,
  Save,
  RotateCcw,
  Check,
  Loader2,
  Phone,
  ExternalLink,
  Sparkles,
  Info,
  Package,
  ArrowRight,
  Store,
} from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  OurProductsSettingsData,
  DEFAULT_OUR_PRODUCTS_SETTINGS,
  OUR_PRODUCTS_PREVIEW_CHANNEL,
} from "@/lib/our-products-settings/types"
import {
  getInitialOurProductsSettings,
  fetchOurProductsSettings,
  saveOurProductsSettings,
} from "@/lib/our-products-settings/db"

export function OurProductsSettingsPanel() {
  const [settings, setSettings] = useState<OurProductsSettingsData>(getInitialOurProductsSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const data = await fetchOurProductsSettings()
        if (isMounted) {
          setSettings(data)
        }
      } catch (err) {
        console.warn("Gagal memuat pengaturan Our Products:", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    init()
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = <K extends keyof OurProductsSettingsData>(
    field: K,
    val: OurProductsSettingsData[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: val }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await saveOurProductsSettings(settings)
      if (res.success) {
        try {
          if (typeof BroadcastChannel !== "undefined") {
            const bc = new BroadcastChannel(OUR_PRODUCTS_PREVIEW_CHANNEL)
            bc.postMessage({ type: "PREVIEW_UPDATE", data: settings })
            bc.close()
          }
        } catch {}
        toast.add({
          title: "Pengaturan WhatsApp Berhasil Disimpan",
          description: "Nomor dan template order WhatsApp untuk semua produk telah diperbarui.",
          type: "success",
        })
      } else {
        toast.add({
          title: "Gagal Menyimpan",
          description: res.error || "Terjadi kesalahan saat menyimpan pengaturan.",
          type: "error",
        })
      }
    } catch (err: any) {
      toast.add({
        title: "Terjadi Kesalahan",
        description: err.message || "Gagal menghubungkan ke database.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm("Kembalikan pengaturan WhatsApp order produk ke default pabrik?")) {
      setSettings((prev) => ({
        ...prev,
        orderWhatsappNumber: DEFAULT_OUR_PRODUCTS_SETTINGS.orderWhatsappNumber,
        orderWhatsappMessageTemplate: DEFAULT_OUR_PRODUCTS_SETTINGS.orderWhatsappMessageTemplate,
        orderWhatsappButtonText: DEFAULT_OUR_PRODUCTS_SETTINGS.orderWhatsappButtonText,
      }))
      toast.add({
        title: "Pengaturan Direset",
        description: "Klik tombol Simpan Perubahan untuk menerapkan ke database.",
        type: "info",
      })
    }
  }

  const rawNum = settings.orderWhatsappNumber || "6285877669199"
  const cleanNum = rawNum.replace(/[^0-9]/g, "")
  const normalizedNum = cleanNum.startsWith("0") ? "62" + cleanNum.slice(1) : cleanNum
  const sampleProductName = "Minuman Serbuk Jahe Merah & Temulawak Premium 200g"
  const sampleProductPrice = "Rp 45.000"
  const template =
    settings.orderWhatsappMessageTemplate ||
    DEFAULT_OUR_PRODUCTS_SETTINGS.orderWhatsappMessageTemplate ||
    ""
  const sampleMessage = template
    .replace(/\{product_name\}/g, sampleProductName)
    .replace(/\{product_price\}/g, sampleProductPrice)

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-950/30 rounded-lg text-emerald-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Pengaturan Our Products & WhatsApp Order
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Atur nomor kontak WhatsApp global untuk pemesanan semua produk, template pesan otomatis, dan kelola katalog produk resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSaving || isLoading}
            className="gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Default</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Form Pengaturan WhatsApp Global */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Nomor WhatsApp Pemesanan Global */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <CardTitle className="text-base font-bold">
                    Nomor WhatsApp Order Global (Semua Produk)
                  </CardTitle>
                </div>
                <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Global Berlaku Semua Item
                </span>
              </div>
              <CardDescription className="text-xs">
                Satu nomor WhatsApp terpadu yang digunakan oleh tombol <strong>Order Cepat via WhatsApp</strong> pada semua item produk di halaman Our Products.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* Input Nomor WA */}
              <div className="space-y-2">
                <Label htmlFor="orderWhatsappNumber" className="text-xs font-semibold flex items-center justify-between">
                  <span>Nomor WhatsApp Aktif Admin Order</span>
                  <span className="text-[11px] font-normal text-muted-foreground font-mono">
                    Format: 628xxx atau 08xxx
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="orderWhatsappNumber"
                      type="text"
                      value={settings.orderWhatsappNumber || ""}
                      onChange={(e) => handleChange("orderWhatsappNumber", e.target.value)}
                      placeholder="6285877669199"
                      className="pl-9 font-mono font-bold text-sm bg-background"
                    />
                  </div>
                  <a
                    href={`https://wa.me/${normalizedNum}?text=${encodeURIComponent(sampleMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 h-10"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Tes Link WA</span>
                  </a>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Nomor terformat yang akan dibuka: <strong className="font-mono text-emerald-600">+{normalizedNum}</strong>
                </p>
              </div>

              {/* Input Teks Tombol */}
              <div className="space-y-2">
                <Label htmlFor="orderWhatsappButtonText" className="text-xs font-semibold">
                  Teks Tombol Order WhatsApp
                </Label>
                <Input
                  id="orderWhatsappButtonText"
                  type="text"
                  value={settings.orderWhatsappButtonText || ""}
                  onChange={(e) => handleChange("orderWhatsappButtonText", e.target.value)}
                  placeholder="Order Cepat via WhatsApp Official"
                  className="bg-background text-sm font-medium"
                />
                <p className="text-[11px] text-muted-foreground">
                  Teks yang tampil pada tombol WhatsApp di pop-up rincian produk (contoh: <em>Order Cepat via WhatsApp Official</em>).
                </p>
              </div>

              {/* Template Pesan WA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="orderWhatsappMessageTemplate" className="text-xs font-semibold">
                    Template Pesan WhatsApp Otomatis
                  </Label>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        "orderWhatsappMessageTemplate",
                        DEFAULT_OUR_PRODUCTS_SETTINGS.orderWhatsappMessageTemplate
                      )
                    }
                    className="text-[11px] text-emerald-600 hover:underline cursor-pointer"
                  >
                    Reset Template Standar
                  </button>
                </div>
                <Textarea
                  id="orderWhatsappMessageTemplate"
                  rows={3}
                  value={settings.orderWhatsappMessageTemplate || ""}
                  onChange={(e) => handleChange("orderWhatsappMessageTemplate", e.target.value)}
                  placeholder="Halo CV. Indo Green Nature, saya ingin memesan produk: {product_name} ({product_price}). Mohon info ketersediaan stok & pengiriman."
                  className="bg-background text-xs leading-relaxed font-sans"
                />
                <div className="p-3 bg-muted/60 rounded-md border border-border/80 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Variabel Otomatis yang Tersedia:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <div className="flex items-center gap-1 bg-background px-2 py-0.5 rounded border border-border">
                      <code className="font-mono text-emerald-600 font-bold">{"{product_name}"}</code>
                      <span className="text-muted-foreground">= Nama Produk Otomatis</span>
                    </div>
                    <div className="flex items-center gap-1 bg-background px-2 py-0.5 rounded border border-border">
                      <code className="font-mono text-emerald-600 font-bold">{"{product_price}"}</code>
                      <span className="text-muted-foreground">= Harga Produk Otomatis (Rp)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Akses Cepat ke Editor Our Products */}
          <Card className="border-border shadow-xs bg-gradient-to-r from-emerald-500/5 via-transparent to-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <CardTitle className="text-base font-bold">
                    Kelola Item & Banner Halaman Our Products
                  </CardTitle>
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {settings.shopeeProducts?.length || 0} Produk Terdaftar
                </span>
              </div>
              <CardDescription className="text-xs">
                Ingin mengubah foto produk, harga Shopee/Tokopedia, badge diskon, atau gambar banner slide gerak?
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-background rounded-lg border border-border">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Editor Lengkap Halaman Our Products
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Buka halaman Our Products dengan panel admin interaktif langsung aktif di sisi kanan.
                  </p>
                </div>
                <Link
                  href="/our-products?edit=true"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <span>Buka Editor Our Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Pratinjau Tampilan Modal Produk */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Simulasi Tombol di Popup Produk</span>
          </div>

          <Card className="border-border shadow-sm overflow-hidden bg-background">
            <div className="p-4 bg-muted/30 border-b border-border space-y-2">
              <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                Minuman Serbuk
              </span>
              <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
                {sampleProductName}
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-extrabold text-[#15803D]">
                  {sampleProductPrice}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  Rp 55.000
                </span>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="text-[11px] text-muted-foreground">
                Saat pelanggan membuka modal produk ini, tombol WhatsApp yang muncul:
              </div>

              {/* Tampilan Tombol WhatsApp */}
              <div className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-[5px] bg-[#2563EB] text-white text-xs sm:text-sm font-bold shadow-xs select-none">
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{settings.orderWhatsappButtonText || "Order Cepat via WhatsApp Official"}</span>
              </div>

              {/* Teks Pesan Terbentuk */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Isi Pesan WA yang Terkirim ke Admin:
                </span>
                <div className="p-3 bg-muted/50 rounded text-[11px] text-foreground font-mono whitespace-pre-wrap border border-border leading-relaxed">
                  {sampleMessage}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  LayoutGrid,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Settings,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  BLOCK_META,
  DEFAULT_HOME_BLOCKS,
  HOME_LAYOUT_EVENT,
  HOME_LAYOUT_KEY,
  HOME_LAYOUT_PREVIEW_KEY,
  fetchHomeLayoutRemote,
  loadHomeLayout,
  saveHomeLayoutLocal,
  saveHomeLayoutRemote,
  type DividerColor,
  type DividerSpacing,
  type DividerStyle,
  type HomeBlock,
  type HomeBlockType,
} from "@/lib/home-blocks"

const BLOCK_TAB_MAP: Record<string, string> = {
  hero_banner: "hero_banner",
  mengenal_ign: "pengenalan",
  solusi_bisnis: "solusi_bisnis",
  jenis_produk: "jenis_produk",
  peluang: "peluang",
  mengapa_memilih: "mengapa_memilih",
  legalitas: "legalitas",
  dipercaya_brand: "dipercaya_brand",
  proses_maklon: "proses_maklon",
  konsultasi_banner: "konsultasi_banner",
  melayani_klien: "melayani_klien",
  ulasan_klien: "ulasan_klien",
  faq_section: "faq_section",
  video_profil: "video_profil",
  sosial_media: "sosial_media",
  running_text: "running_text",
}

export function HomeLayoutEditor({ onSaveAction }: { onSaveAction?: () => void }) {
  const [blocks, setBlocks] = React.useState<HomeBlock[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [savedSuccess, setSavedSuccess] = React.useState(false)
  const [expandedDividerId, setExpandedDividerId] = React.useState<string | null>(null)

  // 1. Load layout (from local cache first, then sync with Supabase)
  React.useEffect(() => {
    const local = loadHomeLayout()
    setBlocks(local)
    setIsLoaded(true)

    const syncRemote = async () => {
      const remote = await fetchHomeLayoutRemote()
      if (remote && Array.isArray(remote) && remote.length > 0) {
        setBlocks(remote)
        saveHomeLayoutLocal(remote)
      }
    }
    syncRemote()
  }, [])

  // 2. Save preview to preview key for real-time sandbox
  React.useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(HOME_LAYOUT_PREVIEW_KEY, JSON.stringify(blocks))
    } catch (e) {}
  }, [blocks, isLoaded])

  // Move block up or down
  const moveBlock = (index: number, direction: -1 | 1) => {
    setBlocks((prev) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= prev.length) return prev
      const updated = [...prev]
      const temp = updated[index]
      updated[index] = updated[targetIndex]
      updated[targetIndex] = temp
      return updated
    })
  }

  // Toggle hide / show
  const toggleVisibility = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b))
    )
  }

  // Remove block
  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    if (expandedDividerId === id) setExpandedDividerId(null)
  }

  // Update block options (for divider)
  const updateBlockOptions = (id: string, updates: Partial<HomeBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )
  }

  // Add block
  const addBlock = (type: HomeBlockType) => {
    const meta = BLOCK_META[type]
    const newBlock: HomeBlock = {
      id: `b-${type}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      label: meta.label,
      desc: meta.desc,
      hidden: false,
      ...(type === "divider"
        ? {
            divider_style: "solid" as DividerStyle,
            divider_color: "default" as DividerColor,
            divider_thickness: 2,
            divider_spacing: "md" as DividerSpacing,
          }
        : {}),
    }
    setBlocks((prev) => [...prev, newBlock])
    if (type === "divider") {
      setExpandedDividerId(newBlock.id)
      toast.add({
        title: "Garis Pembatas Ditambahkan",
        description: "Garis pembatas baru ditambahkan di posisi terbawah. Atur posisinya dengan panah.",
        type: "success",
      })
    }
  }

  // Save layout permanently to Supabase and localStorage
  const handleSave = async () => {
    setIsSaving(true)
    try {
      saveHomeLayoutLocal(blocks, HOME_LAYOUT_KEY)
      const remoteOk = await saveHomeLayoutRemote(blocks)

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)

      toast.add({
        title: "Susunan Berhasil Disimpan",
        description: remoteOk
          ? "Urutan, garis pembatas, dan visibilitas blok halaman Home telah diperbarui."
          : "Tersimpan secara lokal di perangkat Anda.",
        type: "success",
      })

      if (onSaveAction) onSaveAction()
    } catch (err: any) {
      toast.add({
        title: "Gagal Menyimpan",
        description: err.message || "Terjadi kesalahan saat menyimpan susunan.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to default layout
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset susunan halaman Home ke urutan bawaan pabrik?")) {
      setBlocks(DEFAULT_HOME_BLOCKS)
      setExpandedDividerId(null)
      saveHomeLayoutLocal(DEFAULT_HOME_BLOCKS, HOME_LAYOUT_KEY)
      saveHomeLayoutRemote(DEFAULT_HOME_BLOCKS)
      toast.add({
        title: "Susunan Direset",
        description: "Halaman Home telah dikembalikan ke susunan default.",
        type: "success",
      })
    }
  }

  // Open Home in preview mode
  const openPreview = () => {
    saveHomeLayoutLocal(blocks, HOME_LAYOUT_PREVIEW_KEY)
    window.open("/?preview=true", "_blank")
  }

  // List of blocks that can still be added (divider can always be added)
  const currentTypes = new Set(blocks.map((b) => b.type))
  const availableToAdd = (Object.keys(BLOCK_META) as HomeBlockType[]).filter(
    (type) => type === "divider" || !currentTypes.has(type)
  )

  if (!isLoaded) {
    return (
      <div className="p-8 flex items-center justify-center text-primary">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm font-semibold">Memuat susunan layout...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 bg-card-alt text-primary p-4 md:p-6 rounded-none shadow-sm border border-primary/20 animate-in fade-in">
      {/* Header Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/10 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-primary">
              Susunan Halaman Home
            </h2>
          </div>
          <p className="text-xs text-primary/70">
            Atur urutan bagian halaman utama, tambahkan garis pembatas antar modul, sembunyikan atau tampilkan blok sesuai kebutuhan promosi herbal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Quick Button Tambah Garis Pembatas */}
          <Button
            type="button"
            onClick={() => addBlock("divider")}
            size="sm"
            className="gap-1.5 h-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer shadow-xs"
            title="Tambah Garis Pembatas visual antar blok"
          >
            <Plus className="h-3.5 w-3.5" />
            Garis Pembatas
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openPreview}
            className="gap-1.5 h-8 rounded-none border-primary/30 text-primary hover:bg-primary-soft font-semibold cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Pratinjau Home
          </Button>

          <Link href="/settings">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 rounded-none border-primary/30 text-primary hover:bg-primary-soft font-semibold cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
              Ke Pengaturan
            </Button>
          </Link>
        </div>
      </div>

      {/* List Blok Susunan Home */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-primary/80 px-1">
          <span>Daftar Urutan Blok ({blocks.length} Bagian)</span>
          <span className="text-[11px] text-primary/60 font-mono">Gunakan tombol Panah untuk menggeser urutan</span>
        </div>

        {blocks.length === 0 ? (
          <div className="border border-dashed border-primary/30 rounded-none p-8 text-center text-sm text-primary/60 bg-primary-soft/10">
            Belum ada blok yang ditambahkan. Silakan pilih dari daftar blok di bawah.
          </div>
        ) : (
          blocks.map((block, index) => {
            const isHidden = Boolean(block.hidden)
            const isFirst = index === 0
            const isLast = index === blocks.length - 1
            const isDivider = block.type === "divider"
            const isExpanded = expandedDividerId === block.id

            const dividerStyle = block.divider_style || "solid"
            const dividerColor = block.divider_color || "default"
            const dividerThickness = block.divider_thickness ?? 2
            const dividerSpacing = block.divider_spacing || "md"

            return (
              <div
                key={block.id}
                className={cn(
                  "flex flex-col rounded-none border transition-all",
                  isDivider ? "border-primary/35 bg-primary-soft/10" : "bg-background border-primary/20",
                  isHidden
                    ? "bg-muted/40 border-primary/10 opacity-60"
                    : "shadow-xs hover:border-primary/40"
                )}
              >
                {/* Baris Utama Blok */}
                <div className="flex items-center justify-between gap-3 p-3">
                  {/* Info Blok */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className={cn(
                      "w-6 h-6 rounded-none font-bold text-xs flex items-center justify-center shrink-0 border font-mono",
                      isDivider
                        ? "bg-primary text-white border-primary"
                        : "bg-primary-soft text-primary border-primary/20"
                    )}>
                      {index + 1}
                    </span>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isDivider && (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-primary text-white rounded-none">
                            <Minus className="w-3 h-3" />
                            Garis Pembatas
                          </span>
                        )}

                        <span className="font-bold text-xs md:text-sm text-primary truncate">
                          {isDivider ? `Pemisah #${index + 1}` : block.label}
                        </span>

                        {isDivider && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-background border border-primary/20 text-primary/80">
                            {dividerStyle} • {dividerThickness}px • {dividerColor} • {dividerSpacing}
                          </span>
                        )}

                        {isHidden && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-none bg-destructive/10 text-destructive font-semibold">
                            Disembunyikan
                          </span>
                        )}
                      </div>

                      {/* Mini Live Preview Line untuk Divider */}
                      {isDivider ? (
                        <div className="mt-1.5 w-full max-w-sm flex items-center h-4 px-2 bg-background border border-primary/15 overflow-hidden">
                          {dividerStyle === "gradient" ? (
                            <div
                              className="w-full"
                              style={{
                                height: `${dividerThickness}px`,
                                background: dividerColor === "primary"
                                  ? "linear-gradient(90deg, transparent, #23bc00, transparent)"
                                  : "linear-gradient(90deg, transparent, currentColor, transparent)",
                                opacity: 0.8,
                              }}
                            />
                          ) : dividerStyle === "double" ? (
                            <div className="w-full flex flex-col gap-0.5">
                              <div
                                className={cn("w-full border-t", dividerColor === "primary" ? "border-primary" : "border-foreground/40")}
                                style={{ borderWidth: `${Math.max(1, Math.floor(dividerThickness / 2))}px` }}
                              />
                              <div
                                className={cn("w-full border-t", dividerColor === "primary" ? "border-primary" : "border-foreground/40")}
                                style={{ borderWidth: `${Math.max(1, Math.floor(dividerThickness / 2))}px` }}
                              />
                            </div>
                          ) : (
                            <hr
                              className={cn(
                                "w-full",
                                dividerStyle === "dashed" ? "border-dashed" : dividerStyle === "dotted" ? "border-dotted" : "border-solid",
                                dividerColor === "primary" ? "border-primary" : dividerColor === "muted" ? "border-foreground/20" : "border-foreground/50"
                              )}
                              style={{
                                borderTopWidth: `${dividerThickness}px`,
                                borderBottomWidth: "0px",
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-primary/60 truncate hidden sm:block">
                          {block.desc}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi Urutan & Tampilan */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Tombol Atur Opsi Khusus Divider */}
                    {isDivider && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedDividerId(isExpanded ? null : block.id)}
                        className={cn(
                          "h-8 px-2 text-xs rounded-none border gap-1 font-semibold cursor-pointer transition-colors",
                          isExpanded
                            ? "bg-primary text-white border-primary"
                            : "border-primary/30 text-primary hover:bg-primary-soft"
                        )}
                        title="Atur Gaya, Ketebalan, Warna, dan Jarak Garis Pembatas"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Gaya</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    )}

                    {/* Tombol Pintasan Pengaturan Konten Blok */}
                    {!isDivider && BLOCK_TAB_MAP[block.type] && (
                      <Link href={`/settings?tab=${BLOCK_TAB_MAP[block.type]}`}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs rounded-none border border-primary/25 text-primary hover:bg-primary-soft gap-1 font-semibold cursor-pointer"
                          title={`Buka Pengaturan Konten ${block.label}`}
                        >
                          <Settings className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Atur</span>
                        </Button>
                      </Link>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isFirst}
                      onClick={() => moveBlock(index, -1)}
                      title="Pindahkan ke atas"
                      className="h-8 w-8 rounded-none border border-primary/15 text-primary hover:bg-primary-soft disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isLast}
                      onClick={() => moveBlock(index, 1)}
                      title="Pindahkan ke bawah"
                      className="h-8 w-8 rounded-none border border-primary/15 text-primary hover:bg-primary-soft disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVisibility(block.id)}
                      title={isHidden ? "Tampilkan blok di Home" : "Sembunyikan blok dari Home"}
                      className={cn(
                        "h-8 w-8 rounded-none border transition-colors cursor-pointer",
                        isHidden
                          ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                          : "border-primary/20 text-primary hover:bg-primary-soft"
                      )}
                    >
                      {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlock(block.id)}
                      title="Hapus dari daftar susunan"
                      className="h-8 w-8 rounded-none border border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Panel Drawer Pengaturan Opsi Divider */}
                {isDivider && isExpanded && (
                  <div className="border-t border-primary/15 bg-background p-3.5 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center justify-between border-b border-primary/10 pb-1.5">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                        Pengaturan Tampilan Garis Pembatas
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedDividerId(null)}
                        className="text-[10px] text-primary/70 hover:text-primary underline cursor-pointer"
                      >
                        Tutup Panel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* 1. Gaya Garis */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-primary">Gaya Garis:</span>
                        <div className="grid grid-cols-2 gap-1">
                          {(["solid", "dashed", "dotted", "gradient", "double"] as DividerStyle[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => updateBlockOptions(block.id, { divider_style: st })}
                              className={cn(
                                "px-2 py-1 text-[10px] font-medium border rounded-none text-center transition-colors cursor-pointer capitalize",
                                dividerStyle === st
                                  ? "bg-primary text-white border-primary font-bold shadow-2xs"
                                  : "border-primary/20 bg-card-alt text-primary hover:bg-primary-soft"
                              )}
                            >
                              {st === "solid" ? "Lurus (Solid)" : st === "dashed" ? "Putus-putus" : st === "dotted" ? "Titik-titik" : st === "gradient" ? "Gradasi" : "Ganda (Double)"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Ketebalan Garis */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-primary">Ketebalan Garis:</span>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { val: 1, label: "1px (Tipis)" },
                            { val: 2, label: "2px (Sedang)" },
                            { val: 4, label: "4px (Tebal)" },
                          ].map((th) => (
                            <button
                              key={th.val}
                              type="button"
                              onClick={() => updateBlockOptions(block.id, { divider_thickness: th.val })}
                              className={cn(
                                "px-2 py-1.5 text-[10px] font-medium border rounded-none text-center transition-colors cursor-pointer",
                                dividerThickness === th.val
                                  ? "bg-primary text-white border-primary font-bold shadow-2xs"
                                  : "border-primary/20 bg-card-alt text-primary hover:bg-primary-soft"
                              )}
                            >
                              {th.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Warna Garis */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-primary">Warna Garis:</span>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { val: "default" as DividerColor, label: "Netral", desc: "Otomatis" },
                            { val: "primary" as DividerColor, label: "Tema", desc: "Hijau" },
                            { val: "muted" as DividerColor, label: "Halus", desc: "Lembut" },
                          ].map((c) => (
                            <button
                              key={c.val}
                              type="button"
                              onClick={() => updateBlockOptions(block.id, { divider_color: c.val })}
                              className={cn(
                                "px-2 py-1 text-[10px] font-medium border rounded-none text-center transition-colors cursor-pointer flex flex-col items-center justify-center",
                                dividerColor === c.val
                                  ? "bg-primary text-white border-primary font-bold shadow-2xs"
                                  : "border-primary/20 bg-card-alt text-primary hover:bg-primary-soft"
                              )}
                            >
                              <span>{c.label}</span>
                              <span className="text-[9px] opacity-75 font-normal">{c.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 4. Jarak Vertikal (Margin) */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-primary">Jarak Vertikal (Spasi):</span>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { val: "sm" as DividerSpacing, label: "Rapat", desc: "Kecil" },
                            { val: "md" as DividerSpacing, label: "Normal", desc: "Sedang" },
                            { val: "lg" as DividerSpacing, label: "Luas", desc: "Besar" },
                          ].map((sp) => (
                            <button
                              key={sp.val}
                              type="button"
                              onClick={() => updateBlockOptions(block.id, { divider_spacing: sp.val })}
                              className={cn(
                                "px-2 py-1 text-[10px] font-medium border rounded-none text-center transition-colors cursor-pointer flex flex-col items-center justify-center",
                                dividerSpacing === sp.val
                                  ? "bg-primary text-white border-primary font-bold shadow-2xs"
                                  : "border-primary/20 bg-card-alt text-primary hover:bg-primary-soft"
                              )}
                            >
                              <span>{sp.label}</span>
                              <span className="text-[9px] opacity-75 font-normal">{sp.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Tambah Blok Bagian yang Belum Masuk */}
      {availableToAdd.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-2 border-t border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">
              Tambah Bagian ke Halaman Home
            </span>
            <span className="text-[11px] text-primary/60">
              Klik modul di bawah untuk memasukkan ke dalam susunan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {availableToAdd.map((type) => {
              const meta = BLOCK_META[type]
              const isDivider = type === "divider"

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className={cn(
                    "flex items-start gap-2.5 p-2.5 text-left border transition-all rounded-none cursor-pointer group",
                    isDivider
                      ? "border-primary/40 bg-primary-soft/30 hover:bg-primary-soft hover:border-primary"
                      : "border-primary/20 bg-background hover:bg-primary-soft/40 hover:border-primary/50"
                  )}
                >
                  <Plus className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-primary truncate">{meta.label}</span>
                      {isDivider && (
                        <span className="text-[9px] font-semibold px-1 py-0.2 bg-primary text-white rounded-none shrink-0">
                          Bebas Tambah
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-primary/60 truncate">{meta.desc}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tombol Simpan & Reset di Bagian Bawah */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-primary/10">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="rounded-none border-primary/30 text-destructive hover:bg-destructive/10 font-semibold cursor-pointer w-full sm:w-auto text-xs h-9"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset ke Urutan Bawaan
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={openPreview}
            className="rounded-none border-primary/30 text-primary hover:bg-primary-soft font-semibold cursor-pointer w-full sm:w-auto text-xs h-9"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Pratinjau
          </Button>

          <Button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer w-full sm:w-auto text-xs h-9 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Menyimpan...
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-white" />
                Tersimpan!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Simpan Susunan Home
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

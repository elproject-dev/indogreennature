"use client"

import * as React from "react"
import {
  X,
  Save,
  RotateCcw,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Upload,
  ImageIcon,
  FileText,
} from "lucide-react"
import { uploadLegalityDocument } from "@/database/legality"
import { poppins } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import {
  LegalitySettingsData,
  LegalDocument,
  LEGALITY_SETTINGS_KEY,
  LEGALITY_PREVIEW_CHANNEL,
} from "@/lib/legality-settings"

interface LegalitySettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  data: LegalitySettingsData
  onChange: (updated: LegalitySettingsData) => void
  onSave: () => void
  onReset: () => void
  isSaving?: boolean
}

type LegalityTabKey = "hero" | "dokumen" | "panduan" | "cta"

const TABS: { key: LegalityTabKey; label: string; title: string; anchor: string }[] = [
  { key: "hero", label: "HERO & STATISTIK", title: "01. PENGATURAN HERO & STATISTIK", anchor: "hero-legalitas" },
  { key: "dokumen", label: "DAFTAR DOKUMEN", title: "02. PENGATURAN DAFTAR DOKUMEN", anchor: "dokumen-resmi" },
  { key: "panduan", label: "PANDUAN VERIFIKASI", title: "03. PENGATURAN PANDUAN VERIFIKASI", anchor: "panduan-verifikasi" },
  { key: "cta", label: "CTA DUE DILIGENCE", title: "04. PENGATURAN CTA DUE DILIGENCE", anchor: "due-diligence" },
]

function toSafeHexColor(color: string | undefined | null, fallback = "#15803d"): string {
  if (!color || typeof color !== "string") return fallback
  const t = color.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(t)) return t
  if (/^#[0-9a-fA-F]{3}$/.test(t)) return `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`
  return fallback
}

const inputCls =
  "w-full px-3.5 py-2 rounded-[5px] text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
const smallInputCls =
  "w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
const cardCls = "p-4 rounded-[5px] border border-border bg-card space-y-3"
const labelCls = "text-xs font-bold text-foreground uppercase tracking-wider"
const subLabelCls = "text-[11px] font-semibold text-muted-foreground mb-1 block"

function ColorPickerInput({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-[5px] bg-muted/40 border border-border">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground">{value || "Default (Hijau #15803D)"}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-muted-foreground hover:text-red-500 underline cursor-pointer"
          >
            Reset
          </button>
        )}
        <input
          type="color"
          value={toSafeHexColor(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-[5px] border border-border cursor-pointer bg-transparent"
        />
      </div>
    </div>
  )
}

export function LegalitySettingsSidebar({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
  onReset,
  isSaving = false,
}: LegalitySettingsSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<LegalityTabKey>("hero")
  const [openDocId, setOpenDocId] = React.useState<string | null>(null)
  const [uploadingDocId, setUploadingDocId] = React.useState<string | null>(null)

  if (!isOpen) return null

  const broadcast = (updated: LegalitySettingsData) => {
    onChange(updated)
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(LEGALITY_SETTINGS_KEY, JSON.stringify(updated))
    } catch {}
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel(LEGALITY_PREVIEW_CHANNEL)
        bc.postMessage({ type: "PREVIEW_UPDATE", data: updated })
        bc.close()
      }
    } catch {}
  }

  const setField = <K extends keyof LegalitySettingsData>(field: K, val: LegalitySettingsData[K]) =>
    broadcast({ ...data, [field]: val })

  // ── List helpers ──
  const updateStat = (idx: number, patch: Partial<LegalitySettingsData["heroStats"][number]>) => {
    const next = [...data.heroStats]
    next[idx] = { ...next[idx], ...patch }
    setField("heroStats", next)
  }
  const addStat = () =>
    setField("heroStats", [
      ...data.heroStats,
      { id: `stat-${Date.now()}`, title: "Judul Statistik", subtitle: "Keterangan singkat" },
    ])
  const deleteStat = (idx: number) =>
    setField("heroStats", data.heroStats.filter((_, i) => i !== idx))

  const updateDoc = (idx: number, patch: Partial<LegalDocument>) => {
    const next = [...data.documents]
    next[idx] = { ...next[idx], ...patch }
    setField("documents", next)
  }
  const addDoc = () => {
    const id = `doc-${Date.now()}`
    setField("documents", [
      ...data.documents,
      {
        id,
        title: "Judul Dokumen Baru",
        subtitle: "",
        docNumber: "-",
        issuer: "Instansi Penerbit",
        issueDate: "",
        validity: "",
        scope: "",
        description: "Deskripsi dokumen...",
        verificationUrl: "",
        verificationNote: "",
        highlights: [],
      },
    ])
    setOpenDocId(id)
  }
  const deleteDoc = (idx: number) => {
    if (!confirm("Hapus dokumen ini?")) return
    setField("documents", data.documents.filter((_, i) => i !== idx))
  }
  const handleDocImageUpload = async (idx: number, file: File | undefined) => {
    if (!file) return
    const docId = data.documents[idx].id
    setUploadingDocId(docId)
    try {
      const res = await uploadLegalityDocument(file, docId)
      if (res?.url) {
        updateDoc(idx, { imageUrl: res.url })
      }
    } catch (err) {
      console.error("[LegalitySettings] Gagal memproses file dokumen:", err)
      alert("Gagal mengunggah file dokumen.")
    } finally {
      setUploadingDocId(null)
    }
  }

  const moveDoc = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= data.documents.length) return
    const next = [...data.documents]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setField("documents", next)
  }

  const updateStep = (idx: number, patch: Partial<LegalitySettingsData["guideSteps"][number]>) => {
    const next = [...data.guideSteps]
    next[idx] = { ...next[idx], ...patch }
    setField("guideSteps", next)
  }
  const addStep = () =>
    setField("guideSteps", [
      ...data.guideSteps,
      { id: `step-${Date.now()}`, title: "Langkah Baru", desc: "Deskripsi langkah..." },
    ])
  const deleteStep = (idx: number) =>
    setField("guideSteps", data.guideSteps.filter((_, i) => i !== idx))

  const activeMeta = TABS.find((t) => t.key === activeTab)!

  const iconBtn =
    "w-7 h-7 rounded-[5px] border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-1.5 sm:p-3 md:p-4 transition-all duration-300">
      <div className="w-[98vw] max-w-[1560px] h-[95vh] max-h-[920px] bg-white dark:bg-zinc-900 rounded-[8px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-700 relative">
        {/* ─── SIDEBAR KIRI ─── */}
        <div className="w-full md:w-[316px] md:min-w-[316px] md:max-w-[316px] flex flex-col bg-[#D9D9D9] dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 shrink-0 select-none">
          <div className="w-full h-[60px] bg-[#D97706] px-4 flex items-center justify-between md:justify-center relative shadow-xs">
            <h2 className={cn("text-[12px] font-bold text-white tracking-wider uppercase text-center w-full", poppins.className)}>
              PENGATURAN LEGALITY
            </h2>
            <button
              onClick={onClose}
              className="md:hidden text-white/80 hover:text-white p-1 rounded hover:bg-black/10 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                  poppins.className,
                  activeTab === t.key
                    ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                    : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-300 dark:border-zinc-700 bg-white/40 dark:bg-black/20 flex flex-col gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className={cn(
                "w-full h-[40px] rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-70 cursor-pointer",
                poppins.className
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Kembalikan semua pengaturan legalitas ke standar awal?")) onReset()
              }}
              className={cn(
                "w-full h-[36px] rounded-[5px] border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
                poppins.className
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Default</span>
            </button>
          </div>
        </div>

        {/* ─── PANEL KANAN ─── */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          <div className="h-[60px] px-6 border-b border-border flex items-center justify-between shrink-0 bg-card">
            <span className="text-xs uppercase tracking-wider font-bold text-primary">{activeMeta.title}</span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem(LEGALITY_SETTINGS_KEY, JSON.stringify(data))
                  } catch {}
                  window.open(`/legality?preview=true#${activeMeta.anchor}`, "_blank")
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer shadow-xs"
                title="Buka Pratinjau Halaman di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Pratinjau Halaman</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Tutup Pengaturan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* ═════ TAB 1: HERO ═════ */}
            {activeTab === "hero" && (
              <div className="w-full space-y-6">
                <div className={cardCls}>
                  <label className={labelCls}>Judul Halaman</label>
                  <input
                    type="text"
                    value={data.heroTitle}
                    onChange={(e) => setField("heroTitle", e.target.value)}
                    className={inputCls}
                  />
                  <ColorPickerInput
                    label="Warna Judul"
                    value={data.heroTitleColor}
                    onChange={(c) => setField("heroTitleColor", c)}
                  />
                </div>

                <div className={cardCls}>
                  <label className={labelCls}>Deskripsi Halaman</label>
                  <textarea
                    rows={4}
                    value={data.heroSubtitle}
                    onChange={(e) => setField("heroSubtitle", e.target.value)}
                    className={cn(inputCls, "resize-none")}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Gunakan format <strong>**teks**</strong> untuk menebalkan kata, contoh: <code>**CV. Indo Green Nature**</code>
                  </p>
                </div>

                <div className={cardCls}>
                  <ColorPickerInput
                    label="Warna Aksen Utama (tombol, badge, judul kartu)"
                    value={data.accentColor}
                    onChange={(c) => setField("accentColor", c)}
                  />
                </div>

                <div className={cardCls}>
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>Badge Statistik ({data.heroStats.length})</label>
                    <button
                      type="button"
                      onClick={addStat}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                  {data.heroStats.map((s, i) => (
                    <div key={s.id} className="p-3 rounded-[5px] border border-border bg-background/60 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={s.title}
                          onChange={(e) => updateStat(i, { title: e.target.value })}
                          className={cn(smallInputCls, "font-bold")}
                          placeholder="Judul"
                        />
                        <button type="button" onClick={() => deleteStat(i)} className={cn(iconBtn, "hover:text-red-500")} title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={s.subtitle}
                        onChange={(e) => updateStat(i, { subtitle: e.target.value })}
                        className={smallInputCls}
                        placeholder="Keterangan"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════ TAB 2: DOKUMEN ═════ */}
            {activeTab === "dokumen" && (
              <div className="w-full space-y-4">
                <div className={cardCls}>
                  <label className={labelCls}>Teks Tombol Kartu Dokumen</label>
                  <input
                    type="text"
                    value={data.docCardBtnText}
                    onChange={(e) => setField("docCardBtnText", e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={labelCls}>Dokumen ({data.documents.length})</span>
                  <button
                    type="button"
                    onClick={addDoc}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Dokumen
                  </button>
                </div>

                {data.documents.map((doc, i) => {
                  const isOpenDoc = openDocId === doc.id
                  return (
                    <div key={doc.id} className="rounded-[5px] border border-border bg-card overflow-hidden">
                      <div className="flex items-center gap-2 p-3">
                        <button
                          type="button"
                          onClick={() => setOpenDocId(isOpenDoc ? null : doc.id)}
                          className="flex-1 min-w-0 text-left cursor-pointer"
                        >
                          <span className="text-[10px] font-bold text-[#15803D] block truncate">
                            {i + 1}. {doc.issuer}
                          </span>
                          <span className="text-sm font-semibold text-foreground block truncate">{doc.title}</span>
                        </button>
                        <button type="button" onClick={() => moveDoc(i, -1)} disabled={i === 0} className={cn(iconBtn, "disabled:opacity-30")} title="Naikkan">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => moveDoc(i, 1)} disabled={i === data.documents.length - 1} className={cn(iconBtn, "disabled:opacity-30")} title="Turunkan">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => deleteDoc(i)} className={cn(iconBtn, "hover:text-red-500")} title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {isOpenDoc && (
                        <div className="p-4 border-t border-border space-y-3 bg-background/40">
                          <div className="p-3.5 rounded-[5px] border border-border bg-card space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={subLabelCls}>File Dokumen Resmi (Foto Sertifikat / PDF)</span>
                              {doc.imageUrl && (
                                <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                  ✓ Dokumen Terpasang
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-3">
                              {/* Preview Box */}
                              <div className="w-28 h-36 rounded-[5px] border border-border bg-background/50 flex flex-col items-center justify-center overflow-hidden shrink-0 relative group">
                                {doc.imageUrl ? (
                                  doc.imageUrl.toLowerCase().includes(".pdf") ||
                                  doc.imageUrl.startsWith("data:application/pdf") ? (
                                    <div className="flex flex-col items-center justify-center p-2 text-center gap-1.5">
                                      <FileText className="w-9 h-9 text-rose-500" />
                                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                                        Dokumen PDF
                                      </span>
                                    </div>
                                  ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={doc.imageUrl} alt={doc.title} className="w-full h-full object-contain p-1" />
                                  )
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground/60">
                                    <ImageIcon className="w-6 h-6" />
                                    <span className="text-[9.5px]">Belum ada file</span>
                                  </div>
                                )}
                              </div>

                              {/* Upload Controls */}
                              <div className="flex-1 space-y-2.5 w-full">
                                <div className="flex flex-wrap items-center gap-2">
                                  <label
                                    className={cn(
                                      "inline-flex items-center gap-2 px-3.5 py-2 rounded-[5px] text-xs font-semibold bg-[#15803D] hover:bg-[#166534] text-white transition-colors cursor-pointer shadow-xs",
                                      uploadingDocId === doc.id && "opacity-70 pointer-events-none"
                                    )}
                                  >
                                    {uploadingDocId === doc.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Upload className="w-3.5 h-3.5" />
                                    )}
                                    <span>
                                      {uploadingDocId === doc.id
                                        ? "Mengunggah Dokumen..."
                                        : doc.imageUrl
                                        ? "Ganti File Dokumen"
                                        : "Upload Dokumen (Foto / PDF)"}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        handleDocImageUpload(i, e.target.files?.[0])
                                        e.target.value = ""
                                      }}
                                    />
                                  </label>

                                  {doc.imageUrl && (
                                    <>
                                      <a
                                        href={doc.imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[5px] text-xs font-semibold border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer shadow-2xs"
                                        title="Pratinjau dokumen di tab baru"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 text-[#15803D]" />
                                        <span>Lihat File</span>
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() => updateDoc(i, { imageUrl: "" })}
                                        className="inline-flex items-center gap-1 px-3 py-2 rounded-[5px] text-xs font-semibold border border-border text-muted-foreground hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                                        title="Hapus file dokumen"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                      </button>
                                    </>
                                  )}
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10.5px] text-muted-foreground block">
                                    Atau tempel URL gambar / file PDF:
                                  </span>
                                  <input
                                    type="text"
                                    value={doc.imageUrl || ""}
                                    onChange={(e) => updateDoc(i, { imageUrl: e.target.value })}
                                    placeholder="https://... (URL gambar atau file PDF)"
                                    className={smallInputCls}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className={subLabelCls}>Judul Dokumen</span>
                            <input type="text" value={doc.title} onChange={(e) => updateDoc(i, { title: e.target.value })} className={smallInputCls} />
                          </div>
                          <div>
                            <span className={subLabelCls}>Subjudul (tampil di detail)</span>
                            <input type="text" value={doc.subtitle} onChange={(e) => updateDoc(i, { subtitle: e.target.value })} className={smallInputCls} />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className={subLabelCls}>Nomor Dokumen Registrasi</span>
                              <input type="text" value={doc.docNumber} onChange={(e) => updateDoc(i, { docNumber: e.target.value })} className={cn(smallInputCls, "font-mono")} />
                            </div>
                            <div>
                              <span className={subLabelCls}>Instansi Penerbit</span>
                              <input type="text" value={doc.issuer} onChange={(e) => updateDoc(i, { issuer: e.target.value })} className={smallInputCls} />
                            </div>
                            <div>
                              <span className={subLabelCls}>Tanggal Terbit / Status</span>
                              <input type="text" value={doc.issueDate} onChange={(e) => updateDoc(i, { issueDate: e.target.value })} className={smallInputCls} />
                            </div>
                            <div>
                              <span className={subLabelCls}>Masa Berlaku</span>
                              <input type="text" value={doc.validity} onChange={(e) => updateDoc(i, { validity: e.target.value })} className={smallInputCls} />
                            </div>
                          </div>
                          <div>
                            <span className={subLabelCls}>Deskripsi / Penjelasan Kepatuhan</span>
                            <textarea rows={4} value={doc.description} onChange={(e) => updateDoc(i, { description: e.target.value })} className={cn(smallInputCls, "resize-none")} />
                          </div>
                          <div>
                            <span className={subLabelCls}>Ruang Lingkup</span>
                            <textarea rows={2} value={doc.scope} onChange={(e) => updateDoc(i, { scope: e.target.value })} className={cn(smallInputCls, "resize-none")} />
                          </div>
                          <div>
                            <span className={subLabelCls}>Poin Jaminan Mutu (satu poin per baris)</span>
                            <textarea
                              rows={5}
                              value={doc.highlights.join("\n")}
                              onChange={(e) => updateDoc(i, { highlights: e.target.value.split("\n") })}
                              onBlur={(e) =>
                                updateDoc(i, {
                                  highlights: e.target.value.split("\n").map((h) => h.trim()).filter(Boolean),
                                })
                              }
                              className={cn(smallInputCls, "resize-none")}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className={subLabelCls}>URL Verifikasi Portal Resmi</span>
                              <input type="text" value={doc.verificationUrl || ""} onChange={(e) => updateDoc(i, { verificationUrl: e.target.value })} className={smallInputCls} placeholder="https://..." />
                            </div>
                            <div>
                              <span className={subLabelCls}>Catatan Verifikasi</span>
                              <input type="text" value={doc.verificationNote || ""} onChange={(e) => updateDoc(i, { verificationNote: e.target.value })} className={smallInputCls} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ═════ TAB 3: PANDUAN ═════ */}
            {activeTab === "panduan" && (
              <div className="w-full space-y-6">
                <div className={cardCls}>
                  <label className={labelCls}>Label Kecil</label>
                  <input type="text" value={data.guideLabel} onChange={(e) => setField("guideLabel", e.target.value)} className={inputCls} />
                  <label className={cn(labelCls, "block pt-2")}>Judul Panduan</label>
                  <input type="text" value={data.guideTitle} onChange={(e) => setField("guideTitle", e.target.value)} className={inputCls} />
                  <label className={cn(labelCls, "block pt-2")}>Deskripsi Panduan</label>
                  <textarea rows={3} value={data.guideDesc} onChange={(e) => setField("guideDesc", e.target.value)} className={cn(inputCls, "resize-none")} />
                </div>

                <div className={cardCls}>
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>Langkah Verifikasi ({data.guideSteps.length})</label>
                    <button
                      type="button"
                      onClick={addStep}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Gunakan <strong>**teks**</strong> pada deskripsi untuk menebalkan kata.
                  </p>
                  {data.guideSteps.map((s, i) => (
                    <div key={s.id} className="p-3 rounded-[5px] border border-border bg-background/60 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#15803D] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <input
                          type="text"
                          value={s.title}
                          onChange={(e) => updateStep(i, { title: e.target.value })}
                          className={cn(smallInputCls, "font-bold")}
                        />
                        <button type="button" onClick={() => deleteStep(i)} className={cn(iconBtn, "hover:text-red-500")} title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={s.desc}
                        onChange={(e) => updateStep(i, { desc: e.target.value })}
                        className={cn(smallInputCls, "resize-none")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════ TAB 4: CTA ═════ */}
            {activeTab === "cta" && (
              <div className="w-full space-y-6">
                <div className={cardCls}>
                  <label className={labelCls}>Teks Badge</label>
                  <input type="text" value={data.ctaBadge} onChange={(e) => setField("ctaBadge", e.target.value)} className={inputCls} />
                  <label className={cn(labelCls, "block pt-2")}>Judul CTA</label>
                  <textarea rows={2} value={data.ctaTitle} onChange={(e) => setField("ctaTitle", e.target.value)} className={cn(inputCls, "resize-none")} />
                  <label className={cn(labelCls, "block pt-2")}>Teks Tombol</label>
                  <input type="text" value={data.ctaBtnText} onChange={(e) => setField("ctaBtnText", e.target.value)} className={inputCls} />
                </div>

                <div className={cardCls}>
                  <label className={labelCls}>WhatsApp Tujuan</label>
                  <div>
                    <span className={subLabelCls}>Nomor WhatsApp (format 62xxxxxxxxxx)</span>
                    <input
                      type="text"
                      value={data.ctaWhatsappNumber}
                      onChange={(e) => setField("ctaWhatsappNumber", e.target.value.replace(/[^0-9]/g, ""))}
                      className={cn(inputCls, "font-mono")}
                      placeholder="6282136368880"
                    />
                  </div>
                  <div>
                    <span className={subLabelCls}>Pesan Otomatis</span>
                    <textarea
                      rows={3}
                      value={data.ctaWhatsappMessage}
                      onChange={(e) => setField("ctaWhatsappMessage", e.target.value)}
                      className={cn(inputCls, "resize-none")}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Nomor ini juga dipakai tombol &quot;Minta Salinan Dokumen&quot; pada detail dokumen.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

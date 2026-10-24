"use client"

import React, { useState, useEffect } from "react"
import {
  MessageCircle,
  Save,
  RotateCcw,
  Check,
  Loader2,
  Phone,
  Handshake,
  Leaf,
  Sparkles,
  Eye,
  Info,
  Send,
  CheckCheck,
} from "lucide-react"
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
  WhatsAppButtonSettings,
  DEFAULT_WHATSAPP_SETTINGS,
  getInitialWhatsAppSettings,
  fetchWhatsAppSettings,
  saveWhatsAppSettings,
  normalizeWhatsAppNumber,
} from "@/lib/whatsapp-settings"

export function WhatsAppSettingsPanel() {
  const [settings, setSettings] = useState<WhatsAppButtonSettings>(getInitialWhatsAppSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const data = await fetchWhatsAppSettings()
        if (isMounted) {
          setSettings(data)
        }
      } catch (err) {
        console.warn("Gagal memuat pengaturan WhatsApp:", err)
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const cleanedMaklon = normalizeWhatsAppNumber(settings.phoneMaklon) || DEFAULT_WHATSAPP_SETTINGS.phoneMaklon
      const cleanedDefault = normalizeWhatsAppNumber(settings.phoneDefault) || DEFAULT_WHATSAPP_SETTINGS.phoneDefault

      const cleanedTopics = settings.topics.map((t) => {
        let p = normalizeWhatsAppNumber(t.phone)
        if (!p) {
          p = t.id === "maklon" ? cleanedMaklon : cleanedDefault
        }
        return {
          ...t,
          phone: p,
          enabled: t.enabled !== false,
        }
      })

      const preparedSettings: WhatsAppButtonSettings = {
        ...settings,
        phoneMaklon: cleanedMaklon,
        phoneDefault: cleanedDefault,
        topics: cleanedTopics,
      }
      setSettings(preparedSettings)

      const res = await saveWhatsAppSettings(preparedSettings)
      if (res.success) {
        toast.add({
          title: "Pengaturan WhatsApp Berhasil Disimpan",
          description: "Nomor dan preferensi langsung aktif secara real-time pada tombol floating WhatsApp.",
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
        description: err?.message || "Gagal menyimpan.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm("Kembalikan seluruh pengaturan Tombol WhatsApp ke nilai bawaan?")) {
      setSettings(DEFAULT_WHATSAPP_SETTINGS)
      toast.add({
        title: "Pengaturan Direset",
        description: "Nilai telah dikembalikan ke default. Klik 'Simpan Perubahan' untuk menerapkan permanen.",
        type: "info",
      })
    }
  }

  const updateTopic = (index: number, updates: Partial<(typeof settings.topics)[0]>) => {
    const newTopics = [...settings.topics]
    newTopics[index] = { ...newTopics[index], ...updates }

    let updatedPhoneMaklon = settings.phoneMaklon
    let updatedPhoneDefault = settings.phoneDefault

    if (updates.phone !== undefined) {
      if (newTopics[index].id === "maklon") {
        updatedPhoneMaklon = updates.phone
      } else if (newTopics[index].id === "produk") {
        updatedPhoneDefault = updates.phone
      }
    }

    setSettings({
      ...settings,
      phoneMaklon: updatedPhoneMaklon,
      phoneDefault: updatedPhoneDefault,
      topics: newTopics,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-3 text-sm font-medium">Memuat Pengaturan WhatsApp...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-primary flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#15803D]" />
            <span>Pengaturan Tombol Chat WhatsApp</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Atur status tombol mengambang, nomor tujuan WhatsApp resmi, pesan pembuka, serta topik layanan cepat.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSaving}
            className="text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Default
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs font-semibold cursor-pointer bg-[#15803D] hover:bg-[#166534] text-white"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri & Tengah: Form Pengaturan */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* 1. Status & Tampilan Global */}
          <Card className="rounded-[6px] border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">
                1. Status &amp; Posisi Tombol
              </CardTitle>
              <CardDescription className="text-xs">
                Kontrol apakah widget WhatsApp ditampilkan dan di sudut mana tombol melayang muncul.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {/* Toggle Aktif */}
              <div className="flex items-center justify-between p-3.5 rounded-[5px] bg-muted/40 border border-border/80">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Aktifkan Tombol WhatsApp Melayang
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Tampilkan widget chat WhatsApp di pojok halaman untuk memudahkan pengunjung berkonsultasi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.isEnabled ? "bg-[#15803D]" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                  aria-pressed={settings.isEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Posisi & Tooltip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="wa-position" className="text-xs font-semibold">
                    Posisi Tombol di Layar
                  </Label>
                  <select
                    id="wa-position"
                    value={settings.position}
                    onChange={(e) =>
                      setSettings({ ...settings, position: e.target.value as "right" | "left" })
                    }
                    className="w-full text-xs h-9 px-3 rounded-[5px] border border-border bg-background text-foreground focus:ring-2 focus:ring-[#15803D] focus:outline-none cursor-pointer"
                  >
                    <option value="right">Kanan Bawah (Standar / Direkomendasikan)</option>
                    <option value="left">Kiri Bawah</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wa-tooltip" className="text-xs font-semibold">
                    Teks Tooltip Hover (Desktop)
                  </Label>
                  <Input
                    id="wa-tooltip"
                    value={settings.tooltipText}
                    onChange={(e) => setSettings({ ...settings, tooltipText: e.target.value })}
                    placeholder="Contoh: Chat WhatsApp CV. Indo Green Nature"
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Nomor WhatsApp Tujuan */}
          <Card className="rounded-[6px] border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>2. Nomor Kontak WhatsApp Resmi</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Format nomor internasional tanpa tanda + atau spasi (contoh: <code>6282136368880</code>).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="wa-phone-maklon" className="text-xs font-semibold flex items-center gap-1.5">
                    <Handshake className="w-3.5 h-3.5 text-primary" />
                    <span>WhatsApp Bisnis &amp; Maklon</span>
                  </Label>
                  <Input
                    id="wa-phone-maklon"
                    value={settings.phoneMaklon}
                    onChange={(e) => {
                      const val = e.target.value
                      const newTopics = settings.topics.map((t) =>
                        t.id === "maklon" ? { ...t, phone: val } : t
                      )
                      setSettings({ ...settings, phoneMaklon: val, topics: newTopics })
                    }}
                    placeholder="6282136368880"
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Otomatis tersinkronisasi ke Topik Jasa Maklon Herbal &amp; Kemitraan.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wa-phone-default" className="text-xs font-semibold flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-primary" />
                    <span>WhatsApp Umum &amp; Produk</span>
                  </Label>
                  <Input
                    id="wa-phone-default"
                    value={settings.phoneDefault}
                    onChange={(e) => {
                      const val = e.target.value
                      const newTopics = settings.topics.map((t) =>
                        t.id === "produk" ? { ...t, phone: val } : t
                      )
                      setSettings({ ...settings, phoneDefault: val, topics: newTopics })
                    }}
                    placeholder="6285877669199"
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Otomatis tersinkronisasi ke Topik Produk Herbal &amp; chat umum.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Teks Header & Sambutan Chat */}
          <Card className="rounded-[6px] border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">
                3. Teks Header &amp; Pesan Sambutan
              </CardTitle>
              <CardDescription className="text-xs">
                Kustomisasi teks sambutan yang dibaca pengunjung saat pertama kali jendela chat terbuka.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="wa-header-title" className="text-xs font-semibold">
                    Judul Header Chat
                  </Label>
                  <Input
                    id="wa-header-title"
                    value={settings.headerTitle}
                    onChange={(e) => setSettings({ ...settings, headerTitle: e.target.value })}
                    placeholder="CV. Indo Green Nature Support"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wa-header-subtitle" className="text-xs font-semibold">
                    Status Header
                  </Label>
                  <Input
                    id="wa-header-subtitle"
                    value={settings.headerSubtitle}
                    onChange={(e) => setSettings({ ...settings, headerSubtitle: e.target.value })}
                    placeholder="Online • Siap Mendengarkan"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wa-greet-1" className="text-xs font-semibold">
                  Pesan Sambutan Baris 1
                </Label>
                <Input
                  id="wa-greet-1"
                  value={settings.greetingMessage1}
                  onChange={(e) => setSettings({ ...settings, greetingMessage1: e.target.value })}
                  placeholder="Halo! 👋 Selamat datang di CV. Indo Green Nature."
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wa-greet-2" className="text-xs font-semibold">
                  Pesan Sambutan Baris 2
                </Label>
                <Textarea
                  id="wa-greet-2"
                  value={settings.greetingMessage2}
                  onChange={(e) => setSettings({ ...settings, greetingMessage2: e.target.value })}
                  placeholder="Ada yang bisa kami bantu? Pilih topik layanan di bawah atau ketik pesan konsultasi Anda langsung ke tim kami."
                  className="text-xs resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Topik Layanan Cepat (Maklon & Produk Herbal) */}
          <Card className="rounded-[6px] border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">
                4. Pengaturan Topik Layanan Cepat
              </CardTitle>
              <CardDescription className="text-xs">
                Sesuaikan judul, deskripsi, nomor tujuan khusus, dan draft pesan untuk masing-masing topik.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-1">
              {settings.topics.map((topic, idx) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-[6px] border border-border bg-card space-y-3.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#15803D]/15 text-[#15803D] flex items-center justify-center font-bold text-xs">
                        {idx === 0 ? <Handshake className="w-3.5 h-3.5" /> : <Leaf className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                        {topic.id === "maklon" ? "Topik 1: Jasa Maklon Herbal" : "Topik 2: Produk Herbal"}
                      </span>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <span className="text-[11px] text-muted-foreground">Aktifkan</span>
                      <input
                        type="checkbox"
                        checked={topic.enabled !== false}
                        onChange={(e) => updateTopic(idx, { enabled: e.target.checked })}
                        className="rounded border-border text-[#15803D] focus:ring-[#15803D] h-4 w-4 cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">Judul Topik</span>
                      <Input
                        value={topic.title}
                        onChange={(e) => updateTopic(idx, { title: e.target.value })}
                        className="text-xs h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">Deskripsi Singkat</span>
                      <Input
                        value={topic.description}
                        onChange={(e) => updateTopic(idx, { description: e.target.value })}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Nomor WhatsApp Tujuan</span>
                    <Input
                      value={topic.phone}
                      onChange={(e) => updateTopic(idx, { phone: e.target.value })}
                      placeholder="628xxxxxxxxxx"
                      className="text-xs h-8 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Draft Pesan Otomatis (Saat Topik Dipilih)
                    </span>
                    <Textarea
                      value={topic.template}
                      onChange={(e) => updateTopic(idx, { template: e.target.value })}
                      className="text-xs resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Kolom Kanan: Live Preview Widget */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-6 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wide">
              <Eye className="w-4 h-4 text-[#15803D]" />
              <span>Pratinjau Widget Chat (Live)</span>
            </div>

            {/* Mockup Chat Box Box */}
            <div className="w-full bg-[#0c1317] border border-emerald-500/20 rounded-2xl shadow-xl overflow-hidden flex flex-col text-sm font-sans select-none">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#00a884] via-[#099273] to-[#128c7e] p-3 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden border border-white/80 shadow-xs">
                      <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-[#099273] rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white leading-tight">
                      {settings.headerTitle || "CV. Indo Green Nature Support"}
                    </h4>
                    <p className="text-[10px] text-emerald-100 font-medium">
                      {settings.headerSubtitle || "Online • Siap Mendengarkan"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-3 space-y-2.5 bg-[#0b141a] text-xs">
                {/* Bubble CS */}
                <div className="bg-[#1e2a30] text-gray-100 p-2.5 rounded-xl rounded-tl-xs border border-white/10 space-y-1">
                  <p className="text-[11px] font-semibold text-[#00a884] flex items-center gap-1">
                    <span>🌿</span> CV. Indo Green Nature CS
                  </p>
                  <p className="text-[11px] text-gray-200">
                    {settings.greetingMessage1}
                  </p>
                  <p className="text-[11px] text-gray-300">
                    {settings.greetingMessage2}
                  </p>
                </div>

                {/* Topics Preview */}
                <div className="pt-1 space-y-1.5">
                  <p className="text-[10px] text-gray-400 font-medium">Topik Cepat:</p>
                  {settings.topics
                    .filter((t) => t.enabled !== false)
                    .map((topic) => (
                      <div
                        key={topic.id}
                        className="p-2 rounded-lg bg-[#182229] border border-white/10 flex items-center justify-between text-gray-300 text-[11px]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            {topic.id === "maklon" ? (
                              <Handshake className="w-3 h-3" />
                            ) : (
                              <Leaf className="w-3 h-3" />
                            )}
                          </div>
                          <div className="truncate">
                            <span className="font-medium block leading-tight">{topic.title}</span>
                            <span className="text-[9px] text-gray-400 block truncate">{topic.description}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer Input Mockup */}
              <div className="p-2.5 bg-[#182229] border-t border-white/10 flex items-center gap-2">
                <div className="flex-1 bg-[#0b141a] text-gray-500 text-[11px] px-2.5 py-1.5 rounded-lg border border-white/10">
                  Ketik pesan...
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#00a884] text-white flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Floating Trigger Button Preview */}
            <div className="p-3 rounded-[6px] border border-border bg-card flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">Tombol Mengambang</span>
                <span className="text-[10px] text-muted-foreground">Posisi: {settings.position === "left" ? "Kiri Bawah" : "Kanan Bawah"}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-md">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

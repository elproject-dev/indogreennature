"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  Mail,
  ChevronDown,
  Handshake,
  Package,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Leaf,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { poppins, getHeroFontFamily } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ContactSettingsSidebar } from "@/components/contact-settings-sidebar"
import {
  ContactSettingsData,
  DEFAULT_CONTACT_SETTINGS,
  CONTACT_SETTINGS_KEY,
  CONTACT_PREVIEW_CHANNEL,
  ContactFaqItem,
  getInitialContactSettings,
  fetchContactSettings,
  saveContactSettings,
  resetContactSettings,
} from "@/lib/contact-settings"
import { renderFormattedText } from "@/lib/home-blocks"
import { trackButtonClick } from "@/lib/track-click"
import { supabase } from "@/lib/supabase"
import { isUserAdmin } from "@/lib/auth-admin"

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: ContactFaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        "w-full rounded-[5px] bg-white dark:bg-card transition-all duration-300 ease-in-out overflow-hidden border-2",
        isOpen
          ? "border-[#16A34A] shadow-md dark:border-[#16A34A]"
          : "border-[#E2E8F0] dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-xs"
      )}
    >
      {/* Baris Pertanyaan (Clickable) */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors duration-200 select-none"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "text-sm sm:text-base md:text-[17px] font-bold leading-snug tracking-tight flex-1 transition-colors duration-300",
            poppins.className,
            isOpen ? "text-[#16A34A]" : "text-foreground"
          )}
        >
          {item.question}
        </span>

        {/* Tombol Chevron Lingkaran persis seperti di halaman Home */}
        <div
          className={cn(
            "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-350 ease-out",
            isOpen
              ? "bg-[#16A34A] text-white rotate-180 shadow-xs"
              : "bg-[#EEF2F6] dark:bg-white/10 text-[#64748B] dark:text-gray-300 rotate-0"
          )}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-350" />
        </div>
      </button>

      {/* Jawaban Accordion dengan Animasi Buka Tutup Halus (CSS Grid Transition) */}
      <div
        className={cn(
          "grid transition-all duration-350 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
            <div className="pt-3 sm:pt-4 border-t border-gray-100 dark:border-white/10">
              <p
                className={cn(
                  "text-xs sm:text-sm md:text-[15px] leading-relaxed whitespace-pre-line font-normal transition-opacity duration-300 text-foreground/85",
                  poppins.className
                )}
              >
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactForm({
  receiverEmail,
  footnote,
}: {
  receiverEmail: string
  footnote?: string
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: "umum",
    message: "",
  })
  const [isSent, setIsSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, to: receiverEmail }),
      })
      if (!res.ok) throw new Error()
      setIsSent(true)
      trackButtonClick({
        buttonType: "contact_form_submit",
        itemName: `Form: ${form.name} (${form.subject})`,
        pagePath: "/contact",
      })
    } catch {
      setError("Gagal mengirim pesan. Silakan coba lagi atau hubungi kami via WhatsApp.")
    } finally {
      setIsSending(false)
    }
  }


  if (isSent) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-10 text-center gap-4", poppins.className)}>
        <CheckCircle2 className="w-10 h-10 text-primary" />

        <div className="flex flex-col gap-1 max-w-sm">
          <p className="text-sm text-foreground/85">
            Pesan Anda berhasil terkirim ke
          </p>
          <span className="font-semibold text-primary text-sm sm:text-base">
            {receiverEmail || "admin@indogreennature.com"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSent(false)
            setForm({ name: "", company: "", phone: "", email: "", subject: "umum", message: "" })
          }}
          className="mt-2 px-6 py-2.5 text-xs font-semibold rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors cursor-pointer"
        >
          Kirim Pesan Lain
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", poppins.className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-name"
            className={cn("text-xs font-semibold text-foreground/80", poppins.className)}
          >
            Nama Lengkap <span className="text-primary">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama Anda"
            className={cn(
              "w-full px-4 py-2.5 text-sm rounded-[5px] border border-border bg-background text-foreground placeholder:text-muted-foreground/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
              poppins.className
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-company"
            className={cn("text-xs font-semibold text-foreground/80", poppins.className)}
          >
            Nama Perusahaan / Brand
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={handleChange}
            placeholder="Opsional"
            className={cn(
              "w-full px-4 py-2.5 text-sm rounded-[5px] border border-border bg-background text-foreground placeholder:text-muted-foreground/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
              poppins.className
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-email"
            className={cn("text-xs font-semibold text-foreground/80", poppins.className)}
          >
            Alamat Email <span className="text-primary">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="email@anda.com"
            className={cn(
              "w-full px-4 py-2.5 text-sm rounded-[5px] border border-border bg-background text-foreground placeholder:text-muted-foreground/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
              poppins.className
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-phone"
            className={cn("text-xs font-semibold text-foreground/80", poppins.className)}
          >
            No. WhatsApp / HP
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx (opsional)"
            className={cn(
              "w-full px-4 py-2.5 text-sm rounded-[5px] border border-border bg-background text-foreground placeholder:text-muted-foreground/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
              poppins.className
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-subject"
          className={cn("text-xs font-semibold text-foreground/80", poppins.className)}
        >
          Topik Pesan <span className="text-primary">*</span>
        </label>
        <div className="relative w-full">
          <select
            id="contact-subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className={cn(
              "w-full appearance-none pl-4 pr-10 py-2.5 text-sm rounded-[5px] border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors cursor-pointer",
              poppins.className
            )}
          >
            <option value="umum">Pertanyaan Umum</option>
            <option value="kemitraan">Permintaan Kemitraan</option>
            <option value="maklon">Permintaan Maklon / OEM</option>
            <option value="produk">Informasi Produk</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className={cn("text-xs font-semibold text-foreground/80", poppins.className)}
        >
          Pesan / Kebutuhan Anda <span className="text-primary">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Jelaskan kebutuhan Anda secara singkat..."
          className={cn(
            "w-full px-4 py-2.5 text-sm rounded-[5px] border border-border bg-background text-foreground placeholder:text-muted-foreground/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none",
            poppins.className
          )}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSending}
        className={cn(
          "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer",
          poppins.className
        )}
      >
        {isSending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Kirim via Email
          </>
        )}
      </button>

      {footnote && (
        <p className={cn("text-[11px] text-foreground/80 text-center", poppins.className)}>
          {footnote}
        </p>
      )}
    </form>
  )
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true)
  // Inisialisasi SSR stabil dengan DEFAULT_CONTACT_SETTINGS untuk mencegah Hydration Mismatch
  const [settings, setSettings] = useState<ContactSettingsData>(DEFAULT_CONTACT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [openFaqId, setOpenFaqId] = useState<string | null>(null)

  // Inisialisasi data dari Supabase/Cache & Cek Mode Pratinjau
  useEffect(() => {
    let isMounted = true

    // 1. Ambil data lokal dari cache seketika setelah client mount
    try {
      const cached = getInitialContactSettings()
      if (cached && isMounted) {
        setSettings(cached)
      }
    } catch {
      // ignore
    }

    if (typeof window !== "undefined") {
      const isPrev = window.location.search.includes("preview=true")
      if (isPrev) {
        setIsPreview(true)
        // Ambil data draft terkini dari localStorage jika ada
        try {
          const draft = localStorage.getItem(CONTACT_SETTINGS_KEY)
          if (draft && isMounted) {
            setSettings(JSON.parse(draft))
          }
        } catch { }
      }
    }

    const initData = async () => {
      const minTimer = new Promise((resolve) => setTimeout(resolve, 250))
      try {
        const remoteData = await fetchContactSettings()
        if (isMounted) {
          // Jika mode preview aktif, jangan timpa draft dari localStorage
          const isPrev = typeof window !== "undefined" && window.location.search.includes("preview=true")
          if (!isPrev) {
            setSettings(remoteData)
          }
        }
        await minTimer
      } catch (err) {
        console.warn("Gagal memuat pengaturan kontak:", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    initData()
    return () => {
      isMounted = false
    }
  }, [])

  // Event listener untuk membuka modal dari AdminFAB atau URL query
  useEffect(() => {
    const handleOpenSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user || !isUserAdmin(session.user.email)) return
      setIsSettingsOpen(true)
    }

    window.addEventListener("open-contact-settings", handleOpenSettings)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const isPrev = params.get("preview") === "true"
      if (!isPrev && (params.get("edit") === "true" || params.get("settings") === "contact")) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user && isUserAdmin(session.user.email)) {
            setIsSettingsOpen(true)
          } else {
            setIsSettingsOpen(false)
            window.history.replaceState({}, "", window.location.pathname)
          }
        })
      }
    }

    return () => {
      window.removeEventListener("open-contact-settings", handleOpenSettings)
    }
  }, [])

  // Sinkronisasi Real-Time Lintas Tab: Tab pratinjau otomatis update saat data diubah di tab modal pengaturan
  useEffect(() => {
    let bc: BroadcastChannel | null = null

    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel(CONTACT_PREVIEW_CHANNEL)
        bc.onmessage = (event) => {
          if (event.data?.type === "PREVIEW_UPDATE" && event.data?.data) {
            setSettings(event.data.data)
          }
        }
      } catch { }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONTACT_SETTINGS_KEY && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue))
        } catch { }
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      if (bc) bc.close()
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const res = await saveContactSettings(settings)
      if (res.success) {
        setIsSettingsOpen(false)
      } else {
        alert(res.error || "Gagal menyimpan perubahan.")
      }
    } catch (err: any) {
      alert("Error: " + (err?.message || "Gagal menyimpan."))
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetSettings = async () => {
    await resetContactSettings()
    setSettings(DEFAULT_CONTACT_SETTINGS)
    setIsSettingsOpen(false)
  }

  const waConsultUrl = `https://wa.me/${settings.whatsappBisnisNumber}?text=${encodeURIComponent("Halo CV. Indo Green Nature, saya ingin berkonsultasi mengenai kemitraan / maklon herbal.")}`
  const waGeneralUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Halo CV. Indo Green Nature, saya ingin bertanya mengenai produk herbal.")}`

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
          <LoadingSpinner text="Loading" />
        </div>
      )}

      <div
        suppressHydrationWarning
        className={cn(
          "w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300",
          isLoading && "invisible",
          poppins.className
        )}
      >
        {/* Banner Indikator Mode Pratinjau (preview=true) */}
        {isPreview && (
          <div className="w-full bg-[#15803D] text-white py-2 px-4 sm:px-6 text-xs font-semibold flex items-center justify-between sticky top-[60px] z-40 shadow-sm border-b border-white/20 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Mode Pratinjau Halaman Contact Aktif</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] opacity-90 hidden md:inline">
                Data pratinjau draft ditampilkan secara real-time
              </span>
              <button
                type="button"
                onClick={() => window.close()}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] transition-colors cursor-pointer font-bold"
              >
                Tutup Tab Pratinjau
              </button>
            </div>
          </div>
        )}

        <main
          suppressHydrationWarning
          className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] pb-16 flex flex-col relative z-10 gap-10 md:gap-14"
        >

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 sm:gap-2 py-2 border-b border-primary/10 text-xs md:text-sm text-zinc-700 dark:text-zinc-300">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-primary font-semibold">Contact &amp; Kemitraan</span>
          </div>

          {/* ─── 01. Hero Banner ─── */}
          <section
            id="banner-utama"
            className="relative w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 pt-2 scroll-mt-24"
          >
            <div className="flex flex-col gap-3 flex-1 items-center text-center md:items-start md:text-left">
              <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left w-full">
                <h1
                  className={cn(
                    "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-center md:text-left",
                    !settings.bannerTitleColor && "text-primary"
                  )}
                  style={{
                    fontFamily: getHeroFontFamily(settings.bannerTitleFont),
                    color: settings.bannerTitleColor || undefined,
                    fontSize: settings.bannerTitleSize
                      ? `clamp(20px, 4.5vw, ${settings.bannerTitleSize}px)`
                      : undefined,
                  }}
                >
                  {renderFormattedText(settings.bannerTitle)}
                </h1>
                <p
                  className={cn(
                    "text-xs sm:text-[13px] md:text-sm leading-relaxed max-w-2xl whitespace-pre-line text-center md:text-left mx-auto md:mx-0",
                    !settings.bannerDescColor && "text-foreground/85"
                  )}
                  style={{
                    fontFamily: getHeroFontFamily(settings.bannerDescFont),
                    color: settings.bannerDescColor || undefined,
                    fontSize: settings.bannerDescSize
                      ? `clamp(12px, 2.5vw, ${settings.bannerDescSize}px)`
                      : undefined,
                  }}
                >
                  {renderFormattedText(settings.bannerDesc)}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1 w-full md:w-auto">
                <a
                  href={waConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95 cursor-pointer",
                    poppins.className
                  )}
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>{settings.bannerBtn1Text || "WhatsApp Bisnis"}</span>
                </a>
                <a
                  href="#form-email"
                  onClick={(e) => {
                    e.preventDefault()
                    const target = document.getElementById("form-email")
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" })
                      setTimeout(() => {
                        document.getElementById("contact-name")?.focus()
                      }, 400)
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-all cursor-pointer",
                    poppins.className
                  )}
                >
                  <Mail className="w-3.5 h-3.5" />
                  {settings.bannerBtn2Text || "Kirim Pesan"}
                </a>
              </div>
            </div>

            {/* Logo Perusahaan (Rasio 1:1, Tanpa Frame / Stroke / BG) dengan Skala Gambar */}
            <div
              className="aspect-square shrink-0 flex items-center justify-center transition-all duration-200"
              style={{
                width: `min(100%, ${Math.max(120, Math.round(288 * ((settings.bannerLogoScale ?? 100) / 100)))}px)`,
                height: `min(100%, ${Math.max(120, Math.round(288 * ((settings.bannerLogoScale ?? 100) / 100)))}px)`,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={settings.bannerLogo || "/logo.png"}
                  alt="Logo CV. Indo Green Nature"
                  fill
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 288px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Garis Pembatas Putus-putus di Atas Informasi Kontak */}
          <div className="w-full flex items-center justify-center -my-2 sm:-my-3">
            <hr
              className="w-full transition-colors border-dashed border-black/20 dark:border-white/15"
              style={{ borderTopWidth: "1px", borderBottomWidth: "0px" }}
            />
          </div>

          {/* ─── 02. Kontak Langsung Grid ─── */}
          <section id="kontak-langsung" className="w-full flex flex-col gap-6 scroll-mt-24">
            <div className="flex flex-col gap-1">
              <h2 className={cn("text-lg sm:text-xl font-bold text-foreground", poppins.className)}>
                {settings.kontakSectionTitle || "Informasi Kontak Langsung"}
              </h2>
              <p className={cn("text-sm text-foreground/85", poppins.className)}>
                {settings.kontakSectionSubtitle || "Pilih metode komunikasi yang paling mudah bagi Anda."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* WhatsApp Umum */}
              <a
                href={waGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 p-5 rounded-[5px] border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <span className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider", poppins.className)}>
                  WhatsApp Umum
                </span>
                <span className={cn("text-sm sm:text-base font-bold text-primary transition-colors", poppins.className)}>
                  {settings.whatsappDisplay}
                </span>
                <span className={cn("text-xs text-foreground/80", poppins.className)}>
                  {settings.whatsappSubtitle || "Pertanyaan & Info Produk"}
                </span>
              </a>

              {/* WhatsApp Bisnis */}
              <a
                href={waConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackButtonClick({
                    buttonType: "whatsapp_contact",
                    itemName: "WhatsApp Bisnis (Kemitraan & Maklon)",
                    pagePath: "/contact",
                  })
                }}
                className="group flex flex-col gap-1.5 p-5 rounded-[5px] border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <span className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider", poppins.className)}>
                  WhatsApp Bisnis
                </span>
                <span className={cn("text-sm sm:text-base font-bold text-primary transition-colors", poppins.className)}>
                  {settings.whatsappBisnisDisplay}
                </span>
                <span className={cn("text-xs text-foreground/80", poppins.className)}>
                  {settings.whatsappBisnisSubtitle || "Kemitraan & Maklon"}
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${settings.emailBisnis}`}
                className="group flex flex-col gap-1.5 p-5 rounded-[5px] border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <span className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider", poppins.className)}>
                  Email Bisnis
                </span>
                <span className={cn("text-sm sm:text-base font-bold text-primary transition-colors break-all", poppins.className)}>
                  {settings.emailBisnis}
                </span>
                <span className={cn("text-xs text-foreground/80", poppins.className)}>
                  {settings.emailSubtitle || "Proposal & Dokumen Resmi"}
                </span>
              </a>

              {/* Lokasi */}
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 p-5 rounded-[5px] border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <span className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider", poppins.className)}>
                  Lokasi Pabrik
                </span>
                <span className={cn("text-sm sm:text-base font-bold text-primary transition-colors leading-snug", poppins.className)}>
                  {settings.lokasiKota}
                </span>
                <span className={cn("text-xs text-foreground/80", poppins.className)}>
                  {settings.lokasiProvinsi}
                </span>
              </a>
            </div>

            {/* Alamat Pabrik Full Width */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-[5px] border border-border bg-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1">
                <span className={cn("text-sm font-semibold text-primary shrink-0", poppins.className)}>
                  Alamat Pabrik
                </span>
                <span className="hidden sm:inline text-muted-foreground/40">|</span>
                <span className={cn("text-sm text-foreground/80 leading-relaxed", poppins.className)}>
                  {settings.alamatPabrik}
                </span>
              </div>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "shrink-0 inline-flex items-center px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors cursor-pointer",
                  poppins.className
                )}
              >
                Buka di Maps
              </a>
            </div>

            {/* Jam Operasional */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-[5px] bg-primary/5 border border-primary/15">
              <span className={cn("text-sm font-semibold text-primary shrink-0", poppins.className)}>
                Jam Operasional
              </span>
              <div className={cn("text-sm text-foreground/80 flex flex-wrap gap-x-4 gap-y-1", poppins.className)}>
                <span>{settings.jamOperasional}</span>
                <span className="text-muted-foreground hidden sm:inline">|</span>
                <span>{settings.jamSabtu}</span>
              </div>
            </div>
          </section>

          {/* Garis Pembatas Putus-putus di Atas Kirim Pesan Kami */}
          <div className="w-full flex items-center justify-center -my-2 sm:-my-3">
            <hr
              className="w-full transition-colors border-dashed border-black/20 dark:border-white/15"
              style={{ borderTopWidth: "1px", borderBottomWidth: "0px" }}
            />
          </div>

          {/* ─── 03 & 04. Form & Maps ─── */}
          <section id="form-email" className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-24">
            {/* Formulir Kontak */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h2 className={cn("text-lg sm:text-xl font-bold text-foreground", poppins.className)}>
                  {settings.formTitle || "Kirim Pesan ke Kami"}
                </h2>
                <p className={cn("text-sm text-foreground/85", poppins.className)}>
                  {settings.formSubtitle || "Isi formulir di bawah dan tim kami akan segera menghubungi Anda."}
                </p>
              </div>
              <div className="p-5 sm:p-6 rounded-[5px] border border-border bg-card">
                <ContactForm
                  receiverEmail={settings.formReceiverEmail}
                  footnote={settings.formFootnote}
                />
              </div>
            </div>

            {/* Alamat & Maps */}
            <div id="lokasi-maps" className="flex flex-col gap-5 scroll-mt-24">
              <div className="flex flex-col gap-1">
                <h2 className={cn("text-lg sm:text-xl font-bold text-foreground", poppins.className)}>
                  {settings.mapsTitle || "Alamat & Lokasi"}
                </h2>
                <p className={cn("text-sm text-foreground/85", poppins.className)}>
                  {settings.mapsSubtitle || "Kunjungi fasilitas produksi kami langsung di Wates, Kulon Progo."}
                </p>
              </div>

              {/* Maps Embed */}
              <div className="relative rounded-[5px] overflow-hidden border border-border shadow-sm w-full h-[360px] sm:h-[420px] lg:h-full lg:min-h-[460px] group">
                <iframe
                  title="Lokasi CV. Indo Green Nature"
                  src={settings.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-3 right-3 z-10">
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/95 hover:bg-background text-foreground text-xs font-semibold shadow-md border border-border/80 hover:text-primary transition-all",
                      poppins.className
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    Buka Google Maps
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Garis Pembatas Putus-putus di Atas Layanan Kemitraan */}
          <div className="w-full flex items-center justify-center -my-2 sm:-my-3">
            <hr
              className="w-full transition-colors border-dashed border-black/20 dark:border-white/15"
              style={{ borderTopWidth: "1px", borderBottomWidth: "0px" }}
            />
          </div>

          {/* ─── 05. Layanan Kemitraan & Maklon CTA ─── */}
          <section id="layanan-kemitraan" className="w-full flex flex-col gap-6 scroll-mt-24">
            <div className="flex flex-col gap-1">
              <h2 className={cn("text-lg sm:text-xl font-bold text-foreground", poppins.className)}>
                {settings.layananSectionTitle || "Layanan Kemitraan & Maklon"}
              </h2>
              <p className={cn("text-sm text-foreground/85", poppins.className)}>
                {settings.layananSectionSubtitle || "Kami menyediakan solusi terpadu untuk kebutuhan kemitraan bisnis dan produksi maklon herbal Anda."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {settings.serviceCards.map((card, idx) => {
                const waTargetUrl = `https://wa.me/${settings.whatsappBisnisNumber}?text=${encodeURIComponent(card.waText || "Halo, saya tertarik dengan layanan CV. Indo Green Nature.")}`

                return (
                  <div
                    key={card.id || idx}
                    className="group flex flex-col gap-4 p-6 rounded-[5px] border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    {card.iconType === "handshake" ? (
                      <Handshake className="w-7 h-7 text-primary group-hover:scale-105 transition-transform" />
                    ) : card.iconType === "package" ? (
                      <Package className="w-7 h-7 text-primary group-hover:scale-105 transition-transform" />
                    ) : (
                      <Leaf className="w-7 h-7 text-primary group-hover:scale-105 transition-transform" />
                    )}

                    <div className="flex flex-col gap-2">
                      <h3 className={cn("font-bold text-base text-foreground", poppins.className)}>
                        {card.title}
                      </h3>
                      <p className={cn("text-sm text-foreground/85 leading-relaxed", poppins.className)}>
                        {card.desc}
                      </p>
                      <ul className={cn("flex flex-col gap-1.5 mt-1", poppins.className)}>
                        {card.points.map((point) => (
                          <li key={point} className="flex items-center gap-2 text-xs text-foreground/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={waTargetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackButtonClick({
                          buttonType: "whatsapp_contact",
                          itemName: `Layanan: ${card.title || card.btnText || "Konsultasi"}`,
                          pagePath: "/contact",
                        })
                      }}
                      className={cn(
                        "mt-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95 cursor-pointer",
                        poppins.className
                      )}
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                      <span>{card.btnText || "Konsultasi"}</span>
                    </a>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Garis Pembatas Putus-putus di Atas Pertanyaan yang Sering Diajukan (FAQ) */}
          <div className="w-full flex items-center justify-center -my-2 sm:-my-3">
            <hr
              className="w-full transition-colors border-dashed border-black/20 dark:border-white/15"
              style={{ borderTopWidth: "1px", borderBottomWidth: "0px" }}
            />
          </div>

          {/* ─── 06. FAQ ─── */}
          <section id="faq-section" className="w-full flex flex-col items-center gap-8 sm:gap-10 scroll-mt-24">
            {/* Header FAQ Center */}
            <div className="w-full flex flex-col items-center text-center max-w-3xl mx-auto px-2 sm:px-4">
              <h2 className={cn("w-full text-center tracking-tight leading-tight text-xl sm:text-2xl md:text-3xl font-bold text-foreground", poppins.className)}>
                {settings.faqTitle || "Pertanyaan yang Sering Diajukan"}
              </h2>
              <p className={cn("mt-2.5 sm:mt-3 max-w-[720px] w-full leading-relaxed text-foreground/85 text-xs sm:text-sm md:text-base text-center", poppins.className)}>
                {settings.faqSubtitle || "Temukan jawaban cepat untuk pertanyaan umum seputar layanan kami."}
              </p>
            </div>

            {/* Daftar Accordion FAQ - Lebar penuh (full) & Center */}
            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-3 sm:gap-4 px-0">
              {settings.faqItems.map((item, idx) => {
                const isOpen = openFaqId === item.id
                return (
                  <FaqItem
                    key={item.id || idx}
                    item={item}
                    isOpen={isOpen}
                    onToggle={() => setOpenFaqId(isOpen ? null : item.id)}
                  />
                )
              })}
            </div>

            {/* Box Bantuan Tanya Langsung - Center */}
            <div className="w-full max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-[5px] bg-primary/5 border border-primary/15 text-center sm:text-left">
              <div className="flex flex-col gap-0.5 flex-1 text-center sm:text-left">
                <span className={cn("text-sm sm:text-base font-semibold text-foreground", poppins.className)}>
                  {settings.faqCtaTitle || "Tidak menemukan jawaban yang Anda cari?"}
                </span>
                <span className={cn("text-xs sm:text-sm text-foreground/80", poppins.className)}>
                  {settings.faqCtaSubtitle || "Tim kami siap menjawab pertanyaan Anda secara langsung."}
                </span>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappBisnisNumber}?text=${encodeURIComponent(settings.faqCtaWaText || "Halo CV. Indo Green Nature, saya memiliki pertanyaan seputar produk & kemitraan.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackButtonClick({
                    buttonType: "whatsapp_contact",
                    itemName: "FAQ Tanya Langsung",
                    pagePath: "/contact",
                  })
                }}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95 cursor-pointer shadow-xs",
                  poppins.className
                )}
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>{settings.faqCtaBtnText || "Tanya Langsung"}</span>
              </a>
            </div>
          </section>

        </main>

        {/* ─── Popup Modal Pengaturan Contact (Model Clone About Us) ─── */}
        <ContactSettingsSidebar
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          data={settings}
          onChange={setSettings}
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
          isSaving={isSaving}
        />
      </div>
    </>
  )
}

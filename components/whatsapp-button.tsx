"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Send,
  CheckCheck,
  Leaf,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import {
  WhatsAppButtonSettings,
  DEFAULT_WHATSAPP_SETTINGS,
  WHATSAPP_SETTINGS_KEY,
  WHATSAPP_SETTINGS_CHANNEL,
  getInitialWhatsAppSettings,
  fetchWhatsAppSettings,
  normalizeWhatsAppNumber,
} from "@/lib/whatsapp-settings"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  time: string
}

const DEFAULT_WELCOME_MESSAGE = `Halo, selamat datang di **Indo Green Nature**.
Ada yang bisa saya bantu?`

export function WhatsAppButton() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<WhatsAppButtonSettings>(DEFAULT_WHATSAPP_SETTINGS)
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-cs-welcome",
      role: "assistant",
      content: DEFAULT_WELCOME_MESSAGE,
      time: "Baru saja",
    },
  ])

  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, isOpen])

  // Inisialisasi pengaturan WhatsApp dari cache & remote
  useEffect(() => {
    let isMounted = true

    try {
      const cached = getInitialWhatsAppSettings()
      if (cached && isMounted) {
        setSettings(cached)
      }
    } catch { }

    const initData = async () => {
      try {
        const remote = await fetchWhatsAppSettings()
        if (isMounted) {
          setSettings(remote)
        }
      } catch (e) {
        console.warn("Gagal fetch WhatsApp settings:", e)
      }
    }
    initData()

    return () => {
      isMounted = false
    }
  }, [])

  // Sinkronisasi Real-Time (BroadcastChannel & storage)
  useEffect(() => {
    let bc: BroadcastChannel | null = null

    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel(WHATSAPP_SETTINGS_CHANNEL)
        bc.onmessage = (event) => {
          if (event.data?.type === "UPDATE_WHATSAPP_SETTINGS" && event.data?.data) {
            setSettings(event.data.data)
          }
        }
      } catch { }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === WHATSAPP_SETTINGS_KEY && e.newValue) {
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

  // Close chat saat klik di luar area widget
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  // Nomor tujuan WhatsApp aktif dinormalisasi
  const getActivePhone = (): string => {
    return normalizeWhatsAppNumber(settings.phoneMaklon || settings.phoneDefault || "6285877669199")
  }

  // Redirect ke WhatsApp CS dengan konteks pesan
  const handleOpenRealWhatsApp = (contextText?: string) => {
    const targetPhone = getActivePhone()
    const summary = contextText || messages.filter((m) => m.role === "user").slice(-1)[0]?.content || "Halo CV. Indo Green Nature, saya ingin konsultasi maklon herbal."
    const prefillText = `Halo Tim CV. Indo Green Nature, saya ingin konsultasi lebih lanjut:\n\n"${summary}"`
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(prefillText)}`
    window.open(waUrl, "_blank", "noopener,noreferrer")
  }

  // Kirim pesan ke API AI
  const handleSendMessage = async (userPromptText?: string) => {
    const query = (userPromptText || inputMessage).trim()
    if (!query || isLoading) return

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    const newUserMsg: Message = {
      id: "usr-" + Date.now(),
      role: "user",
      content: query,
      time: timeStr,
    }

    const updatedMessages = [...messages, newUserMsg]
    setMessages(updatedMessages)
    setInputMessage("")
    setIsLoading(true)

    try {
      const payloadMessages = updatedMessages
        .filter((m) => m.id !== "initial-cs-welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))

      if (payloadMessages.length === 0) {
        payloadMessages.push({ role: "user", content: query })
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "chat",
          messages: payloadMessages,
        }),
      })

      const data = await res.json()

      if (data.success && data.result) {
        setMessages((prev) => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            role: "assistant",
            content: data.result,
            time: `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: "err-" + Date.now(),
            role: "assistant",
            content: "Mohon maaf, saat ini sistem kami sedang ramai. Anda dapat langsung terhubung dengan tim kami via WhatsApp.",
            time: timeStr,
          },
        ])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: "Koneksi sedang sibuk. Silakan hubungi kami langsung via WhatsApp di bawah.",
          time: timeStr,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const isHomePage = pathname === "/" || pathname === "/home"
  const isAllowedDesktopPage =
    pathname.startsWith("/our-products") ||
    pathname.startsWith("/our-product") ||
    pathname.startsWith("/insight") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/legality") ||
    pathname.startsWith("/legalitas") ||
    pathname.startsWith("/contact")

  if ((!isHomePage && !isAllowedDesktopPage) || !settings.isEnabled) {
    return null
  }

  const isLeft = settings.position === "left"
  // Home: terlihat di mobile & desktop. Halaman produk, insight, about, legality, contact: HANYA di desktop (hidden md:flex).
  const visibilityClass = isHomePage ? "flex" : "hidden md:flex"

  return (
    <div
      ref={chatRef}
      className={`fixed bottom-20 ${isLeft ? "left-3 sm:left-4 md:left-10 items-start" : "right-3 sm:right-4 md:right-10 items-end"} md:bottom-10 z-[90] ${visibilityClass} flex-col font-sans select-none`}
    >
      {/* Floating Chat Box Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: isLeft ? "bottom left" : "bottom right",
            }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[410px] h-[560px] max-h-[85vh] bg-[#0c1317] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col will-change-transform"
          >
            {/* Header WhatsApp Resmi */}
            <div className="bg-[#008069] p-3.5 text-white flex items-center justify-between shadow-md shrink-0 border-b border-[#006e5a]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center overflow-hidden border border-white/80 shadow-sm">
                    <img
                      src="/logo.png"
                      alt="CV. Indo Green Nature"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        ; (e.target as HTMLElement).style.display = "none"
                      }}
                    />
                    <Leaf className="w-5 h-5 text-[#15803D] hidden" />
                  </div>
                  {/* Status indicator dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#099273] rounded-full"></span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm tracking-wide text-white truncate">
                    INDO GREEN NATURE SUPPORT
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-medium flex items-center gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggle}
                className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 hover:text-white flex items-center justify-center transition-colors border border-white/10 shrink-0"
                aria-label="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              className="p-3.5 flex-1 overflow-y-auto space-y-3.5 text-sm bg-[#0b141a] [scrollbar-width:thin] [scrollbar-color:#1e2a30_transparent]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(37, 211, 102, 0.03) 0%, transparent 80%)",
              }}
            >
              {/* Date Badge */}
              <div className="text-center my-0.5">
                <span className="text-[10px] bg-[#182229] text-gray-400 px-2.5 py-0.5 rounded-md border border-white/5 font-mono">
                  Hari ini
                </span>
              </div>

              {/* Message List */}
              {messages.map((msg) => {
                const isUser = msg.role === "user"

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-2xl shadow-md text-[12.5px] leading-relaxed ${isUser
                          ? "bg-[#005c4b] text-white rounded-tr-sm border border-emerald-400/20"
                          : "bg-[#202c33] text-gray-100 rounded-tl-sm border border-white/10"
                        }`}
                    >
                      {!isUser && (
                        <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-white/10 text-emerald-400 font-semibold text-[11px]">
                          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                          <span>INDO GREEN NATURE SUPPORT</span>
                        </div>
                      )}

                      <div className="prose prose-invert prose-xs max-w-none break-words text-gray-100 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ul]:pl-4 [&_li]:my-0.5 [&_strong]:text-emerald-400 [&_strong]:font-semibold">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            a: ({ href, children }) => {
                              const isMap =
                                href?.includes("maps.google") ||
                                href?.includes("google.com/maps") ||
                                href?.includes("maps.app.goo.gl")
                              const isWa =
                                href?.includes("wa.me") ||
                                href?.includes("whatsapp.com")

                              const isShopee =
                                href?.includes("shopee.co.id") ||
                                href?.includes("shopee.com")
                              const isTokopedia =
                                href?.includes("tokopedia.com")
                              const isLazada =
                                href?.includes("lazada.co.id") ||
                                href?.includes("lazada.com")
                              const isTikTok =
                                href?.includes("tiktok.com")

                              if (isMap) {
                                const cleanLabel =
                                  typeof children === "string"
                                    ? children.replace(/📍/g, "").trim()
                                    : children

                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="not-prose inline-flex items-center justify-center px-3 py-1.5 my-1.5 text-[11.5px] font-semibold rounded-xl bg-[#008069] hover:bg-[#006e5a] text-white transition-all shadow-xs active:scale-95 no-underline cursor-pointer"
                                  >
                                    <span>{cleanLabel || "Buka Lokasi di Google Maps"}</span>
                                  </a>
                                )
                              }

                              if (isWa) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="not-prose inline-flex items-center gap-1.5 px-3 py-1.5 my-1.5 text-[11.5px] font-semibold rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 transition-all shadow-xs active:scale-95 no-underline group cursor-pointer"
                                  >
                                    <Phone className="size-3.5 group-hover:scale-110 transition-transform" />
                                    <span>{children || "Chat WhatsApp"}</span>
                                  </a>
                                )
                              }

                              if (isShopee) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="not-prose inline-flex items-center gap-1.5 px-3 py-1.5 my-1.5 text-[11.5px] font-semibold rounded-xl bg-[#EE4D2D] hover:bg-[#d73211] text-white transition-all shadow-xs active:scale-95 no-underline cursor-pointer"
                                  >
                                    <ShoppingBag className="size-3.5" />
                                    <span>{children || "Buka Shopee Official"}</span>
                                  </a>
                                )
                              }

                              if (isTokopedia) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="not-prose inline-flex items-center gap-1.5 px-3 py-1.5 my-1.5 text-[11.5px] font-semibold rounded-xl bg-[#03AC0E] hover:bg-[#028a0b] text-white transition-all shadow-xs active:scale-95 no-underline cursor-pointer"
                                  >
                                    <ShoppingBag className="size-3.5" />
                                    <span>{children || "Buka Tokopedia Official"}</span>
                                  </a>
                                )
                              }

                              if (isLazada) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="not-prose inline-flex items-center gap-1.5 px-3 py-1.5 my-1.5 text-[11.5px] font-semibold rounded-xl bg-[#0F146D] hover:bg-[#0a0d4a] text-white transition-all shadow-xs active:scale-95 no-underline cursor-pointer"
                                  >
                                    <ShoppingBag className="size-3.5" />
                                    <span>{children || "Buka Lazada Official"}</span>
                                  </a>
                                )
                              }

                              if (isTikTok) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="not-prose inline-flex items-center gap-1.5 px-3 py-1.5 my-1.5 text-[11.5px] font-semibold rounded-xl bg-black hover:bg-neutral-900 text-white border border-rose-500/40 transition-all shadow-xs active:scale-95 no-underline cursor-pointer"
                                  >
                                    <ShoppingBag className="size-3.5 text-rose-400" />
                                    <span>{children || "Buka TikTok Shop"}</span>
                                  </a>
                                )
                              }

                              const isInternal = href?.startsWith("/") || href?.startsWith("#")

                              return (
                                <a
                                  href={href}
                                  target={isInternal ? "_self" : "_blank"}
                                  rel={isInternal ? undefined : "noopener noreferrer"}
                                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer inline"
                                >
                                  {children}
                                </a>
                              )
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 pt-1.5 mt-1 border-t border-white/5">
                        <span>{msg.time}</span>
                        {isUser ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-[#202c33] text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-tl-sm border border-white/10 shadow-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.3s]"></span>
                    <span className="text-xs text-gray-400 ml-1">Sedang mengetik...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bridge to WhatsApp Banner */}
            <div className="px-3.5 py-2 bg-[#141d24] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 shrink-0">
              <span>Butuh konsultasi lebih lanjut?</span>
              <button
                onClick={() => handleOpenRealWhatsApp()}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Hubungi kami via WhatsApp</span>
              </button>
            </div>

            {/* Chat Footer / Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="p-3 bg-[#182229] border-t border-white/10 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ketik pesan konsultasi Anda..."
                disabled={isLoading}
                className="flex-1 bg-[#0b141a] text-white placeholder-gray-500 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-[#00a884] focus:outline-none transition-colors leading-relaxed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-[#00a884] to-[#128c7e] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 shrink-0 h-10 w-10 cursor-pointer"
                aria-label="Kirim Pesan"
                title="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Trigger Button (Right Side Floating) */}
      <div className="relative flex items-center group">
        {/* Tooltip on Desktop hover */}
        {!isOpen && (
          <div className={`hidden md:flex absolute ${isLeft ? "left-16" : "right-16"} items-center px-3 py-1.5 rounded-xl bg-zinc-900/90 text-white text-xs font-medium shadow-xl border border-white/10 backdrop-blur-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none gap-2`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Chat WhatsApp CV. Indo Green Nature</span>
          </div>
        )}

        <button
          onClick={handleToggle}
          aria-label="Chat WhatsApp CV. Indo Green Nature"
          className="relative p-2.5 sm:p-3.5 md:p-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_3px_14px_rgba(37,211,102,0.4)] md:shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center border border-emerald-300/30 cursor-pointer"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-75 blur-sm transition-opacity duration-300 animate-pulse pointer-events-none"></span>

          {/* Outer ping animation when button is closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>
          )}

          {/* Icon toggle */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              key={isOpen ? "open-x" : "closed-wa"}
              initial={{ rotate: -40, opacity: 0, scale: 0.85 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              {isOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[2.5]" />
              ) : (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-current drop-shadow-sm"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              )}
            </motion.div>
          </div>

          {/* Unread badge dot (Merah Notifikasi WhatsApp) */}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 md:h-4 md:w-4 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3.5 md:w-3.5 bg-red-500 border-[1.5px] md:border-2 border-[#121b22] shadow-sm"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

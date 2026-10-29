"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    FileChartColumnIcon,
    Settings2Icon,
    X,
    Settings,
    Megaphone,
    Monitor,
    SlidersHorizontal,
    PhoneCall,
    ShieldCheck,
    PackageCheck,
    BookOpen,
    Globe,
    Sparkles,
    Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SeoSettingsModal } from "@/components/seo-settings-modal"
import { AiSettingsModal } from "@/components/ai-settings-modal"

const adminMenus = [
    {
        name: "Pengaturan AI Gateway",
        url: "#",
        icon: Bot,
    },
    {
        name: "AI Asisten Indo Green Nature",
        url: "/ai-assistant",
        icon: Sparkles,
    },
    {
        name: "Pengaturan SEO",
        url: "#",
        icon: Globe,
    },
    {
        name: "Pengaturan Insight",
        url: "/insight?edit=true",
        icon: BookOpen,
    },
    {
        name: "Pengaturan Our Products",
        url: "/our-products?edit=true",
        icon: PackageCheck,
    },
    {
        name: "Pengaturan Contact",
        url: "/contact?edit=true",
        icon: PhoneCall,
    },
    {
        name: "Pengaturan Legality",
        url: "/legality?edit=true",
        icon: ShieldCheck,
    },
    {
        name: "Pengaturan About Us",
        url: "/about?edit=true",
        icon: SlidersHorizontal,
    },
    {
        name: "Susunan Home",
        url: "/settings/home-layout",
        icon: Monitor,
    },
    {
        name: "Analytics",
        url: "/analytics",
        icon: FileChartColumnIcon,
    },
    {
        name: "Broadcast",
        url: "/broadcast",
        icon: Megaphone,
    },
    {
        name: "Manajemen",
        url: "/settings",
        icon: Settings2Icon,
    },
]

export function AdminFAB() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSeoOpen, setIsSeoOpen] = useState(false)
    const [isAiOpen, setIsAiOpen] = useState(false)
    const pathname = usePathname()
    const fabRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleOpenSeo = () => setIsSeoOpen(true)
        const handleOpenAi = () => setIsAiOpen(true)
        window.addEventListener("open-seo-settings", handleOpenSeo)
        window.addEventListener("open-ai-settings", handleOpenAi)

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("open-seo-settings", handleOpenSeo)
            window.removeEventListener("open-ai-settings", handleOpenAi)
        }
    }, [isOpen])

    return (
        <div ref={fabRef} className="fixed bottom-20 left-4 md:bottom-8 md:left-8 z-[100] flex flex-col items-center">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-1.5 mb-2 max-h-[calc(100vh-130px)] overflow-y-auto overflow-x-hidden p-1 scrollbar-none"
                    >
                        {adminMenus.map((menu) => {
                            const Icon = menu.icon
                            const isInsightSettings = menu.name === "Pengaturan Insight"
                            const isAboutSettings = menu.name === "Pengaturan About Us"
                            const isContactSettings = menu.name === "Pengaturan Contact"
                            const isLegalitySettings = menu.name === "Pengaturan Legality"
                            const isProductsSettings = menu.name === "Pengaturan Our Products"
                            const isSpecialActive =
                                (isInsightSettings && (pathname === "/insight" || pathname.startsWith("/insight"))) ||
                                (isAboutSettings && pathname === "/about") ||
                                (isLegalitySettings && pathname === "/legality") ||
                                (isContactSettings && pathname === "/contact") ||
                                (isProductsSettings && (pathname === "/our-products" || pathname === "/our-product"))
                            const isActive = isSpecialActive ? true : pathname === menu.url

                            const isMobileAllowed = menu.name === "Analytics" || menu.name === "Broadcast"

                            return (
                                <Link
                                    href={menu.url}
                                    key={menu.name}
                                    onClick={(e) => {
                                        if (menu.name === "Pengaturan AI Gateway") {
                                            e.preventDefault()
                                            setIsAiOpen(true)
                                            setIsOpen(false)
                                            return
                                        }
                                        if (menu.name === "Pengaturan SEO") {
                                            e.preventDefault()
                                            setIsSeoOpen(true)
                                            setIsOpen(false)
                                            return
                                        }
                                        if (isInsightSettings && (pathname === "/insight" || pathname.startsWith("/insight"))) {
                                            e.preventDefault()
                                            window.dispatchEvent(new CustomEvent("open-insight-settings"))
                                        } else if (isAboutSettings && pathname === "/about") {
                                            e.preventDefault()
                                            window.dispatchEvent(new CustomEvent("open-about-settings"))
                                        } else if (isLegalitySettings && pathname === "/legality") {
                                            e.preventDefault()
                                            window.dispatchEvent(new CustomEvent("open-legality-settings"))
                                        } else if (isContactSettings && pathname === "/contact") {
                                            e.preventDefault()
                                            window.dispatchEvent(new CustomEvent("open-contact-settings"))
                                        } else if (isProductsSettings && (pathname === "/our-products" || pathname === "/our-product")) {
                                            e.preventDefault()
                                            window.dispatchEvent(new CustomEvent("open-our-products-settings"))
                                        }
                                        setIsOpen(false)
                                    }}
                                    title={menu.name}
                                    className={cn(
                                        "group/item relative flex items-center",
                                        !isMobileAllowed && "hidden md:flex"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "h-9 w-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110",
                                            isSpecialActive
                                                ? "bg-[#D97706] text-white shadow-sm shadow-amber-600/30 ring-2 ring-white/60"
                                                : isActive
                                                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                                                    : "bg-primary-soft/80 dark:bg-background/80 text-primary hover:bg-primary-soft dark:hover:bg-background"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    {/* Tooltip teks di sebelah kanan */}
                                    <span className="hidden md:block absolute left-11 px-2.5 py-1 rounded-md bg-zinc-900/90 dark:bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none shadow-md font-medium z-20">
                                        {menu.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Tutup Menu Pengaturan Admin" : "Buka Menu Pengaturan Admin"}
                className="w-11 h-11 bg-primary-soft dark:bg-background text-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex items-center justify-center"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                </motion.div>
                <span className="sr-only">{isOpen ? "Tutup Menu Pengaturan Admin" : "Buka Menu Pengaturan Admin"}</span>
            </button>

            {/* Modal Pengaturan SEO */}
            <SeoSettingsModal isOpen={isSeoOpen} onClose={() => setIsSeoOpen(false)} />

            {/* Modal Pengaturan AI Gateway */}
            <AiSettingsModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </div>
    )
}

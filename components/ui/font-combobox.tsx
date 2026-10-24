"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { HERO_FONTS, HeroFontOption } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export interface FontComboboxProps {
  value: string
  onChange: (val: string) => void
  className?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  showSpecimen?: boolean
  previewText?: string
}

export function FontCombobox({
  value,
  onChange,
  className,
  placeholder = "Pilih gaya font...",
  id,
  disabled = false,
  showSpecimen = true,
  previewText = "Aa Bb 123",
}: FontComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [mounted, setMounted] = React.useState(false)
  const [coords, setCoords] = React.useState<{
    top: number
    left: number
    width: number
    openUpward: boolean
  }>({
    top: 0,
    left: 0,
    width: 260,
    openUpward: false,
  })

  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Cari font terpilih
  const selectedFont = React.useMemo(() => {
    const found = HERO_FONTS.find((f) => f.id === value)
    return found || HERO_FONTS[0]
  }, [value])

  // Filter font berdasarkan pencarian
  const filteredFonts = React.useMemo(() => {
    if (!search.trim()) return HERO_FONTS
    const q = search.toLowerCase().trim()
    return HERO_FONTS.filter((font) =>
      font.name.toLowerCase().includes(q)
    )
  }, [search])

  // Hitung posisi dropdown relatif terhadap trigger
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    // Tutup jika trigger tergulung keluar dari layar
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setIsOpen(false)
      return
    }
    const dropdownHeight = 310
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

    const calculatedWidth = Math.max(rect.width, 270)
    let left = rect.left
    if (left + calculatedWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - calculatedWidth - 8)
    }

    setCoords({
      top: openUpward ? rect.top - 4 : rect.bottom + 4,
      left,
      width: calculatedWidth,
      openUpward,
    })
  }, [])

  // Buka / tutup dropdown
  const handleToggle = React.useCallback(() => {
    if (disabled) return
    if (!isOpen) {
      updatePosition()
      setIsOpen(true)
      setSearch("")
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setIsOpen(false)
    }
  }, [disabled, isOpen, updatePosition])

  // Tutup jika klik di luar atau resize/scroll
  React.useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setIsOpen(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    const handleWindowChange = () => {
      updatePosition()
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("touchstart", handleOutsideClick)
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", handleWindowChange)
    window.addEventListener("scroll", handleWindowChange, true)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", handleWindowChange)
      window.removeEventListener("scroll", handleWindowChange, true)
    }
  }, [isOpen, updatePosition])

  const handleSelect = (fontId: string) => {
    onChange(fontId)
    setIsOpen(false)
    setSearch("")
    triggerRef.current?.focus()
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "w-full h-9 pl-3 pr-2.5 py-1.5 rounded-[5px] text-xs bg-background border border-border text-foreground font-medium",
          "flex items-center justify-between gap-2 text-left cursor-pointer transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-[#15803D] hover:border-[#15803D]/60 shadow-2xs",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-[#15803D] ring-2 ring-[#15803D]/20"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          {/* Tampilan nama font terpilih langsung dengan gaya bentuk font aslinya */}
          <span
            className={cn(
              selectedFont.className,
              "text-[13px] font-semibold text-foreground truncate"
            )}
            style={{ fontFamily: selectedFont.fontFamily }}
          >
            {selectedFont.name}
          </span>

          {/* Contoh preview bentuk font ringkas */}
          {showSpecimen && (
            <span
              className={cn(
                selectedFont.className,
                "text-[11px] text-muted-foreground/60 hidden sm:inline-block shrink-0 select-none"
              )}
              style={{ fontFamily: selectedFont.fontFamily }}
            >
              {previewText}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground/80 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-[#15803D]"
          )}
        />
      </button>

      {/* Dropdown Menu via Portal ke document.body agar tidak terpotong overflow container modal */}
      {mounted &&
        isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: "fixed",
              top: coords.openUpward ? undefined : coords.top,
              bottom: coords.openUpward
                ? window.innerHeight - coords.top
                : undefined,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
            className={cn(
              "bg-popover text-popover-foreground border border-border rounded-[5px] shadow-2xl overflow-hidden",
              "flex flex-col animate-in fade-in-0 zoom-in-95 duration-150"
            )}
          >
            {/* Input Pencarian Font */}
            <div className="p-2 border-b border-border bg-muted/30 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari gaya font..."
                className="w-full text-xs bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/70"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    searchInputRef.current?.focus()
                  }}
                  className="text-muted-foreground hover:text-foreground p-0.5 rounded"
                  title="Hapus pencarian"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Daftar Font dengan Preview Bentuk Font Asli Tanpa Tanda Kurung */}
            <div className="max-h-[260px] overflow-y-auto p-1 divide-y divide-border/20">
              {filteredFonts.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  Font "{search}" tidak ditemukan.
                </div>
              ) : (
                filteredFonts.map((font) => {
                  const isSelected = font.id === value
                  return (
                    <button
                      key={font.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(font.id)}
                      className={cn(
                        "w-full px-3 py-2 text-left flex items-center justify-between rounded-[4px] transition-colors cursor-pointer group",
                        isSelected
                          ? "bg-[#15803D]/10 text-[#15803D] font-semibold"
                          : "hover:bg-accent text-foreground hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-baseline gap-3 min-w-0 flex-1">
                        {/* Bentuk Font Ditampilkan Secara Nyata & Murni Tanpa Tanda Kurung */}
                        <span
                          className={cn(
                            font.className,
                            "text-[14.5px] leading-snug tracking-wide text-foreground transition-colors",
                            isSelected && "text-[#15803D] font-semibold",
                            "group-hover:text-[#15803D]"
                          )}
                          style={{ fontFamily: font.fontFamily }}
                        >
                          {font.name}
                        </span>

                        {/* Sampel Teks Preview dalam bentuk font asli */}
                        {showSpecimen && (
                          <span
                            className={cn(
                              font.className,
                              "text-[11.5px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors hidden sm:inline-block shrink-0 select-none"
                            )}
                            style={{ fontFamily: font.fontFamily }}
                          >
                            {previewText}
                          </span>
                        )}
                      </div>

                      {/* Icon Checkmark jika font aktif terpilih */}
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#15803D] shrink-0 ml-2" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

// Alias untuk kemudahan import dan kompatibilitas
export const FontSelect = FontCombobox

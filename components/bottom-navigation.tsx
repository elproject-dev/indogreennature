"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Info,
  PhoneCall,
  ShieldCheck,
  PackageCheck,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

const defaultMainLinks = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/our-products", label: "Products", icon: PackageCheck },
  { href: "/insight", label: "Insight", icon: BookOpen },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/legality", label: "Legality", icon: ShieldCheck },
  { href: "/contact", label: "Contact", icon: PhoneCall },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)] rounded-t-2xl">
        {/* Main bottom bar */}
        <div className="grid grid-cols-6 max-w-lg mx-auto py-2 px-1 relative z-10 bg-background rounded-t-2xl">
          {defaultMainLinks.map((link) => {
            const Icon = link.icon
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname === "/home"
                : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center w-14 sm:w-16 mx-auto py-1 rounded-xl transition-all duration-200 relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 mb-1",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[9px] font-medium text-center leading-tight",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

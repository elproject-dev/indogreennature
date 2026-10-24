"use client"

import { useEffect, useState } from "react"

import { BottomNavigation } from "@/components/bottom-navigation"
import { TopBar } from "@/components/top-bar"
import { AdminFAB } from "@/components/admin-fab"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { isUserAdmin } from "@/lib/auth-admin"


const ADMIN_ROUTES = ["/analytics", "/broadcast", "/settings", "/linked"]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)
    const isTryingToAccessAdminRoute = Boolean(pathname && ADMIN_ROUTES.some(route => pathname.startsWith(route)))
    const [isCheckingRole, setIsCheckingRole] = useState(isTryingToAccessAdminRoute)

    useEffect(() => {
        // Cek apakah ada error di URL (seperti saat user membatalkan login)
        if (typeof window !== "undefined" && (window.location.hash.includes("error=access_denied") || window.location.search.includes("error=access_denied"))) {
            toast.add({ title: "Akses Ditolak", description: "Anda membatalkan proses login.", type: "error" })
            router.replace("/")
            return
        }

        const isAccessingAdmin = Boolean(pathname && ADMIN_ROUTES.some(route => pathname.startsWith(route)))
        if (!isAccessingAdmin) {
            setIsCheckingRole(false)
        } else {
            setIsCheckingRole(true)
        }

        // Cek sesi yang ada untuk menentukan hak akses
        const checkAuthAndRole = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const userIsAdmin = isUserAdmin(session?.user?.email)
            setIsAdmin(userIsAdmin)

            if (isAccessingAdmin && !userIsAdmin) {
                toast.add({ title: "Akses Ditolak", description: "Halaman ini khusus untuk Admin.", type: "error" })
                router.replace("/")
            } else {
                setIsCheckingRole(false)
            }
        }

        checkAuthAndRole()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session?.user) {
                setIsAdmin(false)
            } else {
                setIsAdmin(isUserAdmin(session.user.email))
            }
        })

        return () => subscription.unsubscribe()
    }, [router, pathname])

    if (isCheckingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <LoadingSpinner text="Loading" />
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col min-h-screen w-full bg-card-alt dark:bg-background transition-colors">
                <div className="w-full h-[60px] shrink-0 z-50 sticky top-0 relative">
                    <TopBar />
                </div>
                <div className="flex flex-1 flex-col pb-16 lg:pb-0">
                    {children}
                </div>
                <BottomNavigation />
                {(isAdmin || pathname === "/" || pathname === "/about" || pathname === "/legality" || pathname === "/contact" || pathname?.startsWith("/our-product") || pathname?.startsWith("/insight")) && <AdminFAB />}
                {!pathname?.startsWith("/settings") && <WhatsAppButton />}
            </div>
        </>
    )
}

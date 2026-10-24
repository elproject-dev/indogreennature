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
import { processAuthTokensFromUrl } from "@/lib/auth-callback"


const ADMIN_ROUTES = ["/analytics", "/broadcast", "/settings", "/linked"]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)
    const isTryingToAccessAdminRoute = Boolean(pathname && ADMIN_ROUTES.some(route => pathname.startsWith(route)))
    const [isCheckingRole, setIsCheckingRole] = useState(isTryingToAccessAdminRoute)

    useEffect(() => {
        let mounted = true

        const isAccessingAdmin = Boolean(pathname && ADMIN_ROUTES.some(route => pathname.startsWith(route)))
        if (!isAccessingAdmin) {
            setIsCheckingRole(false)
        } else {
            setIsCheckingRole(true)
        }

        const initAuthAndRole = async () => {
            // Cek dan proses jika terdapat token OAuth di URL (misal redirect callback dengan hash #access_token=...)
            if (typeof window !== "undefined" && (window.location.hash.includes("access_token=") || window.location.search.includes("code="))) {
                const result = await processAuthTokensFromUrl()
                if (!mounted) return

                if (result.success && result.user) {
                    const userIsAdmin = isUserAdmin(result.user.email)
                    setIsAdmin(userIsAdmin)
                    setIsCheckingRole(false)
                    toast.add({
                        title: "Login Berhasil",
                        description: `Selamat datang, ${result.user.user_metadata?.full_name || result.user.email}${userIsAdmin ? " (Admin)" : ""}`,
                        type: "success"
                    })
                    return
                } else if (result.error) {
                    toast.add({ title: "Gagal Login", description: result.error, type: "error" })
                }
            } else if (typeof window !== "undefined" && (window.location.hash.includes("error=") || window.location.search.includes("error="))) {
                const result = await processAuthTokensFromUrl()
                if (result.error) {
                    toast.add({ title: "Akses Ditolak", description: result.error, type: "error" })
                }
            }

            // Cek sesi yang ada untuk menentukan hak akses
            const { data: { session } } = await supabase.auth.getSession()
            if (!mounted) return

            const userIsAdmin = isUserAdmin(session?.user?.email)
            setIsAdmin(userIsAdmin)

            if (isAccessingAdmin && !userIsAdmin) {
                toast.add({ title: "Akses Ditolak", description: "Halaman ini khusus untuk Admin.", type: "error" })
                router.replace("/")
            } else {
                setIsCheckingRole(false)
            }
        }

        initAuthAndRole()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!mounted) return
            if (!session?.user) {
                setIsAdmin(false)
            } else {
                setIsAdmin(isUserAdmin(session.user.email))
            }
        })

        const handleAuthChanged = (e: any) => {
            if (!mounted) return
            const user = e.detail?.rawUser
            if (user?.email) {
                setIsAdmin(isUserAdmin(user.email))
            }
        }
        window.addEventListener("auth-state-changed", handleAuthChanged as EventListener)

        return () => {
            mounted = false
            subscription.unsubscribe()
            window.removeEventListener("auth-state-changed", handleAuthChanged as EventListener)
        }
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
                {isAdmin && <AdminFAB />}
                {(pathname === "/" || pathname === "/home") && <WhatsAppButton />}
            </div>
        </>
    )
}

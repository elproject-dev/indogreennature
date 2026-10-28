"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { InsightEditor } from "@/components/insight/insight-editor"
import { fetchInsightBySlug } from "@/lib/insight/db"
import { InsightArticle } from "@/lib/insight/types"
import { LoadingSpinner } from "@/components/loading-spinner"
import { supabase } from "@/lib/supabase"
import { isUserAdmin } from "@/lib/auth-admin"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

function CreateInsightContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editSlug = searchParams.get("edit")

  const [authChecking, setAuthChecking] = React.useState(true)
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [loading, setLoading] = React.useState(!!editSlug)
  const [initialArticle, setInitialArticle] = React.useState<InsightArticle | null>(null)

  // 1. Verifikasi hak akses Admin secara ketat
  React.useEffect(() => {
    let isMounted = true

    async function checkAdminAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!isMounted) return

        if (!session?.user || !isUserAdmin(session.user.email)) {
          setIsAuthorized(false)
          setAuthChecking(false)
          // Redirect jika tidak memiliki hak akses
          if (!session?.user) {
            router.replace("/login?next=/insight/create")
          } else {
            router.replace("/")
          }
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        console.error("Gagal memverifikasi hak akses admin:", err)
        if (isMounted) setIsAuthorized(false)
      } finally {
        if (isMounted) setAuthChecking(false)
      }
    }

    checkAdminAuth()

    return () => {
      isMounted = false
    }
  }, [router])

  // 2. Load artikel yang ingin diedit jika ada editSlug dan sudah terverifikasi admin
  React.useEffect(() => {
    if (!isAuthorized || !editSlug) {
      if (!editSlug) setLoading(false)
      return
    }

    let isMounted = true
    async function loadArticle() {
      try {
        const article = await fetchInsightBySlug(editSlug as string)
        if (isMounted) {
          setInitialArticle(article)
        }
      } catch (err) {
        console.error("Gagal mengambil data artikel:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadArticle()
    return () => {
      isMounted = false
    }
  }, [editSlug, isAuthorized])

  // Menampilkan loader saat memeriksa hak akses admin
  if (authChecking || (isAuthorized && loading)) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
        <LoadingSpinner text={authChecking ? "Memverifikasi Akses Admin..." : "Memuat Editor..."} />
      </div>
    )
  }

  // Tampilan penolakan akses jika bukan admin
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-destructive/20 rounded-2xl p-6 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Akses Ditolak</h2>
          <p className="text-sm text-muted-foreground">
            Halaman pembuatan dan pengelolaan artikel ini hanya dapat diakses oleh Admin resmi Indo Green Nature.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login?next=/insight/create"
              className={cn(buttonVariants({ variant: "default" }), "w-full text-center")}
            >
              Login sebagai Admin
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }), "w-full text-center")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <InsightEditor
      initialArticle={initialArticle}
      isEditMode={!!editSlug && !!initialArticle}
    />
  )
}

export default function CreateInsightPage() {
  return (
    <React.Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
          <LoadingSpinner text="Memuat..." />
        </div>
      }
    >
      <CreateInsightContent />
    </React.Suspense>
  )
}

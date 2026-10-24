"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { processAuthTokensFromUrl } from "@/lib/auth-callback"
import { toast } from "@/components/ui/toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { isUserAdmin } from "@/lib/auth-admin"
import { supabase } from "@/lib/supabase"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [statusMessage, setStatusMessage] = useState("Memverifikasi otentikasi...")

  useEffect(() => {
    let isMounted = true

    const handleCallback = async () => {
      // 1. Coba proses token dari URL (hash ataupun query code)
      const result = await processAuthTokensFromUrl()

      if (!isMounted) return

      if (result.success && result.user) {
        setStatusMessage("Login berhasil! Mengalihkan...")
        const userEmail = result.user.email
        const isAdmin = isUserAdmin(userEmail)

        const requestedNext = searchParams.get("next")
        // Jika ada target spesifik arahkan ke sana, jika admin tanpa target spesifik arahkan ke /settings atau /
        const targetPath = requestedNext || "/"

        toast.add({
          title: "Login Berhasil",
          description: `Selamat datang, ${
            result.user.user_metadata?.full_name || userEmail
          }${isAdmin ? " (Admin)" : ""}`,
          type: "success",
        })

        router.replace(targetPath)
        return
      }

      if (result.error) {
        toast.add({
          title: "Gagal Login",
          description: result.error,
          type: "error",
        })
        router.replace("/login")
        return
      }

      // 2. Jika tidak ada parameter di URL, cek apakah sesi sudah aktif
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!isMounted) return

      if (session?.user) {
        const requestedNext = searchParams.get("next") || "/"
        router.replace(requestedNext)
      } else {
        // Fallback jika tidak ada sesi dan tidak ada token
        setStatusMessage("Tidak ada sesi yang ditemukan. Mengalihkan ke login...")
        setTimeout(() => {
          if (isMounted) router.replace("/login")
        }, 1200)
      }
    }

    handleCallback()

    return () => {
      isMounted = false
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-foreground">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <LoadingSpinner text="" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {statusMessage}
        </p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <LoadingSpinner text="Loading..." />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}

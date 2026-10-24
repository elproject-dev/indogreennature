"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { InsightEditor } from "@/components/insight/insight-editor"
import { fetchInsightBySlug } from "@/lib/insight/db"
import { InsightArticle } from "@/lib/insight/types"
import { LoadingSpinner } from "@/components/loading-spinner"

function CreateInsightContent() {
  const searchParams = useSearchParams()
  const editSlug = searchParams.get("edit")

  const [loading, setLoading] = React.useState(!!editSlug)
  const [initialArticle, setInitialArticle] = React.useState<InsightArticle | null>(null)

  React.useEffect(() => {
    if (!editSlug) {
      setLoading(false)
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
  }, [editSlug])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner text="Memuat studio artikel..." />
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
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner text="Menyiapkan editor insight..." />
        </div>
      }
    >
      <CreateInsightContent />
    </React.Suspense>
  )
}

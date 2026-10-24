"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { outfit } from "@/lib/fonts"
import { ChevronLeft } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"


export default function PromoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [promo, setPromo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPromo() {
      if (!params.id) return

      try {
        const { data, error } = await supabase
          .from("promo")
          .select("*")
          .eq("id", params.id)
          .single()

        if (data) {
          setPromo(data)
        } else {
          console.error("Promo not found", error)
        }
      } catch (err) {
        console.error("Error fetching promo:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromo()
  }, [params.id])

  if (isLoading) {
    return <LoadingSpinner text="Loading" />
  }

  if (!promo) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl text-primary">Promo tidak ditemukan.</h1>
        <Button onClick={() => router.back()} className="mt-4">
          Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300">
      <main className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[20px] pb-20 flex flex-col relative z-10">
        
        {/* Detail Card Wrapper */}
        <div className="w-full bg-card-alt rounded-sm overflow-hidden shadow-sm flex flex-col">
        
        {/* Top Image */}
        <div className="w-full aspect-square relative bg-card-alt overflow-hidden shrink-0">
          {promo.src ? (
            <>
              {/* Foreground Image */}
              <img src={promo.src} alt={promo.title} className="w-full h-full object-cover absolute inset-0 drop-shadow-2xl" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 absolute inset-0">Tidak ada gambar</div>
          )}

          {/* Back Button Overlay */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-background/30 hover:bg-background/50 text-primary backdrop-blur-md border border-primary/10 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-1 w-full">
          
          {/* Header Box */}
          <div className="flex flex-col bg-primary-soft w-full px-2 py-4 md:py-8 shrink-0">
            <h1 className="font-bold text-[18px] md:text-[26px] leading-tight text-primary">
              {promo.title}
            </h1>
          </div>
          
          {/* Content Box */}
          <div className="p-2 md:p-8 mt-2 flex flex-col">
            <p className="whitespace-pre-line font-normal text-[15px] md:text-[24px] leading-relaxed text-primary/80">
              {promo.promo || "Detail promo tidak tersedia."}
            </p>
          </div>

        </div>

        </div>
      </main>

    </div>
  )
}

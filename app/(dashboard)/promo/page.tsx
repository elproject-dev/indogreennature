"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { outfit } from "@/lib/fonts"


const galleryImages = [
  { id: 1, title: "Sayur Segar", promo: "Diskon 20%", src: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop" },
  { id: 2, title: "Bumbu Dapur", promo: "Beli 2 Gratis 1", src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop" },
  { id: 3, title: "Produk Susu", promo: "Hemat Rp 5.000", src: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=400&fit=crop" },
  { id: 4, title: "Perawatan Tubuh", promo: "Diskon Up To 50%", src: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=400&fit=crop" },
  { id: 5, title: "Camilan Sehat", promo: "Promo Akhir Pekan", src: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=400&fit=crop" },
  { id: 6, title: "Minuman Dingin", promo: "Beli 1 Gratis 1", src: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&h=400&fit=crop" },
  { id: 7, title: "Alat Kebersihan", promo: "Diskon 10%", src: "https://images.unsplash.com/photo-1584824486509-112e4181f1ce?w=600&h=400&fit=crop" },
  { id: 8, title: "Kebutuhan Bayi", promo: "Harga Spesial", src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=400&fit=crop" },
];

export default function PromoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<any[]>(galleryImages)

  useEffect(() => {
    const fetchPromos = async () => {
      const { data, error } = await supabase
        .from('promo')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true })
      if (data) {
        setImages(data)
      } else {
        setImages(galleryImages)
      }
      setIsMounted(true);
    }
    fetchPromos()
  }, [])

  if (!isMounted) {
    return <LoadingSpinner text="Loading" />
  }

  return (
    <>
      <div className="w-full min-h-screen bg-background flex flex-1 flex-col py-4 md:pt-[24px] md:pb-[80px] px-4 md:px-[20px] items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-4 w-full max-w-[1400px]">
          


          <div className="w-full flex flex-col gap-[20px] mt-4">
            {images.length > 0 ? (
              images.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col md:flex-row w-full h-auto md:h-[264px] transition-shadow cursor-pointer group rounded-sm overflow-hidden shadow-sm hover:shadow-md" onClick={() => router.push(`/promo/${item.id}`)}>
                  {/* foto promo */}
                  <div className="w-full md:w-[264px] md:h-[264px] aspect-square shrink-0 bg-primary/15 relative flex items-center justify-center overflow-hidden">
                    {item.src ? (
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="text-gray-500">Foto</span>
                    )}
                  </div>

                  {/* pagagraf promo */}
                  <div className="flex-1 flex flex-col bg-primary-soft overflow-hidden">
                    {/* Title Header */}
                    <div className="w-full px-[17px] py-3 md:py-4 flex items-center shrink-0 border-b border-primary/10">
                      <h3 className={`font-semibold text-[16px] md:text-[24px] leading-tight text-primary line-clamp-2 ${outfit.className}`}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Frame 7 - Description Box */}
                    <div className="flex-1 bg-card-alt w-full p-[17px] flex flex-col justify-between overflow-hidden">
                      <p className={`font-normal text-[14px] md:text-[16px] leading-relaxed text-primary/80 line-clamp-3 md:line-clamp-4 ${outfit.className}`}>
                        {item.promo || "Detail promo tidak tersedia."}
                      </p>
                      <div className="mt-3">
                        <span className={`font-medium text-[14px] md:text-[16px] text-brand-accent cursor-pointer hover:underline ${outfit.className}`}>
                          more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-20 text-center text-primary bg-card-alt">
                Tidak ada promo yang cocok dengan pencarian Anda.
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { outfit } from "@/lib/fonts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const linkKeys = [
  { key: "grabfood_link", label: "GrabFood Link", placeholder: "Contoh: https://food.grab.com/..." },
  { key: "shopeefood_link", label: "ShopeeFood Link", placeholder: "Contoh: https://shopee.co.id/shopeefood/..." },
  { key: "gofood_link", label: "GoFood Link", placeholder: "Contoh: https://gofood.co.id/..." },
  { key: "google_review_link", label: "Google Review Link", placeholder: "Contoh: https://g.page/r/.../review" },
  { key: "instagram_link", label: "Instagram Link", placeholder: "Contoh: https://instagram.com/cv.indogreennature" },
  { key: "facebook_link", label: "Facebook Link", placeholder: "Contoh: https://facebook.com/cv.indogreennature" },
  { key: "tiktok_link", label: "TikTok Link", placeholder: "Contoh: https://tiktok.com/@cv.indogreennature" },
  { key: "youtube_link", label: "YouTube Link", placeholder: "Contoh: https://youtube.com/@cv.indogreennature" },
  { key: "website_link", label: "Website Link", placeholder: "Contoh: https://indogreennature.com" },
]

export default function LinkedPage() {
  const [links, setLinks] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchLinks = async () => {
      const keys = linkKeys.map(l => l.key)
      const { data, error } = await supabase.from('app_config').select('*').in('key', keys)
      
      if (!error && data) {
        const currentLinks: Record<string, string> = {}
        data.forEach(item => {
          currentLinks[item.key] = item.value || ""
        })
        // Initialize empty for missing keys without forcing default URLs
        linkKeys.forEach(l => {
          if (currentLinks[l.key] === undefined) {
            currentLinks[l.key] = ""
          }
        })
        setLinks(currentLinks)
      } else {
        toast.add({ title: "Gagal memuat link", type: "error" })
      }
      setIsLoading(false)
    }
    fetchLinks()
  }, [])

  const handleChange = (key: string, value: string) => {
    setLinks(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    let hasError = false;

    for (const item of linkKeys) {
      const value = links[item.key] ? links[item.key].trim() : ""
      const { data } = await supabase.from('app_config').select('id').eq('key', item.key).maybeSingle()
      if (data) {
        const { error } = await supabase.from('app_config').update({ value, updated_at: new Date().toISOString() }).eq('key', item.key)
        if (error) hasError = true;
      } else {
        const { error } = await supabase.from('app_config').insert({ key: item.key, value })
        if (error) hasError = true;
      }
    }
    
    // Invalidate home cache so new link configuration immediately updates home page
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("indo_green_nature_home_cache")
      } catch (e) {}
    }

    if (hasError) {
      toast.add({ title: "Gagal menyimpan", description: "Beberapa tautan gagal disimpan", type: "error" })
    } else {
      toast.add({ title: "Link berhasil disimpan", type: "success" })
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <LoadingSpinner text="Loading" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8 w-full max-w-4xl mx-auto">
      <div className="mb-5 md:mb-6">
        <h1 className={`text-[20px] md:text-2xl font-bold text-primary ${outfit.className}`}>Manajemen Linked</h1>
        <p className="text-[13px] md:text-base text-primary/70 mt-1 md:mt-2">Atur tautan eksternal untuk aplikasi CV. Indo Green Nature.</p>
      </div>

      <div className="bg-card-alt border border-primary/20 rounded-xl p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {linkKeys.map((item) => (
            <div key={item.key} className="space-y-2">
              <label htmlFor={item.key} className="text-sm font-medium text-primary cursor-pointer block">
                {item.label}
              </label>
              <Input
                id={item.key}
                value={links[item.key] || ""}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder={item.placeholder}
                className="w-full bg-background"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-primary/10 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  )
}


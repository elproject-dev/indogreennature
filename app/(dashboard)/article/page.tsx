"use client"

import { useState, useEffect } from "react"
import { Search, CalendarDays } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { outfit, jockey } from "@/lib/fonts"


export default function PilihanPage() {
 const router = useRouter()
 const [isMounted, setIsMounted] = useState(false)
 const [articles, setArticles] = useState<any[]>([])
 const [searchQuery, setSearchQuery] = useState("")
 const [selectedArticle, setSelectedArticle] = useState<any | null>(null)

 useEffect(() => {
 const fetchArticles = async () => {
 const { data, error } = await supabase
 .from('article')
 .select('*')
 .eq('is_active', true)
 .order('id', { ascending: false })
 if (data) {
 setArticles(data)
 }
 setIsMounted(true)
 }
 fetchArticles()
 }, [])

 if (!isMounted) {
 return <LoadingSpinner text="Loading" />
 }

 const filteredArticles = articles.filter((item) => {
 const query = searchQuery.toLowerCase()
 return (
 item.title?.toLowerCase().includes(query) ||
 item.description?.toLowerCase().includes(query)
 )
 })

 return (
 <>
 <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300">
 <main className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] md:pt-[20px] pb-20 flex flex-col relative z-10">

 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-0 md:mt-4">
 <h1 className={`hidden sm:block text-[24px] md:text-[30px] leading-[1.2] text-primary transition-colors ${outfit.className} font-[300]`}>Insight</h1>
 <div className="relative w-full sm:max-w-xs ml-auto">
 <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 id="search-article"
 name="search_article"
 type="search"
 autoComplete="off"
 aria-label="Cari artikel"
 placeholder="Cari article..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pr-9"
 />
 </div>
 </div>

 <div className="w-full flex flex-col gap-[20px]">
 {filteredArticles.length > 0 ? (
 filteredArticles.map((item, idx) => (
 <div key={item.id || idx} className="flex flex-col md:flex-row w-full h-auto transition-colors cursor-pointer group md:gap-[20px] gap-4" onClick={() => router.push(`/article/${item.id}`)}>
 <div className="w-full md:w-[453px] aspect-[2/1] shrink-0 bg-primary/15 relative flex items-center justify-center overflow-hidden shadow-sm rounded-md md:rounded-none">
 {item.src ? (
 <Image
 src={item.src}
 alt={item.title || "Insight"}
 fill
 sizes="(max-width: 1024px) 100vw, 50vw"
 className="object-cover"
 />
 ) : (
 <span className="text-gray-500">Foto</span>
 )}
 </div>

 {/* pagagraf article */}
 <div className="flex-1 flex flex-col bg-primary-soft shadow-sm overflow-hidden group-hover:shadow-md transition-shadow rounded-md md:rounded-none">
 {/* Title Header */}
 <div className="w-full px-[17px] py-3 md:py-4 flex items-center shrink-0 border-b border-primary/10">
 <h3 className={`font-semibold text-[16px] md:text-[24px] leading-tight text-primary line-clamp-2 ${outfit.className}`}>
 {item.title}
 </h3>
 </div>

 {/* Frame 7 - Description Box */}
 <div className="flex-1 bg-card-alt w-full p-[17px] flex flex-col justify-between overflow-hidden">
 <div>
 <div className="flex items-center text-[12px] md:text-[14px] text-primary/70 mb-2">
 <CalendarDays className="w-4 h-4 mr-2" />
 {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
 </div>
 <p className={`font-normal text-[14px] md:text-[16px] leading-relaxed text-primary/80 line-clamp-3 md:line-clamp-4 ${outfit.className}`}>
 {item.description || "Detail article tidak tersedia."}
 </p>
 </div>
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
 <div className="w-full py-20 text-center text-primary bg-card-alt rounded-md md:rounded-none">
 Tidak ada article yang cocok dengan pencarian Anda.
 </div>
 )}
 </div>

 </main>
 </div>
 </>
 )
}

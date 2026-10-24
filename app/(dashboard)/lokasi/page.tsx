"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { outfit } from "@/lib/fonts"
import { MapPin, Clock, Contact } from "lucide-react"


export default function LokasiPage() {
 const [storeLocations, setStoreLocations] = useState<any[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 const fetchLocations = async () => {
 const { data, error } = await supabase.from('lokasi').select('*').order('id', { ascending: true })
 if (data) {
 setStoreLocations(data)
 }
 setIsLoading(false)
 }
 fetchLocations()
 }, [])

 if (isLoading) {
 return <LoadingSpinner text="Loading" />
 }

 return (
 <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300">
 <main className="w-full max-w-[1440px] px-5 lg:px-[20px] pt-[20px] pb-20 flex flex-col relative z-10">
 <div className="flex flex-col gap-[20px] w-full mt-4">
 {storeLocations.length === 0 ? (
 <div className="w-full py-20 text-center text-primary bg-card-alt">
 Belum ada data outlet.
 </div>
 ) : (
 storeLocations.map((store) => (
 <div key={store.id} className="flex flex-col w-full">
 
 <div className="flex flex-col md:flex-row w-full md:gap-[13px]">
 
 {/* Kiri: Foto Outlet */}
 <div className="w-full md:w-[548px] aspect-[2/1] h-auto md:h-[274px] shrink-0 bg-muted relative rounded-none overflow-hidden">
 <img
 src={store.image || store.src}
 alt={store.name}
 className="w-full h-full object-cover absolute inset-0 rounded-none"
 />
 </div>

 {/* Kanan: Info Outlet */}
 <div className="flex-1 flex flex-col w-full md:max-w-[839px] mt-4 md:mt-0">
 
 {/* Header Nama Outlet */}
 <div className="w-full h-[39px] bg-primary-soft flex items-center px-4 md:px-[30px]">
 <h3 className={`font-bold text-[16px] md:text-[24px] text-primary leading-tight ${outfit.className}`}>
 {store.name}
 </h3>
 </div>

 {/* Box Keterangan */}
 <div className="w-full md:h-[220px] h-auto flex-1 bg-card-alt px-4 py-6 md:px-[27px] flex flex-col justify-center relative">
 
 <div className="flex flex-col justify-center gap-4 md:gap-[29px]">
 {/* Alamat */}
 <div className="flex items-center gap-[12px] md:gap-[30px]">
 <div className="w-[20px] h-[20px] md:w-[32px] md:h-[32px] flex items-center justify-center shrink-0">
 <MapPin className="w-full h-full text-primary" strokeWidth={2.5} />
 </div>
 <p className={`font-normal text-[14px] md:text-[24px] text-primary leading-[120%] ${outfit.className}`}>
 {store.address || "-"}
 </p>
 </div>

 {/* Jam Buka */}
 <div className="flex items-center gap-[12px] md:gap-[30px]">
 <div className="w-[20px] h-[20px] md:w-[32px] md:h-[32px] flex items-center justify-center shrink-0">
 <Clock className="w-full h-full text-primary" strokeWidth={2.5} />
 </div>
 <p className={`font-normal text-[14px] md:text-[24px] text-primary leading-[120%] ${outfit.className}`}>
 {store.hours ?`Jam Buka ${store.hours}` : "-"}
 </p>
 </div>

 {/* Telepon */}
 <div className="flex items-center gap-[12px] md:gap-[30px]">
 <div className="w-[20px] h-[20px] md:w-[32px] md:h-[32px] flex items-center justify-center shrink-0">
 <Contact className="w-full h-full text-primary" strokeWidth={2.5} />
 </div>
 <p className={`font-normal text-[14px] md:text-[24px] text-primary leading-[120%] ${outfit.className}`}>
 {store.phone ?`Kontak : ${store.phone}` : "-"}
 </p>
 </div>
 </div>

 {/* Button Google Maps */}
 <a
 href={store.maps_url || store.mapsUrl || "#"}
 target="_blank"
 rel="noreferrer"
 className={`flex items-center justify-center mt-6 md:mt-0 w-full md:w-[252px] h-[36px] md:h-[65px] md:absolute md:right-[27px] md:bottom-[40px] bg-primary-soft shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[100px] font-bold text-[14px] md:text-[24px] text-primary hover:scale-105 active:scale-95 transition-transform ${outfit.className}`}
 >
 GOOGLE MAP
 </a>
 </div>
 </div>

 </div>

 {/* Garis Pembatas (Line 1) */}
 <div className="w-full h-0 border-t-[3px] border-primary/30 mt-[20px] md:mt-[50px] shrink-0" />
 </div>
 ))
 )}
 </div>
 </main>
 </div>
 )
}


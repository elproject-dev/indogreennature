"use client"

import React from "react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

export interface TopProductClick {
  name: string
  count: number
}

interface WhatsAppClicksCardProps {
  totalOrders: number
  topProducts: TopProductClick[]
  totalMarketplaceClicks?: number
}

export function WhatsAppClicksCard({
  totalOrders,
  topProducts,
  totalMarketplaceClicks = 0,
}: WhatsAppClicksCardProps) {
  const maxClicks = topProducts[0]?.count || 1

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <span className="p-1 rounded bg-[#25D366]/10 text-[#25D366]">
                <WhatsAppIcon className="w-4 h-4 fill-current" />
              </span>
              Konversi Klik Order WhatsApp
            </CardTitle>
            <CardDescription className="text-[10px]">
              Statistik minat order produk via WhatsApp
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-[#25D366]">
              {totalOrders.toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-1">
              total klik
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center px-4 pb-2">
        {topProducts.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b pb-1">
              <span>Produk Paling Diminati</span>
              <span>Jumlah Klik</span>
            </div>
            {topProducts.map((prod, index) => {
              const pct = Math.round((prod.count / maxClicks) * 100)
              return (
                <div key={prod.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-[260px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-muted text-[10px] flex items-center justify-center font-bold text-muted-foreground shrink-0">
                        {index + 1}
                      </span>
                      <span className="truncate">{prod.name}</span>
                    </span>
                    <span className="font-bold text-[#25D366] shrink-0">
                      {prod.count.toLocaleString("id-ID")}x
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#25D366] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col h-[180px] items-center justify-center text-center p-4 border-2 border-dashed rounded-lg">
            <WhatsAppIcon className="w-8 h-8 fill-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">Belum ada klik order WhatsApp</p>
            <p className="text-[10px] text-muted-foreground/75 mt-0.5">
              Klik pada tombol &quot;Order Cepat via WhatsApp&quot; di halaman produk akan otomatis tercatat di sini.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between text-[10px] text-muted-foreground border-t pt-3 mt-auto">
        <span>Tersimpan di Supabase database</span>
        {totalMarketplaceClicks > 0 && (
          <span className="font-medium text-foreground">
            + {totalMarketplaceClicks} klik marketplace
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

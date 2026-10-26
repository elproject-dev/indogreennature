"use client"

import * as React from "react"
import { Monitor, Smartphone, Tablet, Laptop, HelpCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface DeviceData {
  category: string
  activeUsers: number
}

interface DeviceChartProps {
  data: DeviceData[]
}

const DEVICE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string; barColor: string }
> = {
  desktop: {
    label: "Desktop / Komputer",
    icon: Monitor,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50",
    barColor: "bg-emerald-500",
  },
  mobile: {
    label: "Ponsel (Mobile)",
    icon: Smartphone,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/50",
    barColor: "bg-violet-500",
  },
  tablet: {
    label: "Tablet",
    icon: Tablet,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
    barColor: "bg-amber-500",
  },
}

export function DeviceChart({ data }: DeviceChartProps) {
  const totalUsers = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.activeUsers, 0)
  }, [data])

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-primary">
              Pengguna Menurut Perangkat
            </CardTitle>
            <CardDescription className="text-[10px] hidden sm:block">
              Kategori perangkat pengunjung (28 Hari)
            </CardDescription>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {totalUsers.toLocaleString("id-ID")} pengguna
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center gap-4 px-4 pb-2">
        {data.length > 0 ? (
          <div className="space-y-3.5">
            {data.map((item) => {
              const key = item.category.toLowerCase()
              const config = DEVICE_CONFIG[key] || {
                label: item.category,
                icon: HelpCircle,
                color: "text-gray-600 dark:text-gray-400",
                bg: "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800",
                barColor: "bg-gray-500",
              }
              const Icon = config.icon
              const percentage = totalUsers > 0 ? Math.round((item.activeUsers / totalUsers) * 100) : 0

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md border ${config.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>
                      <span className="font-medium text-foreground">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {item.activeUsers.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] text-muted-foreground w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            Belum ada data perangkat
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground border-t pt-4 mt-auto">
        <Laptop className="h-3 w-3" />
        Distribusi perangkat pengunjung website
      </CardFooter>
    </Card>
  )
}

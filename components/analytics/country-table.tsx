"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface CountryData {
  country: string
  activeUsers: number
}

interface CountryTableProps {
  data: CountryData[]
}

const COUNTRY_FLAGS: Record<string, string> = {
  Indonesia: "🇮🇩",
  "United States": "🇺🇸",
  Singapore: "🇸🇬",
  Malaysia: "🇲🇾",
  France: "🇫🇷",
  Germany: "🇩🇪",
  India: "🇮🇳",
  "United Kingdom": "🇬🇧",
  Japan: "🇯🇵",
  Netherlands: "🇳🇱",
  Australia: "🇦🇺",
  China: "🇨🇳",
  "Saudi Arabia": "🇸🇦",
  "South Korea": "🇰🇷",
  Canada: "🇨🇦",
  Philippines: "🇵🇭",
  Thailand: "🇹🇭",
  Vietnam: "🇻🇳",
  Brazil: "🇧🇷",
  Russia: "🇷🇺",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Turkey: "🇹🇷",
}

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] || "🌐"
}

export function CountryTable({ data }: CountryTableProps) {
  const tableData = React.useMemo(() => {
    return data.map((item) => ({
      country: item.country === "(not set)" ? "Tidak Diketahui" : item.country,
      activeUsers: item.activeUsers,
    }))
  }, [data])

  const totalUsers = React.useMemo(() => {
    return tableData.reduce((acc, curr) => acc + curr.activeUsers, 0)
  }, [tableData])

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-primary">
              Pengguna Menurut Negara
            </CardTitle>
            <CardDescription className="text-[10px] hidden sm:block">
              Distribusi negara pengunjung website
            </CardDescription>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {totalUsers.toLocaleString("id-ID")} pengguna
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto px-2 pb-0">
        {tableData.length > 0 ? (
          <Table className="text-primary">
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Negara</TableHead>
                <TableHead className="text-right text-primary">Pengguna</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => {
                const pct = totalUsers > 0 ? Math.round((row.activeUsers / totalUsers) * 100) : 0
                return (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-primary py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">{getFlag(row.country)}</span>
                        <span className="truncate max-w-[120px] sm:max-w-none">{row.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-primary py-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold">{row.activeUsers.toLocaleString("id-ID")}</span>
                        <span className="text-[10px] text-muted-foreground w-8 text-right font-medium">
                          {pct}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            Belum ada data negara
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground border-t pt-3 mt-auto">
        <Globe className="h-3 w-3" />
        Menampilkan negara pengunjung teratas
      </CardFooter>
    </Card>
  )
}

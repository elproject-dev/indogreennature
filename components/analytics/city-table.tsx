"use client"

import { MapPin } from "lucide-react"

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

interface CityTableProps {
  data: { city: string; activeUsers: number }[]
}

export function CityTable({ data }: CityTableProps) {
  // Filter out '(not set)' or empty cities if necessary, though sometimes it's useful to see
  const tableData = data.map(item => ({
    city: item.city === '(not set)' ? 'Tidak Diketahui' : item.city,
    activeUsers: item.activeUsers
  }))

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-primary">Pengguna Aktif Menurut Kota</CardTitle>
        <CardDescription className="text-[10px]">Data Google Analytics (30 Hari)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-2 pb-0">
        {tableData.length > 0 ? (
          <Table className="text-primary">
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Kota</TableHead>
                <TableHead className="text-right text-primary">Pengguna Aktif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-primary">{row.city}</TableCell>
                  <TableCell className="text-right text-primary">{row.activeUsers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            Belum ada data lokasi
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground border-t pt-4 mt-auto">
        <MapPin className="h-3 w-3" />
        Menampilkan 10 kota teratas
      </CardFooter>
    </Card>
  )
}

"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function RealtimeBarChart({ data }: { data: any[] }) {
  const chartConfig = {
    users: {
      label: "Pengguna",
      color: "#f59e0b", // Amber 500
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-primary">Pengguna Aktif per Menit</CardTitle>
        <CardDescription className="text-[10px]">Aktivitas dalam 30 menit terakhir</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-4">
        <ChartContainer config={chartConfig} className="h-[120px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barCategoryGap={1}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="minute" hide={true} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="users" 
              fill="var(--color-users)" 
              radius={[2, 2, 0, 0]} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { Pie, PieChart, Cell, Tooltip } from "recharts"
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const COLORS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#84cc16'  // Lime
]

interface SourceBarChartProps {
  data: { source: string; activeUsers: number }[]
}

export function SourceBarChart({ data }: SourceBarChartProps) {
  // Format the source name and assign a color
  const chartData = data.map((item, index) => {
    let sourceName = item.source;
    if (sourceName === '(not set)' || sourceName === '(direct) / (none)') {
      sourceName = 'Direct';
    }
    return {
      source: sourceName,
      activeUsers: item.activeUsers,
      fill: COLORS[index % COLORS.length]
    };
  });

  const chartConfig = {
    activeUsers: {
      label: "Pengguna Aktif",
    },
    ...Object.fromEntries(
      chartData.map((item, index) => [
        item.source,
        {
          label: item.source,
          color: COLORS[index % COLORS.length],
        },
      ])
    ),
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-primary">Sumber / Media Pengguna</CardTitle>
        <CardDescription className="text-[10px]">Data Google Analytics (30 Hari)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-0 flex items-center justify-center">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[350px] w-full flex items-center justify-center">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="source" />}
              />
              <Pie
                data={chartData}
                dataKey="activeUsers"
                nameKey="source"
                innerRadius={70}
                outerRadius={110}
                strokeWidth={2}
                stroke="var(--background)"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            Belum ada data sumber lalu lintas
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground border-t pt-4 mt-auto">
        <Globe className="h-3 w-3" />
        Menampilkan 10 sumber teratas
      </CardFooter>
    </Card>
  )
}

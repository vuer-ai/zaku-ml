"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import type { Job, LogItem, LogItemType } from "@/lib/types"

interface WaterfallChartProps {
  job: Job
}

const getEventColor = (status: LogItem["status"], type: LogItemType) => {
  if (type === "error" || status === "failed") return "hsl(var(--chart-5))" // Reddish
  if (type === "task") return "hsl(var(--chart-1))" // Blueish
  if (type === "success") return "hsl(var(--chart-2))" // Greenish
  if (status === "in-progress") return "hsl(var(--chart-4))" // Yellowish
  return "hsl(var(--muted-foreground))" // Gray for attempts, logs
}

const CustomBar = (props: any) => {
  const { x, y, width, height, payload } = props
  const { type, duration, status } = payload
  const color = getEventColor(status, type)

  // Render dots for instantaneous events (info, error)
  if (type === "info" || type === "error") {
    return <circle cx={x + 3} cy={y + height / 2} r={3} fill={color} />
  }

  // Define bar height based on type for visual distinction
  const barHeight = type === "log" || type === "success" ? height * 0.5 : height * 0.8
  const barY = y + (height - barHeight) / 2

  // Render striped bars for container tasks
  if (type === "task") {
    return (
      <g>
        <defs>
          <pattern
            id={`pattern-${payload.id}`}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="4" height="8" fill={color} fillOpacity={0.6} />
          </pattern>
        </defs>
        <rect x={x} y={barY} width={width} height={barHeight} fill={`url(#pattern-${payload.id})`} rx={3} ry={3} />
      </g>
    )
  }

  // Render solid bars for other timed events (attempts, logs, etc.)
  return <rect x={x} y={barY} width={width} height={barHeight} fill={color} rx={3} ry={3} />
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="p-2 bg-background border rounded-md shadow-lg text-sm">
        <p className="font-bold mb-1">{data.displayName}</p>
        <p>
          Status: <span className="capitalize font-medium">{data.status}</span>
        </p>
        {data.duration > 0 ? (
          <>
            <p>Start: {(data.time[0] / 1000).toFixed(2)}s</p>
            <p>Duration: {(data.duration / 1000).toFixed(2)}s</p>
          </>
        ) : (
          <p>Time: {(data.time[0] / 1000).toFixed(2)}s</p>
        )}
      </div>
    )
  }
  return null
}

export default function WaterfallChart({ job }: WaterfallChartProps) {
  const { chartData, yDomain } = useMemo(() => {
    const flattened: (LogItem & {
      uniqueName: string
      displayName: string
      level: number
    })[] = []
    const yAxisData: { id: string; name: string }[] = []

    const recurse = (items: LogItem[], level = 0) => {
      items.forEach((item) => {
        const uniqueName = `${item.id}-${item.name}`
        flattened.push({ ...item, uniqueName, displayName: item.name, level })
        yAxisData.push({ id: uniqueName, name: item.name })
        if (item.children) {
          recurse(item.children, level + 1)
        }
      })
    }
    recurse(job.logs)

    const processedChartData = flattened.map((log) => ({
      ...log,
      // Recharts stacked bar needs an array: [start, end]
      // We provide [start, duration] for the bar to render correctly
      time: [log.startTime, log.duration],
    }))

    return { chartData: processedChartData, yDomain: yAxisData.map((d) => d.id) }
  }, [job.logs])

  return (
    <div className="flex-1 p-6 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>{job.name}</CardTitle>
          <CardDescription>
            Status: <span className="capitalize">{job.status}</span> - Total Duration:{" "}
            {(job.totalDuration / 1000).toFixed(2)}s
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ChartContainer config={{}} className="w-full h-full">
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                barCategoryGap="35%"
                stackOffset="expand"
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, () => Math.max(job.totalDuration, 1000) + 1000]}
                  tickFormatter={(val) => `${val / 1000}s`}
                  allowDecimals={false}
                />
                <YAxis dataKey="uniqueName" type="category" hide domain={yDomain} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                  animationDuration={150}
                />
                {/* This is a "ghost" bar to create the offset from the start time */}
                <Bar dataKey="time[0]" stackId="a" fill="transparent" isAnimationActive={false} />
                {/* This is the visible bar representing the duration */}
                <Bar dataKey="time[1]" stackId="a" isAnimationActive={false}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${entry.id}`} shape={<CustomBar payload={entry} />} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

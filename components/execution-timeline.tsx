"use client"

import { useState, useMemo } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  History,
  FileCode,
  Bot,
  CheckCircle2,
  PauseCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

type LogItemData = {
  id: string
  parentId: string | null
  indent: number
  type: "task" | "attempt" | "info" | "step"
  label: string
  icon?: "history" | "file-code" | "bot" | "check-circle" | "pause-circle"
  start?: number
  duration?: number
  time?: number
  color?: "blue" | "green" | "orange" | "gray-light"
  isCollapsible?: boolean
  hasStripes?: boolean
  connection?: {
    type: "solid" | "dashed"
    end: number
  }
}

const logData: LogItemData[] = [
  {
    id: "0",
    parentId: null,
    indent: 0,
    type: "info",
    label: "Job registered in queue",
    icon: "history",
    time: 0,
  },
  {
    id: "1",
    parentId: null,
    indent: 0,
    type: "task",
    label: "generate-report",
    icon: "file-code",
    start: 0,
    duration: 17,
    color: "blue",
    isCollapsible: true,
    hasStripes: true,
  },
  {
    id: "2",
    parentId: "1",
    indent: 1,
    type: "attempt",
    label: "Attempt 1",
    icon: "bot",
    start: 0.1,
    duration: 16.9,
    color: "blue",
    isCollapsible: true,
  },
  {
    id: "3",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Fetch database records",
    icon: "check-circle",
    start: 0.5,
    duration: 3,
    color: "green",
    connection: { type: "dashed", end: 4 },
  },
  {
    id: "4",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Job halted, waiting for resources...",
    icon: "pause-circle",
    start: 4,
    duration: 2,
    color: "orange",
    connection: { type: "dashed", end: 6.5 },
  },
  {
    id: "5",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Waiting for image renderer...",
    icon: "file-code",
    start: 6.5,
    duration: 7,
    color: "gray-light",
    connection: { type: "dashed", end: 14 },
  },
  {
    id: "6",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Render charts",
    icon: "file-code",
    start: 14,
    duration: 4.6,
    color: "blue",
  },
  {
    id: "7",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Assemble PDF",
    icon: "file-code",
  },
]

const TOTAL_DURATION = 18
const timeMarkers = [
  { time: 2, label: "2s" },
  { time: 4, label: "4s" },
  { time: 6, label: "6s" },
  { time: 8, label: "8s" },
  { time: 10, label: "10s" },
  { time: 12, label: "12s" },
  { time: 14, label: "14s" },
  { time: 16, label: "16s" },
  { time: 18, label: "18s" },
]

const getIcon = (item: LogItemData) => {
  const iconColor = (item: LogItemData) => {
    if (item.label === "generate-report" || item.label === "Assemble PDF") return "text-blue-500"
    if (item.icon === "file-code") return "text-muted-foreground"
    return ""
  }

  switch (item.icon) {
    case "history":
      return <History className="size-4 text-purple-500 shrink-0" />
    case "file-code":
      return <FileCode className={cn("size-4 shrink-0", iconColor(item))} />
    case "bot":
      return <Bot className="size-4 text-muted-foreground shrink-0" />
    case "check-circle":
      return <CheckCircle2 className="size-4 text-green-500 shrink-0" />
    case "pause-circle":
      return <PauseCircle className="size-4 text-orange-500 shrink-0" />
    default:
      return <Info className="size-4 text-muted-foreground shrink-0" />
  }
}

const formatDuration = (seconds: number) => {
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`
  }
  return `${seconds.toFixed(2)}s`
}

export function ExecutionTimeline() {
  const [expandedItems, setExpandedItems] = useState(() => {
    const initial = new Set<string>()
    logData.forEach((item) => {
      if (item.isCollapsible) initial.add(item.id)
    })
    return initial
  })

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const childrenMap = useMemo(() => {
    const map = new Map<string | null, LogItemData[]>()
    logData.forEach((item) => {
      if (!map.has(item.parentId)) {
        map.set(item.parentId, [])
      }
      map.get(item.parentId)!.push(item)
    })
    return map
  }, [])

  const logDataWithMeta = useMemo(() => {
    const dataMap = new Map(logData.map((item) => [item.id, item]))

    const getAncestors = (item: LogItemData) => {
      const ancestors: LogItemData[] = []
      let current = item.parentId
      while (current) {
        const parent = dataMap.get(current)
        if (parent) {
          ancestors.unshift(parent)
          current = parent.parentId
        } else {
          break
        }
      }
      return ancestors
    }

    return logData.map((item) => {
      const siblings = childrenMap.get(item.parentId) || []
      const isLast = siblings.length > 0 && siblings[siblings.length - 1].id === item.id
      const ancestors = getAncestors(item)
      return { ...item, isLast, ancestors }
    })
  }, [childrenMap])

  const isVisible = (item: { ancestors: LogItemData[] }) => {
    return item.ancestors.every((ancestor) => expandedItems.has(ancestor.id))
  }

  const visibleLogData = logDataWithMeta.filter(isVisible)

  return (
    <div className="bg-card text-card-foreground font-sans rounded-lg border w-full max-w-7xl mx-auto shadow-2xl overflow-hidden">
      <div className="flex items-center p-2 border-b">
        <div className="flex items-center gap-2 flex-1">
          <Search className="size-4 text-muted-foreground" />
          <input type="text" placeholder="Search logs" className="bg-transparent text-sm focus:outline-none w-full" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button className="p-1 hover:bg-accent rounded">
            <ChevronLeft className="size-4" />
          </button>
          <span>0.0s</span>
          <button className="p-1 hover:bg-accent rounded">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(300px,30%)_1fr]">
        {/* Sidebar */}
        <div className="border-r overflow-x-auto">
          <div className="h-8" /> {/* Spacer for timeline header */}
          {visibleLogData.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center relative group cursor-pointer h-[32px]",
                hoveredId === item.id && "bg-accent",
              )}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Guide Lines */}
              <div className="absolute left-[-0.28rem] top-0 h-full flex items-center z-0">
                {item.ancestors.map((ancestor, index) => {
                  const parentIsLast = logDataWithMeta.find((d) => d.id === ancestor.id)?.isLast
                  return (
                    <div
                      key={index}
                      className={cn("w-[1.25rem] h-full", parentIsLast ? "" : "border-l", "border-border/50")}
                    />
                  )
                })}
                {item.indent > 0 && (
                  <div className="w-[1.24rem] h-full relative">
                    <div
                      className={cn(
                        "absolute top-0 left-0 w-1/2 h-1/2 border-b border-l",
                        item.isLast ? "rounded-bl-md" : "",
                        "border-border/50",
                      )}
                    />
                    {!item.isLast && <div className="absolute top-1/2 left-0 w-1/2 h-1/2 border-l border-border/50" />}
                  </div>
                )}
              </div>

              <div
                className="flex items-center gap-2 px-2 text-sm whitespace-nowrap w-full z-10"
                style={{ paddingLeft: `${item.indent * 1.25 + 0.5}rem` }}
              >
                <div className="relative size-4 flex items-center justify-center">
                  {item.isCollapsible && (
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <ChevronDown
                        className={cn("size-4 transition-transform", !expandedItems.has(item.id) && "-rotate-90")}
                      />
                    </button>
                  )}
                  <div className={cn("transition-opacity", item.isCollapsible && "group-hover:opacity-0")}>
                    {getIcon(item)}
                  </div>
                </div>
                <span className="truncate">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative overflow-x-auto">
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 bg-card">
            <div className="relative h-8 border-b">
              {timeMarkers.map((marker) => (
                <div
                  key={marker.time}
                  className="absolute top-0 h-full"
                  style={{ left: `${(marker.time / TOTAL_DURATION) * 100}%` }}
                >
                  <span className="absolute top-1 -translate-x-1/2 text-xs text-muted-foreground">{marker.label}</span>
                  <div className="h-full w-px bg-border" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Bars */}
          <div className="relative">
            {visibleLogData.map((item) => {
              const left =
                item.start !== undefined ? (item.start / TOTAL_DURATION) * 100 : (item.time! / TOTAL_DURATION) * 100
              const width = item.duration !== undefined ? (item.duration / TOTAL_DURATION) * 100 : 0

              const colorClasses = {
                blue: "bg-blue-500",
                green: "bg-green-500",
                orange: "bg-orange-500",
                "gray-light": "bg-muted",
              }

              return (
                <div
                  key={item.id}
                  className={cn("relative h-[32px] cursor-pointer", hoveredId === item.id && "bg-accent")}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Bar */}
                  {item.start !== undefined && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-5 rounded-sm flex items-center justify-center overflow-hidden",
                        item.color && colorClasses[item.color],
                        item.hasStripes &&
                          "bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(0,0,0,0.1)_4px,rgba(0,0,0,0.1)_8px)]",
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {item.duration && width > 5 && (
                        <span
                          className={cn(
                            "text-xs font-medium whitespace-nowrap",
                            item.color === "gray-light" ? "text-muted-foreground" : "text-white",
                          )}
                        >
                          {formatDuration(item.duration)}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Point */}
                  {item.time !== undefined && !item.start && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full"
                      style={{ left: `calc(${left}% - 4px)` }}
                    >
                      {getIcon(item)}
                    </div>
                  )}
                  {/* Connection Line from Bar */}
                  {item.connection && item.start !== undefined && item.duration !== undefined && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-2"
                      style={{
                        left: `${((item.start + item.duration) / TOTAL_DURATION) * 100}%`,
                        width: `${((item.connection.end - (item.start + item.duration)) / TOTAL_DURATION) * 100}%`,
                      }}
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                      <div
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 w-full h-px",
                          item.connection.type === "solid"
                            ? "bg-muted-foreground"
                            : "border-t border-dashed border-muted-foreground",
                        )}
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

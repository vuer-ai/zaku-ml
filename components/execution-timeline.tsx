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
  createTime?: number
  startTime?: number
  duration?: number
  time?: number
  color?: "blue" | "green" | "orange" | "gray-light"
  isCollapsible?: boolean
  hasStripes?: boolean
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
    createTime: 0,
    startTime: 0,
    duration: 20,
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
    createTime: 0.1,
    startTime: 0.1,
    duration: 19.9,
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
    createTime: 0.2,
    startTime: 0.5,
    duration: 3,
    color: "green",
  },
  {
    id: "4",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Job halted, waiting for resources...",
    icon: "pause-circle",
    startTime: 4,
    duration: 2,
  },
  {
    id: "5",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Waiting for image renderer...",
    icon: "file-code",
    createTime: 6.0,
    startTime: 6.5,
    duration: 7,
    color: "gray-light",
  },
  {
    id: "6",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Render charts",
    icon: "file-code",
    createTime: 13.5,
    startTime: 14,
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
    createTime: 18.6,
    startTime: 18.8,
    duration: 1.2,
    color: "green",
  },
]

const TOTAL_DURATION = 22
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
  { time: 20, label: "20s" },
  { time: 22, label: "22s" },
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

const borderColorClasses = {
  blue: "border-blue-500",
  green: "border-green-500",
  orange: "border-orange-500",
  "gray-light": "border-muted",
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
      <div className="grid grid-cols-[minmax(300px,30%)_1fr]">
        {/* Sidebar */}
        <div className="border-r flex flex-col">
          <div className="flex items-center p-1 border-b h-[32px]">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs"
              className="bg-transparent text-sm focus:outline-none w-full ml-2"
            />
          </div>
          <div className="overflow-y-auto">
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
                      {!item.isLast && (
                        <div className="absolute top-1/2 left-0 w-1/2 h-1/2 border-l border-border/50" />
                      )}
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
                  <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-card px-1 text-xs text-muted-foreground z-10">
                    {marker.label}
                  </span>
                  <div className="h-full w-px bg-border" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Bars */}
          <div className="relative pb-12">
            {visibleLogData.map((item) => {
              const colorClasses = {
                blue: "bg-blue-500",
                green: "bg-green-500",
                orange: "bg-orange-500",
                "gray-light": "bg-muted",
              }

              const isHaltedStep = item.id === "4"

              return (
                <div
                  key={item.id}
                  className={cn("relative h-[32px] cursor-pointer", hoveredId === item.id && "bg-accent")}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Launch Wait Dashed Line */}
                  {item.createTime !== undefined &&
                    item.startTime !== undefined &&
                    item.createTime < item.startTime && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-2"
                        style={{
                          left: `${(item.createTime / TOTAL_DURATION) * 100}%`,
                          width: `${((item.startTime - item.createTime) / TOTAL_DURATION) * 100}%`,
                        }}
                      >
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                        <div className="absolute top-1/2 -translate-y-1/2 w-full border-t border-dashed border-muted-foreground" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                      </div>
                    )}

                  {/* Execution Bar */}
                  {item.startTime !== undefined && item.duration !== undefined && !isHaltedStep && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-5 rounded-sm flex items-center justify-center overflow-hidden",
                        item.color && colorClasses[item.color],
                        item.hasStripes &&
                          "bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(0,0,0,0.1)_4px,rgba(0,0,0,0.1)_8px)]",
                      )}
                      style={{
                        left: `${(item.startTime / TOTAL_DURATION) * 100}%`,
                        width: `${(item.duration / TOTAL_DURATION) * 100}%`,
                      }}
                    >
                      {(item.duration / TOTAL_DURATION) * 100 > 5 && (
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

                  {/* Start Circle */}
                  {item.startTime !== undefined && item.duration !== undefined && !isHaltedStep && item.color && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full bg-card border-2 z-10",
                        borderColorClasses[item.color],
                      )}
                      style={{
                        left: `${(item.startTime / TOTAL_DURATION) * 100}%`,
                      }}
                    />
                  )}

                  {/* Special Halted Step Visualization */}
                  {isHaltedStep && item.startTime !== undefined && item.duration !== undefined && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-full flex items-center"
                      style={{
                        left: `${(item.startTime / TOTAL_DURATION) * 100}%`,
                        width: `${(item.duration / TOTAL_DURATION) * 100}%`,
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                        <div className="w-full border-t border-dashed border-muted-foreground" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                        <div className="absolute z-10 px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs font-medium whitespace-nowrap">
                          {formatDuration(item.duration)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Point in Time Event */}
                  {item.time !== undefined && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full"
                      style={{ left: `calc(${(item.time / TOTAL_DURATION) * 100}% - 4px)` }}
                    >
                      {getIcon(item)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="sticky bottom-4 left-1/2 -translate-x-1/2 z-20 w-max">
            <div className="flex items-center gap-2 text-sm bg-card border rounded-full p-1 shadow-lg">
              <button className="p-1 hover:bg-accent rounded-full">
                <ChevronLeft className="size-4" />
              </button>
              <span>0.0s</span>
              <button className="p-1 hover:bg-accent rounded-full">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

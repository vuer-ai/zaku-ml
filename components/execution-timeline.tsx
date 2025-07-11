"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, ChevronDown, Info, RefreshCw, Cloud, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type LogItemData = {
  id: string
  parentId: string | null
  indent: number
  type: "task" | "attempt" | "info" | "step"
  label: string
  badge?: string
  icon?: "ffmpeg" | "swirl" | "aws"
  start?: number
  duration?: number
  time?: number
  color?: "blue" | "green" | "gray-dark" | "gray-light"
  isCollapsible?: boolean
  connection?: {
    type: "solid" | "dashed"
    end: number
  }
}

const logData: LogItemData[] = [
  {
    id: "1",
    parentId: null,
    indent: 0,
    type: "task",
    label: "transcribe-video",
    badge: "ROOT",
    start: 1,
    duration: 23,
    color: "blue",
    isCollapsible: true,
  },
  {
    id: "2",
    parentId: "1",
    indent: 1,
    type: "attempt",
    label: "Attempt 1",
    start: 1.5,
    duration: 22.5,
    color: "gray-dark",
    isCollapsible: true,
  },
  {
    id: "3",
    parentId: "2",
    indent: 2,
    type: "task",
    label: "extract-audio",
    start: 2,
    duration: 10,
    color: "green",
    isCollapsible: true,
  },
  {
    id: "4",
    parentId: "3",
    indent: 3,
    type: "attempt",
    label: "Attempt 1",
    start: 2.5,
    duration: 9.5,
    color: "green",
    isCollapsible: true,
  },
  {
    id: "5",
    parentId: "4",
    indent: 4,
    type: "info",
    label: "Fetch video from URL",
    time: 3.5,
    connection: { type: "solid", end: 4.5 },
  },
  {
    id: "6",
    parentId: "4",
    indent: 4,
    type: "step",
    icon: "ffmpeg",
    label: "Extract audio using FFmpeg",
    start: 5,
    duration: 4,
    color: "gray-light",
  },
  {
    id: "7",
    parentId: "2",
    indent: 2,
    type: "task",
    label: "transcribe-audio",
    start: 8.5,
    duration: 9.5,
    color: "blue",
    isCollapsible: true,
  },
  {
    id: "8",
    parentId: "7",
    indent: 3,
    type: "attempt",
    label: "Attempt 1",
    start: 9,
    duration: 9,
    color: "blue",
    isCollapsible: true,
  },
  {
    id: "9",
    parentId: "8",
    indent: 4,
    type: "step",
    icon: "swirl",
    label: "transcribe.audio()",
    start: 9.5,
    duration: 1.5,
    color: "gray-light",
  },
  {
    id: "10",
    parentId: "8",
    indent: 4,
    type: "info",
    label: "Audio summary created",
    time: 11.5,
    connection: { type: "dashed", end: 13 },
  },
  {
    id: "11",
    parentId: "2",
    indent: 2,
    type: "task",
    label: "upload-to-s3",
    start: 13.5,
    duration: 6.5,
    color: "gray-dark",
    isCollapsible: true,
  },
  {
    id: "12",
    parentId: "11",
    indent: 3,
    type: "attempt",
    label: "Attempt 1",
    start: 14,
    duration: 6,
    color: "gray-dark",
    isCollapsible: true,
  },
  {
    id: "13",
    parentId: "12",
    indent: 4,
    type: "step",
    icon: "aws",
    label: "s3.upload()",
    time: 15,
    connection: { type: "dashed", end: 18 },
  },
  { id: "14", parentId: "12", indent: 4, type: "info", label: "Transcribed audio file upload", time: 20.5 },
]

const TOTAL_DURATION = 24
const timeMarkers = [
  { time: 0, label: "0.0s" },
  { time: 5.1, label: "5.1s" },
  { time: 6, label: "6s" },
  { time: 12, label: "12s" },
  { time: 18, label: "18s" },
  { time: 24, label: "24s" },
]

const getIcon = (item: LogItemData) => {
  switch (item.type) {
    case "task":
      return (
        <div className="bg-blue-500 text-white text-xs font-bold size-4 flex items-center justify-center rounded-sm shrink-0">
          T
        </div>
      )
    case "attempt":
      return (
        <div className="bg-gray-600 text-white text-xs font-bold size-4 flex items-center justify-center rounded-sm shrink-0">
          A
        </div>
      )
    case "info":
      return <Info className="size-4 text-gray-400 shrink-0" />
    case "step":
      switch (item.icon) {
        case "ffmpeg":
          return <Check className="size-4 text-green-400 shrink-0" />
        case "swirl":
          return <RefreshCw className="size-4 text-gray-400 shrink-0" />
        case "aws":
          return <Cloud className="size-4 text-orange-400 shrink-0" />
        default:
          return <div className="size-4" />
      }
    default:
      return <div className="size-4" />
  }
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
    <div className="bg-[#111113] text-gray-300 font-sans rounded-lg border border-gray-800 w-full max-w-7xl mx-auto shadow-2xl overflow-hidden">
      <div className="flex items-center p-2 border-b border-gray-800">
        <div className="flex items-center gap-2 flex-1">
          <Search className="size-4 text-gray-500" />
          <input type="text" placeholder="Search logs" className="bg-transparent text-sm focus:outline-none w-full" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button className="p-1 hover:bg-gray-700 rounded">
            <ChevronLeft className="size-4" />
          </button>
          <span>0.0s</span>
          <button className="p-1 hover:bg-gray-700 rounded">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(300px,30%)_1fr]">
        {/* Sidebar */}
        <div className="border-r border-gray-800 overflow-x-auto">
          <div className="h-8" /> {/* Spacer for timeline header */}
          {visibleLogData.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center relative group cursor-pointer",
                hoveredId === item.id && "bg-gray-800/50",
              )}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Guide Lines */}
              <div className="absolute left-[-0.28rem] top-0 h-full flex items-center z-10">
                {item.ancestors.map((ancestor, index) => {
                  const parentIsLast = logDataWithMeta.find((d) => d.id === ancestor.id)?.isLast
                  return (
                    <div
                      key={index}
                      className={cn("w-[1.25rem] h-full", parentIsLast ? "" : "border-l", "border-gray-700")}
                    />
                  )
                })}
                {item.indent > 0 && (
                  <div className="w-[1.24rem] h-full relative">
                    <div
                      className={cn(
                        "absolute top-0 left-0 w-1/2 h-1/2 border-b border-l",
                        item.isLast ? "rounded-bl-md" : "",
                        "border-gray-700",
                      )}
                    />
                    {!item.isLast && <div className="absolute top-1/2 left-0 w-1/2 h-1/2 border-l border-gray-700" />}
                  </div>
                )}
              </div>

              <div
                className="flex items-center gap-2 px-2 py-1.5 text-sm whitespace-nowrap w-full z-0"
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
                  <div className="group-hover:opacity-0 transition-opacity">{getIcon(item)}</div>
                </div>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-md font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative overflow-x-auto">
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 bg-[#111113]">
            <div className="relative h-8 border-b border-gray-800">
              {timeMarkers.map((marker) => (
                <div
                  key={marker.time}
                  className="absolute top-0 h-full"
                  style={{ left: `${(marker.time / TOTAL_DURATION) * 100}%` }}
                >
                  <span className="absolute top-1 -translate-x-1/2 text-xs text-gray-500">{marker.label}</span>
                  <div className="h-full w-px bg-gray-800" />
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
                blue: "bg-blue-500/80",
                green: "bg-lime-400",
                "gray-dark": "bg-gray-500/80",
                "gray-light": "bg-gray-700",
              }

              const stripeClasses = {
                blue: "bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(0,0,0,0.1)_4px,rgba(0,0,0,0.1)_8px)]",
                "gray-dark":
                  "bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(0,0,0,0.2)_4px,rgba(0,0,0,0.2)_8px)]",
              }

              return (
                <div
                  key={item.id}
                  className={cn("relative h-[30px] cursor-pointer", hoveredId === item.id && "bg-gray-800/50")}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Bar */}
                  {item.start !== undefined && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-4 rounded-sm",
                        item.color && colorClasses[item.color],
                        item.color && stripeClasses[item.color as keyof typeof stripeClasses],
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-full w-px bg-blue-400">
                        <div className="absolute -left-px top-1/2 -translate-y-1/2 h-px w-2 bg-blue-400" />
                      </div>
                    </div>
                  )}
                  {/* Point */}
                  {item.time !== undefined && !item.start && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 size-1.5 bg-gray-500 rounded-full"
                      style={{ left: `calc(${left}% - 3px)` }}
                    />
                  )}
                  {/* Connection Line */}
                  {item.connection && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-px",
                        item.connection.type === "solid" ? "bg-gray-600" : "border-t border-dashed border-gray-600",
                      )}
                      style={{
                        left: `${(item.time! / TOTAL_DURATION) * 100}%`,
                        width: `${((item.connection.end - item.time!) / TOTAL_DURATION) * 100}%`,
                      }}
                    >
                      <div className="absolute -left-px top-1/2 -translate-y-1/2 h-2 w-px bg-gray-600" />
                      <div className="absolute -right-px top-1/2 -translate-y-1/2 h-2 w-px bg-gray-600" />
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

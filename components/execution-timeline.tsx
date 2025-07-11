"use client"

import { useState, useMemo } from "react"
import { ChevronDown, History, FileCode2, Server, CheckCircle2, PauseCircle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

type LogItemData = {
  id: string
  parentId: string | null
  indent: number
  type: "task" | "attempt" | "info" | "step"
  label: string
  icon: "queue" | "task" | "attempt" | "success" | "halted" | "generic"
  start?: number
  duration?: number
  time?: number
  color?: "blue" | "green" | "yellow" | "gray"
  isCollapsible?: boolean
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
    icon: "queue",
    time: 0.5,
  },
  {
    id: "1",
    parentId: null,
    indent: 0,
    type: "task",
    label: "generate-report",
    icon: "task",
    start: 1,
    duration: 17,
    color: "blue",
    isCollapsible: true,
  },
  {
    id: "2",
    parentId: "1",
    indent: 1,
    type: "attempt",
    label: "Attempt 1",
    icon: "attempt",
    start: 1.5,
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
    icon: "success",
    start: 2,
    duration: 3,
    color: "green",
  },
  {
    id: "4",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Job halted, waiting for resources...",
    icon: "halted",
    start: 5.5,
    duration: 2,
    color: "yellow",
  },
  {
    id: "5",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Waiting for image renderer...",
    icon: "generic",
    start: 8,
    duration: 7,
    color: "gray",
  },
  {
    id: "6",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Render charts",
    icon: "generic",
    start: 15.5,
    duration: 4.6,
    color: "blue",
  },
  {
    id: "7",
    parentId: "2",
    indent: 2,
    type: "step",
    label: "Assemble PDF",
    icon: "generic",
    start: 16,
    duration: 2,
    color: "gray",
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
  const iconProps = { className: "size-4 shrink-0" }
  switch (item.icon) {
    case "queue":
      return <History {...iconProps} color="#A855F7" />
    case "task":
      return <FileCode2 {...iconProps} color="#2563EB" />
    case "attempt":
      return <Server {...iconProps} className="size-4 shrink-0 text-gray-500" />
    case "success":
      return <CheckCircle2 {...iconProps} color="#22C55E" />
    case "halted":
      return <PauseCircle {...iconProps} color="#F97316" />
    case "generic":
      return <FileText {...iconProps} className="size-4 shrink-0 text-gray-500" />
    default:
      return <div className="size-4" />
  }
}

const formatDuration = (seconds: number) => {
  if (seconds < 0.1) {
    return `${Math.round(seconds * 1000)}ms`
  }
  if (seconds < 10) {
    return `${seconds.toFixed(2)}s`
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
    if (item.ancestors.length === 0) return true
    return item.ancestors.every((ancestor) => expandedItems.has(ancestor.id))
  }

  const visibleLogData = logDataWithMeta.filter(isVisible)

  return (
    <div className="bg-white text-gray-800 font-sans rounded-lg border w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
      <div className="grid grid-cols-[minmax(300px,35%)_1fr]">
        {/* Sidebar */}
        <div className="border-r border-gray-200 overflow-x-auto">
          <div className="h-8" /> {/* Spacer for timeline header */}
          {visibleLogData.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center relative group cursor-pointer h-[32px]",
                hoveredId === item.id && "bg-gray-100",
              )}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Guide Lines */}
              <div className="absolute left-0 top-0 h-full flex items-center z-0">
                {item.ancestors.map((ancestor, index) => {
                  const parentIsLast = logDataWithMeta.find((d) => d.id === ancestor.id)?.isLast
                  return (
                    <div
                      key={index}
                      className={cn("w-[20px] h-full", parentIsLast ? "" : "border-l-2", "border-gray-200")}
                    />
                  )
                })}
                {item.indent > 0 && (
                  <div className="w-[20px] h-full relative">
                    <div
                      className={cn(
                        "absolute top-0 left-[9px] w-1/2 h-1/2 border-b-2 border-l-2",
                        item.isLast ? "rounded-bl-md" : "",
                        "border-gray-200",
                      )}
                    />
                    {!item.isLast && (
                      <div className="absolute top-1/2 left-[9px] w-1/2 h-1/2 border-l-2 border-gray-200" />
                    )}
                  </div>
                )}
              </div>

              <div
                className="flex items-center gap-2 pr-2 text-sm whitespace-nowrap w-full z-10 bg-white group-hover:bg-gray-100"
                style={{ paddingLeft: `${item.indent * 20 + 8}px` }}
              >
                <div className="relative size-4 flex items-center justify-center">
                  {item.isCollapsible && (
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform text-gray-400",
                          !expandedItems.has(item.id) && "-rotate-90",
                        )}
                      />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getIcon(item)}
                  <span className="truncate">{item.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative overflow-x-auto">
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
            <div className="relative h-8 border-b border-gray-200">
              {timeMarkers.map((marker) => (
                <div
                  key={marker.time}
                  className="absolute top-0 h-full"
                  style={{ left: `${(marker.time / TOTAL_DURATION) * 100}%` }}
                >
                  <span className="absolute top-1 -translate-x-1/2 text-xs text-gray-500">{marker.label}</span>
                  <div className="h-full w-px bg-gray-200" />
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
                blue: "bg-timeline-blue",
                green: "bg-timeline-green",
                yellow: "bg-timeline-yellow",
                gray: "bg-timeline-gray",
              }

              return (
                <div
                  key={item.id}
                  className={cn("relative h-[32px] cursor-pointer", hoveredId === item.id && "bg-gray-100")}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Bar */}
                  {item.start !== undefined && item.duration !== undefined && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-6 rounded-md flex items-center justify-end pr-2",
                        item.color && colorClasses[item.color],
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {item.id === "1" && (
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(0,0,0,0.05)_4px,rgba(0,0,0,0.05)_8px)]" />
                      )}
                      <span className="text-xs text-gray-800 font-medium relative">
                        {formatDuration(item.duration)}
                      </span>
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

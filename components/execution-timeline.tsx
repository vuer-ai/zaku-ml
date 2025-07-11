"use client"

import { useState, useMemo } from "react"
import { ChevronDown, History, FileCode2, Cpu, CheckCircle2, PauseCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type LogItemData = {
  id: string
  parentId: string | null
  indent: number
  type: "task" | "attempt" | "info" | "step"
  label: string
  icon: "history" | "file-code" | "cpu" | "check-circle" | "pause-circle"
  start?: number
  duration?: number
  time?: number
  color: "purple" | "blue" | "gray" | "green" | "yellow"
  isCollapsible?: boolean
}

const logData: LogItemData[] = [
  {
    id: "0",
    parentId: null,
    indent: 0,
    type: "info",
    label: "Job registered in queue",
    icon: "history",
    time: 0.5,
    color: "purple",
  },
  {
    id: "1",
    parentId: null,
    indent: 0,
    type: "task",
    label: "generate-report",
    icon: "file-code",
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
    icon: "cpu",
    start: 1.1,
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
    icon: "pause-circle",
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
    icon: "file-code",
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
    icon: "file-code",
    start: 12,
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
    start: 15.5,
    duration: 2,
    color: "blue",
  },
]

const TOTAL_DURATION = 18
const timeMarkers = Array.from({ length: 10 }, (_, i) => ({ time: i * 2, label: `${i * 2}s` }))

const getIcon = (item: LogItemData) => {
  const iconProps = {
    className: cn("size-4 shrink-0", {
      "text-purple-500": item.color === "purple",
      "text-blue-500": item.color === "blue",
      "text-gray-500": item.color === "gray",
      "text-green-500": item.color === "green",
      "text-yellow-500": item.color === "yellow",
    }),
  }

  switch (item.icon) {
    case "history":
      return <History {...iconProps} />
    case "file-code":
      return <FileCode2 {...iconProps} />
    case "cpu":
      return <Cpu {...iconProps} />
    case "check-circle":
      return <CheckCircle2 {...iconProps} />
    case "pause-circle":
      return <PauseCircle {...iconProps} />
    default:
      return <div className="size-4" />
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
    <div className="bg-background text-foreground font-sans rounded-lg border w-full max-w-4xl mx-auto shadow-sm overflow-hidden">
      <div className="grid grid-cols-[minmax(300px,35%)_1fr]">
        {/* Sidebar */}
        <div className="border-r overflow-x-auto bg-background">
          <div className="h-8" /> {/* Spacer for timeline header */}
          {visibleLogData.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center relative group cursor-pointer h-[34px]",
                hoveredId === item.id && "bg-muted",
              )}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Guide Lines */}
              <div className="absolute left-0 top-0 h-full flex items-center z-0">
                {item.ancestors.map((ancestor, index) => {
                  const parentIsLast = logDataWithMeta.find((d) => d.id === ancestor.id)?.isLast
                  return (
                    <div key={index} className={cn("w-6 h-full", parentIsLast ? "" : "border-l", "border-border/50")} />
                  )
                })}
                {item.indent > 0 && (
                  <div className="w-6 h-full relative">
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
                className="flex items-center gap-2 pr-2 text-sm whitespace-nowrap w-full z-10"
                style={{ paddingLeft: `${item.indent * 1.5 + 0.5}rem` }}
              >
                <div className="relative size-4 flex items-center justify-center">
                  {item.isCollapsible && (
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center"
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform text-muted-foreground",
                          !expandedItems.has(item.id) && "-rotate-90",
                        )}
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
        <div className="relative overflow-x-auto bg-background">
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
            <div className="relative h-8 border-b">
              {timeMarkers.map((marker) => (
                <div
                  key={marker.time}
                  className="absolute top-0 h-full"
                  style={{ left: `${(marker.time / TOTAL_DURATION) * 100}%` }}
                >
                  <span className="absolute top-1.5 -translate-x-1/2 text-xs text-muted-foreground">
                    {marker.label}
                  </span>
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
                purple: "bg-purple-500/20 text-purple-800 dark:text-purple-300",
                blue: "bg-blue-500/20 text-blue-800 dark:text-blue-300",
                gray: "bg-gray-500/20 text-gray-800 dark:text-gray-300",
                green: "bg-green-500/20 text-green-800 dark:text-green-300",
                yellow: "bg-yellow-500/20 text-yellow-800 dark:text-yellow-300",
              }

              const stripeClasses = {
                blue: "bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(60,130,255,0.1)_4px,rgba(60,130,255,0.1)_8px)]",
              }

              return (
                <div
                  key={item.id}
                  className={cn("relative h-[34px] cursor-pointer", hoveredId === item.id && "bg-muted")}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Bar */}
                  {item.start !== undefined && item.duration !== undefined && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-6 rounded-md flex items-center justify-end px-2 overflow-hidden",
                        colorClasses[item.color],
                        item.id === "1" && stripeClasses.blue,
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {width > 15 && (
                        <span className="text-xs font-medium whitespace-nowrap">{formatDuration(item.duration)}</span>
                      )}
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

"use client"

import type React from "react"

import { useState, useMemo, useRef } from "react"
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
  color?: "blue" | "green" | "orange" | "gray-light" | "gray-medium"
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
    color: "gray-medium",
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
  if (seconds < 0.01) {
    return `${(seconds * 1000).toFixed(2)}ms`
  }
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
  "gray-medium": "border-slate-400 dark:border-slate-600",
}

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  "gray-light": "bg-muted",
  "gray-medium": "bg-slate-400 dark:bg-slate-700",
}

const leftWedgeClasses = {
  blue: "border-l-blue-500",
  green: "border-l-green-500",
  orange: "border-l-orange-500",
  "gray-light": "border-l-slate-300 dark:border-l-slate-600",
  "gray-medium": "border-l-slate-400 dark:border-l-slate-500",
}

const rightWedgeClasses = {
  blue: "border-r-blue-500",
  green: "border-r-green-500",
  orange: "border-r-orange-500",
  "gray-light": "border-r-slate-300 dark:border-r-slate-600",
  "gray-medium": "border-r-slate-400 dark:border-r-slate-500",
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

  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const [viewStart, setViewStart] = useState(-TOTAL_DURATION * 0.25)
  const [viewDuration, setViewDuration] = useState(TOTAL_DURATION * 1.5)

  const timeToPercent = (time: number) => ((time - viewStart) / viewDuration) * 100

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const container = timelineContainerRef.current
    if (!container) return

    if (e.ctrlKey || e.altKey) {
      // Zooming
      const rect = container.getBoundingClientRect()
      const cursorX = e.clientX - rect.left
      const timeAtCursor = viewStart + (cursorX / container.offsetWidth) * viewDuration
      const zoomFactor = 1.1
      const newDuration = e.deltaY < 0 ? viewDuration / zoomFactor : viewDuration * zoomFactor
      const minDuration = 0.01 // 10ms
      const maxDuration = TOTAL_DURATION * 10
      if (newDuration < minDuration || newDuration > maxDuration) return
      const newViewStart = timeAtCursor - (cursorX / container.offsetWidth) * newDuration
      setViewDuration(newDuration)
      setViewStart(newViewStart)
    } else {
      // Panning
      const panX = (e.deltaX / container.offsetWidth) * viewDuration
      const panY = (e.deltaY / container.offsetWidth) * viewDuration
      setViewStart((s) => s + panX + panY)
    }
  }

  const handlePan = (direction: "left" | "right") => {
    const panAmount = viewDuration * 0.1
    if (direction === "left") {
      setViewStart((s) => s - panAmount)
    } else {
      setViewStart((s) => s + panAmount)
    }
  }

  const dynamicTimeMarkers = useMemo(() => {
    const markers = []
    const niceIntervals = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100]
    const targetMarkerCount = 10
    const rawInterval = viewDuration / targetMarkerCount
    const interval = niceIntervals.find((i) => i > rawInterval) || niceIntervals[niceIntervals.length - 1]
    const firstMarkerTime = Math.ceil(viewStart / interval) * interval

    const shownSeconds = new Set<number>()

    const formatTickLabel = (seconds: number) => {
      const sign = seconds < 0 ? "-" : ""
      const absSeconds = Math.abs(seconds)

      let s = Math.floor(absSeconds)
      let ms = Math.round((absSeconds - s) * 1000)

      if (ms >= 1000) {
        s += 1
        ms -= 1000
      }

      if (absSeconds < 1) {
        return `${sign}${ms}ms`
      }

      const baseSecond = s * (sign === "-" ? -1 : 1)
      if (shownSeconds.has(baseSecond)) {
        return ms > 0 ? `+${ms}ms` : ""
      }

      shownSeconds.add(baseSecond)
      if (ms === 0) {
        return `${sign}${s}s`
      }

      return `${sign}${s}s`
    }

    for (let time = firstMarkerTime; time < viewStart + viewDuration; time += interval) {
      const label = formatTickLabel(time)
      if (label) {
        markers.push({ time, label })
      }
    }
    return markers
  }, [viewStart, viewDuration])

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
        <div
          className="relative overflow-x-hidden cursor-grab active:cursor-grabbing"
          ref={timelineContainerRef}
          onWheel={handleWheel}
        >
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 bg-card">
            <div className="relative h-8 border-b">
              {dynamicTimeMarkers.map((marker) => (
                <div
                  key={marker.time}
                  className="absolute top-0 h-full"
                  style={{ left: `${timeToPercent(marker.time)}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-1 rounded-sm text-xs text-muted-foreground z-10">
                    {marker.label}
                  </div>
                  <div className="h-full w-px bg-border" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Bars */}
          <div className="relative pb-12">
            {visibleLogData.map((item) => {
              const isHaltedStep = item.id === "4"
              const barStart = item.startTime
              const barEnd =
                item.startTime !== undefined && item.duration !== undefined ? item.startTime + item.duration : undefined
              const viewEnd = viewStart + viewDuration

              const isClippedLeft =
                barStart !== undefined && barEnd !== undefined && barStart < viewStart && barEnd > viewStart
              const isClippedRight =
                barStart !== undefined && barEnd !== undefined && barStart < viewEnd && barEnd > viewEnd

              return (
                <div
                  key={item.id}
                  className={cn("relative h-[32px]", hoveredId === item.id && "bg-accent")}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Launch Wait Line */}
                  {item.createTime !== undefined &&
                    item.startTime !== undefined &&
                    item.createTime < item.startTime &&
                    item.color && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-2"
                        style={{
                          left: `${timeToPercent(item.createTime)}%`,
                          width: `${((item.startTime - item.createTime) / viewDuration) * 100}%`,
                        }}
                      >
                        <div
                          className={cn("absolute left-0 top-1/2 -translate-y-1/2 h-2 w-px", colorClasses[item.color])}
                        />
                        <div
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-full border-t",
                            borderColorClasses[item.color],
                          )}
                        />
                        <div
                          className={cn("absolute right-0 top-1/2 -translate-y-1/2 h-2 w-px", colorClasses[item.color])}
                        />
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
                        left: `${timeToPercent(item.startTime)}%`,
                        width: `${(item.duration / viewDuration) * 100}%`,
                      }}
                    />
                  )}

                  {/* Visible Label for Execution Bar */}
                  {item.startTime !== undefined &&
                    item.duration !== undefined &&
                    !isHaltedStep &&
                    (() => {
                      const visibleStart = Math.max(barStart, viewStart)
                      const visibleEnd = Math.min(barEnd, viewEnd)

                      if (visibleEnd <= visibleStart) return null

                      const visibleDuration = visibleEnd - visibleStart
                      const visibleWidthPercent = (visibleDuration / viewDuration) * 100

                      if (visibleWidthPercent < 4) return null

                      return (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-5 flex items-center justify-center pointer-events-none"
                          style={{
                            left: `${timeToPercent(visibleStart)}%`,
                            width: `${visibleWidthPercent}%`,
                          }}
                        >
                          <span
                            className={cn(
                              "text-xs font-medium whitespace-nowrap",
                              item.color === "gray-light" || item.color === "gray-medium"
                                ? "text-slate-600 dark:text-slate-300"
                                : "text-white",
                            )}
                          >
                            {formatDuration(item.duration)}
                          </span>
                        </div>
                      )
                    })()}

                  {/* Start Circle */}
                  {item.startTime !== undefined && item.duration !== undefined && !isHaltedStep && item.color && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2 rounded-full bg-card border-2 z-10",
                        borderColorClasses[item.color],
                      )}
                      style={{
                        left: `${timeToPercent(item.startTime)}%`,
                      }}
                    />
                  )}

                  {/* Left Wedge Indicator */}
                  {isClippedLeft && item.color && (
                    <div
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-l-[8px]",
                        leftWedgeClasses[item.color],
                      )}
                    />
                  )}

                  {/* Right Wedge Indicator */}
                  {isClippedRight && item.color && (
                    <div
                      className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-r-[8px]",
                        rightWedgeClasses[item.color],
                      )}
                    />
                  )}

                  {/* Special Halted Step Visualization */}
                  {isHaltedStep && item.startTime !== undefined && item.duration !== undefined && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-full flex items-center"
                      style={{
                        left: `${timeToPercent(item.startTime)}%`,
                        width: `${(item.duration / viewDuration) * 100}%`,
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                        <div className="w-full border-t border-dashed border-muted-foreground" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-px bg-muted-foreground" />
                        <div className="absolute z-10 px-1 rounded-full bg-orange-500 text-white text-[9px] leading-tight font-medium whitespace-nowrap">
                          {formatDuration(item.duration)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Point in Time Event */}
                  {item.time !== undefined && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full"
                      style={{ left: `calc(${timeToPercent(item.time)}% - 4px)` }}
                    >
                      {getIcon(item)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {/* Left Wedges */}
          <div className="absolute top-0 left-0 h-full w-2 pointer-events-none z-10">
            {visibleLogData.map((item, index) => {
              const barStart = item.startTime
              const barEnd =
                item.startTime !== undefined && item.duration !== undefined ? item.startTime + item.duration : undefined
              const isClippedLeft =
                barStart !== undefined && barEnd !== undefined && barStart < viewStart && barEnd > viewStart

              if (isClippedLeft && item.color) {
                return (
                  <div
                    key={`left-wedge-${item.id}`}
                    className={cn(
                      "absolute w-0 h-0 border-y-[10px] border-y-transparent border-l-[8px]",
                      leftWedgeClasses[item.color],
                    )}
                    style={{ top: `${index * 32 + 16}px`, transform: "translateY(-50%)" }}
                  />
                )
              }
              return null
            })}
          </div>

          {/* Right Wedges */}
          <div className="absolute top-0 right-0 h-full w-2 pointer-events-none z-10">
            {visibleLogData.map((item, index) => {
              const barStart = item.startTime
              const barEnd =
                item.startTime !== undefined && item.duration !== undefined ? item.startTime + item.duration : undefined
              const viewEnd = viewStart + viewDuration
              const isClippedRight =
                barStart !== undefined && barEnd !== undefined && barStart < viewEnd && barEnd > viewEnd

              if (isClippedRight && item.color) {
                return (
                  <div
                    key={`right-wedge-${item.id}`}
                    className={cn(
                      "absolute w-0 h-0 border-y-[10px] border-y-transparent border-r-[8px]",
                      rightWedgeClasses[item.color],
                    )}
                    style={{ top: `${index * 32 + 16}px`, transform: "translateY(-50%)" }}
                  />
                )
              }
              return null
            })}
          </div>
          <div className="sticky bottom-4 left-1/2 -translate-x-1/2 z-20 w-max">
            <div className="flex items-center gap-2 text-sm bg-card border rounded-full p-1 shadow-lg">
              <button onClick={() => handlePan("left")} className="p-1 hover:bg-accent rounded-full">
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs w-20 text-center font-mono">{formatDuration(viewDuration)}</span>
              <button onClick={() => handlePan("right")} className="p-1 hover:bg-accent rounded-full">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

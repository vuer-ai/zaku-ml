"use client"

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCode,
  History,
  Info,
  Magnet,
  PauseCircle,
  Search,
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
  color?: "blue" | "green" | "orange" | "gray-light" | "gray-medium" | "purple"
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
    color: "purple",
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
    color: "orange",
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
  const sign = seconds < 0 ? "-" : ""
  const absSeconds = Math.abs(seconds)

  if (absSeconds < 0.01) {
    return `${sign}${(absSeconds * 1000).toFixed(2)}ms`
  }
  if (absSeconds < 1) {
    return `${sign}${Math.round(absSeconds * 1000)}ms`
  }
  if (absSeconds < 60) {
    return `${sign}${absSeconds.toFixed(3)}s`
  }

  const hours = Math.floor(absSeconds / 3600)
  const minutes = Math.floor((absSeconds % 3600) / 60)
  const remainingSeconds = absSeconds % 60

  const parts = []
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  if (remainingSeconds > 1e-3 || (hours === 0 && minutes === 0)) {
    const secStr = hours > 0 || minutes > 0 ? remainingSeconds.toFixed(1) : remainingSeconds.toFixed(2)
    const secNum = Number.parseFloat(secStr)
    if (secNum > 0) {
      parts.push(`${secNum}s`)
    }
  }

  if (parts.length === 0) {
    return "0s"
  }

  return sign + parts.join(" ")
}

const borderColorClasses = {
  blue: "border-blue-500",
  green: "border-green-500",
  orange: "border-orange-500",
  purple: "border-purple-500",
  "gray-light": "border-muted",
  "gray-medium": "border-slate-400 dark:border-slate-600",
}

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  "gray-light": "bg-muted",
  "gray-medium": "bg-slate-400 dark:bg-slate-700",
}

const leftWedgeClasses = {
  blue: "border-l-blue-500",
  green: "border-l-green-500",
  orange: "border-l-orange-500",
  purple: "border-l-purple-500",
  "gray-light": "border-l-slate-300 dark:border-l-slate-600",
  "gray-medium": "border-l-slate-400 dark:border-l-slate-500",
}

const rightWedgeClasses = {
  blue: "border-r-blue-500",
  green: "border-r-green-500",
  orange: "border-r-orange-500",
  purple: "border-r-purple-500",
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

  const timeMarkers = useMemo(() => {
    const markers: { time: number; label: string }[] = []
    const niceIntervals = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100]
    const targetMarkerCount = 10
    const rawInterval = viewDuration / targetMarkerCount
    const interval = niceIntervals.find((i) => i > rawInterval) || niceIntervals[niceIntervals.length - 1]

    const viewEnd = viewStart + viewDuration
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

      if (absSeconds < 1 && absSeconds > -1) {
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

    const firstMarkerTime = Math.floor(viewStart / interval) * interval
    const lastMarkerTime = Math.ceil(viewEnd / interval) * interval

    for (let time = firstMarkerTime; time <= lastMarkerTime; time += interval) {
      const roundedTime = Number.parseFloat(time.toPrecision(15))
      const label = formatTickLabel(roundedTime)
      if (label) {
        markers.push({ time: roundedTime, label })
      }
    }
    return markers
  }, [viewStart, viewDuration])

  const keyEventTimes = useMemo(() => {
    const events: { time: number; type: string }[] = []
    const timeSet = new Set<string>()

    const addEvent = (time: number, type: string) => {
      const key = `${time.toFixed(6)}-${type}`
      if (!timeSet.has(key)) {
        events.push({ time, type })
        timeSet.add(key)
      }
    }

    visibleLogData.forEach((item) => {
      if (item.createTime !== undefined) addEvent(item.createTime, "create")
      if (item.startTime !== undefined) addEvent(item.startTime, "start")
      if (item.startTime !== undefined && item.duration !== undefined) {
        addEvent(item.startTime + item.duration, "end")
      }
      if (item.time !== undefined) addEvent(item.time, "event")
    })
    return events.sort((a, b) => a.time - b.time)
  }, [visibleLogData])

  const cursorContainerRef = useRef<HTMLDivElement>(null)
  const lastClientX = useRef(0)
  const isMouseOver = useRef(false)
  const animationFrameRef = useRef<number | null>(null)

  const updateCursor = useCallback(() => {
    if (!isMouseOver.current) return

    const timelineEl = timelineContainerRef.current
    const cursorEl = cursorContainerRef.current
    if (!timelineEl || !cursorEl) return

    const rect = timelineEl.getBoundingClientRect()
    const cursorX = lastClientX.current - rect.left
    const rawHoverTime = viewStart + (cursorX / timelineEl.offsetWidth) * viewDuration

    // Snapping logic
    const snapThresholdInPixels = 8
    const snapThresholdInTime = (snapThresholdInPixels / timelineEl.offsetWidth) * viewDuration

    let closestSnap: { time: number; type: string } | null = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const event of keyEventTimes) {
      const distance = Math.abs(event.time - rawHoverTime)
      if (distance < minDistance && distance < snapThresholdInTime) {
        minDistance = distance
        closestSnap = event
      }
    }

    const displayTime = closestSnap?.time ?? rawHoverTime
    const percent = timeToPercent(displayTime)

    cursorEl.style.setProperty("--cursor-left", `${percent}%`)
    cursorEl.style.setProperty("--readout-text", `"${formatDuration(displayTime)}"`)
    cursorEl.style.setProperty("--magnet-opacity", closestSnap ? "1" : "0")
    cursorEl.classList.remove("opacity-0")
  }, [viewStart, viewDuration, keyEventTimes])

  useEffect(() => {
    const timelineEl = timelineContainerRef.current
    if (!timelineEl) return

    const handleMouseMove = (e: MouseEvent) => {
      lastClientX.current = e.clientX
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = requestAnimationFrame(updateCursor)
    }

    const handleMouseEnter = () => {
      isMouseOver.current = true
    }

    const handleMouseLeave = () => {
      isMouseOver.current = false
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      cursorContainerRef.current?.classList.add("opacity-0")
    }

    timelineEl.addEventListener("mousemove", handleMouseMove)
    timelineEl.addEventListener("mouseenter", handleMouseEnter)
    timelineEl.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      timelineEl.removeEventListener("mousemove", handleMouseMove)
      timelineEl.removeEventListener("mouseenter", handleMouseEnter)
      timelineEl.removeEventListener("mouseleave", handleMouseLeave)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [updateCursor])

  // This effect handles cursor updates on pan/zoom
  useEffect(() => {
    if (isMouseOver.current) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = requestAnimationFrame(updateCursor)
    }
  }, [viewStart, viewDuration, updateCursor])

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
          className="relative overflow-x-hidden cursor-crosshair active:cursor-grabbing"
          ref={timelineContainerRef}
          onWheel={handleWheel}
        >
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 bg-card">
            <div className="relative h-8 border-b">
              {/* These dots on the ruler indicate the positions of key events that the cursor can snap to. */}
              {keyEventTimes.map(({ time }, tickIndex) => {
                const percent = timeToPercent(time)
                if (percent < 0 || percent > 100) return null
                return (
                  <div
                    key={`snap-${time}-${tickIndex}`}
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-muted-foreground/30 rounded-full z-0"
                    style={{ left: `${percent}%` }}
                  />
                )
              })}

              {timeMarkers.map((marker, ind) => {
                const naturalCenterPercent = timeToPercent(marker.time)

                // Filter out markers that are too far off-screen to improve performance
                if (naturalCenterPercent < -20 || naturalCenterPercent > 120) {
                  return null
                }

                // This is the offset from the edge, in percent.
                // It ensures the label doesn't sit flush against the edge.
                const labelHalfWidthPercent = 3

                // Clamp the label's center position to keep it within the viewport
                const clampedCenterPercent = Math.min(
                  100 - labelHalfWidthPercent,
                  Math.max(labelHalfWidthPercent, naturalCenterPercent),
                )

                const zInd = ind < timeMarkers.length - 1 ? "10" : "0"

                return (
                  <React.Fragment key={marker.time}>
                    {/* The tick line, always at its natural position */}
                    <div
                      className="absolute top-0 h-full w-px bg-border"
                      style={{ left: `${naturalCenterPercent}%` }}
                    />
                    {/* The label, with its position clamped to the viewport edges */}
                    <div
                      className={cn(
                        "absolute top-1/2",
                        "-translate-y-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-1 rounded-sm text-xs text-muted-foreground pointer-events-none",
                        "z-" + zInd,
                      )}
                      style={{ left: `${clampedCenterPercent}%` }}
                    >
                      {marker.label}
                    </div>
                  </React.Fragment>
                )
              })}
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
                      </div>
                    </div>
                  )}

                  {/* Halted Step Label */}
                  {isHaltedStep &&
                    item.startTime !== undefined &&
                    item.duration !== undefined &&
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
                          <div className="px-2 h-5 flex items-center rounded-full bg-orange-500 text-white text-xs font-medium whitespace-nowrap">
                            {formatDuration(item.duration)}
                          </div>
                        </div>
                      )
                    })()}

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
              const barEnd =
                item.startTime !== undefined && item.duration !== undefined ? item.startTime + item.duration : undefined
              const isOffscreenLeft =
                (barEnd !== undefined && barEnd < viewStart) || (item.time !== undefined && item.time < viewStart)

              if (isOffscreenLeft && item.color) {
                return (
                  <div
                    key={`left-wedge-${item.id}`}
                    className={cn(
                      "absolute w-0 h-0 border-y-[6px] border-y-transparent border-r-[5px]",
                      rightWedgeClasses[item.color],
                    )}
                    style={{ top: `${32 + index * 32 + 16}px`, transform: "translateY(-50%)" }}
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
              const viewEnd = viewStart + viewDuration
              const isOffscreenRight =
                (barStart !== undefined && barStart > viewEnd) || (item.time !== undefined && item.time > viewEnd)

              if (isOffscreenRight && item.color) {
                return (
                  <div
                    key={`right-wedge-${item.id}`}
                    className={cn(
                      "absolute w-0 h-0 border-y-[6px] border-y-transparent border-l-[5px]",
                      leftWedgeClasses[item.color],
                    )}
                    style={{ top: `${32 + index * 32 + 16}px`, transform: "translateY(-50%)" }}
                  />
                )
              }
              return null
            })}
          </div>
          {/* Imperative Cursor and Readout */}
          <div
            ref={cursorContainerRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-0 transition-opacity duration-150"
            style={
              {
                "--cursor-left": "0%",
                "--readout-text": '""',
                "--magnet-opacity": "0",
              } as React.CSSProperties
            }
          >
            {/* Cursor Line */}
            <div className="absolute top-0 h-full w-px bg-red-500" style={{ left: "var(--cursor-left)" }} />

            {/* Time Readout */}
            <div
              className="absolute top-1 flex items-center justify-center bg-card border rounded-md px-2 py-0.5 text-xs shadow-lg whitespace-nowrap"
              style={{
                left: "var(--cursor-left)",
                transform: "translateX(-50%)",
                minWidth: "11ch",
              }}
            >
              <Magnet
                className="size-3 mr-1.5 text-muted-foreground transition-opacity"
                style={{ opacity: "var(--magnet-opacity)" }}
              />
              <span className="font-mono tabular-nums after:content-[var(--readout-text)]" />
            </div>
          </div>
          <div className="sticky bottom-4 left-1/2 -translate-x-1/2 z-20 w-max">
            <div className="flex items-center gap-2 text-sm bg-card/75 backdrop-blur-[2px] rounded-full p-1 shadow-lg">
              <button onClick={() => handlePan("left")} className="p-1 hover:bg-accent rounded-full">
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs w-24 text-center font-mono">{formatDuration(viewDuration)}</span>
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

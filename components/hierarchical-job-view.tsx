"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Job, LogItem } from "@/lib/types"
import { LogTreeItem } from "./log-tree-item"

interface HierarchicalJobViewProps {
  job: Job
}

export default function HierarchicalJobView({ job }: HierarchicalJobViewProps) {
  const [itemElements, setItemElements] = useState<Record<string, HTMLElement | null>>({})

  const registerElement = useCallback((id: string, element: HTMLElement | null) => {
    setItemElements((prev) => {
      if (prev[id] === element) return prev
      return { ...prev, [id]: element }
    })
  }, [])

  const maxTime = job.totalDuration

  // Memoize the list of visible logs based on itemElements
  const visibleLogs = useMemo(() => {
    const visible = new Set<string>()
    Object.keys(itemElements).forEach((id) => {
      if (itemElements[id]) {
        visible.add(id)
      }
    })

    const allLogs: (LogItem & { parentId: string | null })[] = []
    const traverse = (items: LogItem[], parentId: string | null) => {
      items.forEach((item) => {
        allLogs.push({ ...item, parentId })
        if (item.children) {
          traverse(item.children, item.id)
        }
      })
    }
    traverse(job.logs, null)

    return allLogs.filter((log) => visible.has(log.id))
  }, [itemElements, job.logs])

  // The timeline header is h-6 (1.5rem = 24px) + mb-2 (0.5rem = 8px) = 32px total.
  const TIMELINE_HEADER_OFFSET = 32

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex-1 p-6 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>{job.name}</CardTitle>
            <CardDescription>
              Status: <span className="capitalize">{job.status}</span> - Total Duration:{" "}
              {(job.totalDuration / 1000).toFixed(2)}s
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 grid grid-cols-[minmax(300px,40%)_1fr] overflow-auto">
              <div className="relative border-r pr-2 py-2 overflow-y-auto pt-[45px]">
                <ul>
                  {job.logs.map((log) => (
                    <LogTreeItem key={log.id} item={log} registerElement={registerElement} />
                  ))}
                </ul>
              </div>

              <div className="relative pl-4 py-2 overflow-x-auto overflow-y-hidden">
                <div className="relative h-6 border-b mb-2">
                  {[...Array(Math.ceil(maxTime / 2000) + 1)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 text-xs text-muted-foreground"
                      style={{ left: `${((i * 2000) / maxTime) * 100}%` }}
                    >
                      {i * 2}s
                    </div>
                  ))}
                </div>

                <div className="relative h-full">
                  {visibleLogs.map((item) => {
                    const left = (item.startTime / maxTime) * 100
                    const itemEl = itemElements[item.id]
                    if (!itemEl) return null

                    const isInstantEvent = item.duration === 0

                    // We subtract the header offset from the calculated top position to align the timeline
                    const topPosition = itemEl.offsetTop - TIMELINE_HEADER_OFFSET

                    if (isInstantEvent) {
                      return (
                        <div
                          key={item.id}
                          className="absolute w-2 h-2 bg-purple-500 rounded-full"
                          style={{
                            top: `${topPosition + itemEl.offsetHeight / 2 - 12.5}px`,
                            left: `calc(${left}% - 4px)`,
                          }}
                          title={`${item.name} at ${(item.startTime / 1000).toFixed(2)}s`}
                        />
                      )
                    } else {
                      const width = (item.duration / maxTime) * 100
                      return (
                        <div
                          key={item.id}
                          className="absolute flex items-center justify-center overflow-hidden rounded-md"
                          style={{
                            top: `${topPosition + itemEl.offsetHeight / 2 - 17.5}px`,
                            left: `${left}%`,
                            width: `${width}%`,
                            height: `20px`,
                          }}
                          title={`${item.name}: ${(item.duration / 1000).toFixed(2)}s`}
                        >
                          <div
                            className="h-full w-full rounded-md"
                            style={{
                              backgroundColor:
                                item.type === "attempt"
                                  ? "#e5e7eb"
                                  : item.status === "completed"
                                    ? "#dbeafe"
                                    : item.status === "failed"
                                      ? "#fee2e2"
                                      : "#f3f4f6",
                            }}
                          >
                            <div
                              className={`h-full w-full rounded-md ${
                                item.type === "task"
                                  ? "bg-repeat bg-[length:10px_10px] bg-[image:repeating-linear-gradient(45deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_1px,transparent_1px,transparent_5px)]"
                                  : ""
                              }`}
                              style={{
                                backgroundColor:
                                  item.type === "attempt"
                                    ? "transparent"
                                    : item.type === "halted"
                                      ? "#fcd34d" // Amber color for halted
                                      : item.status === "completed"
                                        ? "#93c5fd"
                                        : item.status === "failed"
                                          ? "#fca5a5"
                                          : "#e5e7eb",
                              }}
                            >
                              {item.status === "in-progress" && (
                                <div
                                  className="h-full w-full rounded-md animate-shimmer"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                                    backgroundSize: "200% 100%",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          {item.duration > 400 && (
                            <span className="absolute text-xs text-black/60 font-medium pointer-events-none truncate px-1">
                              {(item.duration / 1000).toFixed(2)}s
                            </span>
                          )}
                          {item.type !== "attempt" && (
                            <div className="absolute -left-px top-1/2 h-3 w-px -translate-y-1/2 bg-slate-400" />
                          )}
                        </div>
                      )
                    }
                  })}

                  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {visibleLogs.map((item) => {
                      if (!item.parentId) return null
                      const parentEl = itemElements[item.parentId]
                      const itemEl = itemElements[item.id]
                      if (!parentEl || !itemEl) return null

                      const parentLog = visibleLogs.find((i) => i.id === item.parentId)
                      if (!parentLog) return null

                      const parentLeft = (parentLog.startTime / maxTime) * 100
                      const itemLeft = (item.startTime / maxTime) * 100

                      // We also subtract the offset here for the SVG connectors
                      const startY = parentEl.offsetTop - TIMELINE_HEADER_OFFSET + parentEl.offsetHeight / 2
                      const endY = itemEl.offsetTop - TIMELINE_HEADER_OFFSET + itemEl.offsetHeight / 2

                      const isInstantEvent = item.duration === 0

                      return (
                        <path
                          key={`${item.id}-connector`}
                          d={`M ${parentLeft}% ${startY} L ${parentLeft}% ${endY} M ${parentLeft}% ${endY} L ${itemLeft}% ${endY}`}
                          stroke="hsl(var(--border))"
                          fill="none"
                          strokeDasharray={isInstantEvent ? "2 2" : "none"}
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

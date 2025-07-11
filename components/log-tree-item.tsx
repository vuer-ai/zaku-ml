"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronRight, FileTerminal, Info, AlertTriangle, CheckCircle, Bot, PauseCircle, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { LogItem, LogItemType } from "@/lib/types"

interface LogTreeItemProps {
  item: LogItem
  registerElement: (id: string, element: HTMLElement | null) => void
}

const typeIcons: Record<LogItemType, React.ElementType> = {
  task: FileTerminal,
  attempt: Bot,
  info: Info,
  success: CheckCircle,
  error: AlertTriangle,
  log: FileTerminal,
  registered: History,
  halted: PauseCircle,
}

const typeTooltips: Record<LogItemType, string> = {
  task: "Task: A major unit of work.",
  attempt: "Attempt: A retry or execution wrapper.",
  info: "Info: An informational message.",
  success: "Success: A successful operation.",
  error: "Error: An error occurred.",
  log: "Log: A standard log entry.",
  registered: "Registered: The job has been accepted and is waiting to start.",
  halted: "Halted: The job is paused, waiting for external resources or dependencies.",
}

const typeColors: Record<LogItemType, string> = {
  task: "text-blue-500",
  attempt: "text-gray-500",
  info: "text-gray-500",
  success: "text-green-500",
  error: "text-red-500",
  log: "text-gray-500",
  registered: "text-purple-500",
  halted: "text-orange-500",
}

export function LogTreeItem({ item, registerElement }: LogTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerElement(item.id, ref.current)
    return () => registerElement(item.id, null)
  }, [item.id, registerElement])

  const Icon = typeIcons[item.type]
  const hasChildren = item.children && item.children.length > 0

  return (
    <TooltipProvider>
      <li>
        <div
          className={cn("flex items-center py-1 select-none cursor-pointer")}
          ref={ref}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          {/* Chevron/Icon Overlay */}
          <div className="relative h-4 w-4 mr-2 flex-shrink-0">
            {hasChildren ? (
              <>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground absolute transition-all",
                    isHovered ? "opacity-100" : "opacity-0",
                    isExpanded && "rotate-90",
                  )}
                />
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-opacity",
                    isHovered ? "opacity-0" : "opacity-100",
                    typeColors[item.type],
                  )}
                />
              </>
            ) : (
              <Icon className={cn("w-4 h-4 shrink-0", typeColors[item.type])} />
            )}
          </div>

          {/* Text and Badges */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn("truncate text-sm", item.type === "error" && "text-red-600")}>{item.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{typeTooltips[item.type]}</p>
            </TooltipContent>
          </Tooltip>
          {item.type === "task" && ref.current?.parentElement?.parentElement?.tagName !== "UL" && (
            <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
              ROOT
            </span>
          )}
        </div>

        {/* Children: Rendered in a nested list with padding and a border for the vertical line */}
        {hasChildren && isExpanded && (
          <ul className="pl-[24px] border-l border-muted-foreground/20 ml-[8px]">
            {item.children.map((child) => (
              <LogTreeItem key={child.id} item={child} registerElement={registerElement} />
            ))}
          </ul>
        )}
      </li>
    </TooltipProvider>
  )
}

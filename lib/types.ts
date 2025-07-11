export interface Project {
  id: string
  name: string
  description: string
  jobCount: number
}

export type LogItemType = "task" | "attempt" | "info" | "success" | "error" | "log" | "registered" | "halted"

export interface LogItem {
  id: string
  name: string
  type: LogItemType
  status: "completed" | "in-progress" | "failed" | "queued"
  startTime: number // ms, relative to job start
  duration: number // ms
  children?: LogItem[]
}

export interface Job {
  id: string
  projectId: string
  name: string
  status: "completed" | "in-progress" | "failed"
  totalDuration: number // ms
  createdAt: string
  logs: LogItem[]
}

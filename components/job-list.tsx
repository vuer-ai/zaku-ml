"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Job } from "@/lib/types"

interface JobListProps {
  jobs: Job[]
  selectedJob: Job | null
  onSelectJob: (job: Job) => void
}

export default function JobList({ jobs, selectedJob, onSelectJob }: JobListProps) {
  const getStatusVariant = (status: Job["status"]) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <nav className="p-2">
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <button
              className={cn(
                "w-full text-left p-3 rounded-md transition-colors",
                selectedJob?.id === job.id ? "bg-muted" : "hover:bg-muted/50",
              )}
              onClick={() => onSelectJob(job)}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold truncate">{job.name}</p>
                <p className="text-sm text-muted-foreground">{(job.totalDuration / 1000).toFixed(2)}s</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleString()}</p>
                <Badge variant={getStatusVariant(job.status)} className="capitalize">
                  {job.status}
                </Badge>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

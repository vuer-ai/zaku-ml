"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { jobs as allJobs, projects } from "@/lib/data"
import type { Job } from "@/lib/types"
import JobList from "@/components/job-list"
import HierarchicalJobView from "@/components/hierarchical-job-view"

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const [searchTerm, setSearchTerm] = useState("")

  const projectJobs = useMemo(() => allJobs.filter((job) => job.projectId === params.projectId), [params.projectId])

  const [selectedJob, setSelectedJob] = useState<Job | null>(projectJobs[0] || null)

  const project = projects.find((p) => p.id === params.projectId)

  const filteredJobs = projectJobs.filter((job) => job.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="w-1/3 border-r flex flex-col">
        <header className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4" />
            All Projects
          </Link>
          <h1 className="text-xl font-bold">{project?.name ?? "Project"}</h1>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <JobList jobs={filteredJobs} selectedJob={selectedJob} onSelectJob={setSelectedJob} />
        </div>
      </div>
      <main className="w-2/3 flex flex-col">
        {selectedJob ? (
          <HierarchicalJobView job={selectedJob} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a job to see details</p>
          </div>
        )}
      </main>
    </div>
  )
}

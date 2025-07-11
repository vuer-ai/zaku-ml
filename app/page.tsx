import { ExecutionTimeline } from "@/components/execution-timeline"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] p-4 sm:p-8">
      <ExecutionTimeline />
    </main>
  )
}

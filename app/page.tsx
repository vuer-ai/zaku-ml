import { ExecutionTimeline } from "@/components/execution-timeline"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8 bg-muted/40">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Light Theme</h2>
        <div className="light">
          <ExecutionTimeline />
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Dark Theme</h2>
        <div className="dark">
          <ExecutionTimeline />
        </div>
      </div>
    </main>
  )
}

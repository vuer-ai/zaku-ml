import { ExecutionTimeline } from "@/components/execution-timeline"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
        <div className="w-full">
          <ExecutionTimeline />
        </div>
      </main>
    </ThemeProvider>
  )
}

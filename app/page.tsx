import { ExecutionTimeline } from "@/components/execution-timeline"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
        <ExecutionTimeline />
      </main>
    </ThemeProvider>
  )
}

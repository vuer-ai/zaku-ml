"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { ExecutionTimeline } from "@/components/execution-timeline"

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background">
      {/* Theme toggle button */}
      <div className="w-full max-w-7xl mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Execution Timeline</h1>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-accent transition-colors border"
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </div>

      <ExecutionTimeline />
    </main>
  )
}

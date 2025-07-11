import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const mockUser = {
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "/avatars/jane-smith.png",
  }

  return (
    <SidebarProvider>
      <AppSidebar user={mockUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {/* The page component will render its own title */}
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

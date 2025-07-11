import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const mockUser = {
    name: "Admin User",
    email: "admin@example.com",
    avatarUrl: "https://github.com/vercel.png",
  }

  return (
    <SidebarProvider>
      <AppSidebar user={mockUser} isAdmin={true} />
      <SidebarInset>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

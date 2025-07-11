"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, FileText, Home, Settings, Users, Building2, LogOut, MoreHorizontal } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface AppSidebarProps {
  user: {
    name: string
    email: string
    avatarUrl: string
  }
  isAdmin?: boolean
}

export function AppSidebar({ user, isAdmin = false }: AppSidebarProps) {
  const pathname = usePathname()

  // --- User-facing navigation items ---
  const userMenuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Notes",
      href: "/notes",
      icon: FileText,
    },
    {
      title: "Organizations",
      href: "/organizations",
      icon: Building2,
    },
  ]

  // --- Admin-only navigation items ---
  const adminMenuItems = [
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Organizations",
      href: "/admin/organizations",
      icon: Building2,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            UM
          </div>
          <div className="font-semibold">User Management</div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="flex flex-col gap-1">
          {userMenuItems.map((item) => (
            <Button
              key={item.title}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="justify-start font-normal"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-1.2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>

        {isAdmin && (
          <>
            <Separator className="my-2" />
            <div className="flex flex-col gap-1">
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Admin</p>
              {adminMenuItems.map((item) => (
                <Button
                  key={item.title}
                  variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                  className="justify-start font-normal"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-1.2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-1" />
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/sign-in">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

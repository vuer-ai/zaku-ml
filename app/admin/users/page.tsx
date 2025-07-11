"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search } from "lucide-react"
import { UserDetailPanel } from "@/components/admin/user-detail-panel"
import { CreateUserPanel } from "@/components/admin/create-user-panel"
import type { ClerkUser } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Mock data for users
const users: ClerkUser[] = [
  {
    id: "user_2zeeBtHmiSCifCVIJdwvY977q1e",
    username: "geyang",
    first_name: "Ge",
    last_name: "Yang",
    image_url:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yemVlQnFEYzViR3ZsWFpJVkg2cDdJa1p5cWkifQ",
    has_image: true,
    primary_email_address_id: "idn_2zeeBMB1bTJaWaPYV1HRVpUppxP",
    email_addresses: [
      {
        id: "idn_2zeeBMB1bTJaWaPYV1HRVpUppxP",
        email_address: "ge.ike.yang@gmail.com",
        verification: { status: "verified", strategy: "from_oauth_github" },
      },
    ],
    last_sign_in_at: 1752127711031,
    banned: false,
    locked: false,
    created_at: 1752095833577,
    updated_at: 1752127711059,
    profile_image_url: "https://images.clerk.dev/oauth_github/img_2zeeBqDc5bGvlXZIVH6p7IkZyqi",
  },
  {
    id: "user_2abcdeFghijKlmnOpqrstuvwXy",
    username: "janesmith",
    first_name: "Jane",
    last_name: "Smith",
    image_url: "/avatars/jane-smith.png",
    has_image: true,
    primary_email_address_id: "idn_2abcdeFghijKlmnOpqrstuvwXy",
    email_addresses: [
      {
        id: "idn_2abcdeFghijKlmnOpqrstuvwXy",
        email_address: "jane@example.com",
        verification: { status: "verified", strategy: "email_code" },
      },
    ],
    last_sign_in_at: 1752041400000,
    banned: false,
    locked: false,
    created_at: 1751955000000,
    updated_at: 1752041400000,
    profile_image_url: "/avatars/jane-smith.png",
  },
]

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = React.useState<ClerkUser | null>(null)
  const [isCreatePanelOpen, setIsCreatePanelOpen] = React.useState(false)

  const handleRowClick = (user: ClerkUser) => {
    setIsCreatePanelOpen(false)
    setSelectedUser((prevUser) => (prevUser?.id === user.id ? null : user))
  }

  const handleAddClick = () => {
    setSelectedUser(null)
    setIsCreatePanelOpen(true)
  }

  const handleClosePanels = () => {
    setSelectedUser(null)
    setIsCreatePanelOpen(false)
  }

  const isPanelOpen = selectedUser !== null || isCreatePanelOpen

  return (
    <div
      className="grid transition-[grid-template-columns] duration-300 ease-in-out h-full"
      style={{
        gridTemplateColumns: isPanelOpen ? "minmax(0, 1fr) 500px" : "minmax(0, 1fr) 0px",
      }}
    >
      <div className="min-w-0 pr-6 flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold">User Management</h1>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          <Button
            variant="ghost"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddClick}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="rounded-md border overflow-auto flex-1">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Signed In</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => handleRowClick(user)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedUser?.id === user.id ? "bg-muted/50 hover:bg-muted/60" : "hover:bg-muted/30",
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image_url || "/placeholder.svg"} alt={user.username ?? ""} />
                        <AvatarFallback>
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email_addresses[0].email_address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        !user.banned && !user.locked
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {user.banned ? "Banned" : user.locked ? "Locked" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="overflow-hidden relative h-full">
        <UserDetailPanel user={selectedUser} onClose={handleClosePanels} />
        <CreateUserPanel isOpen={isCreatePanelOpen} onClose={handleClosePanels} />
      </div>
    </div>
  )
}

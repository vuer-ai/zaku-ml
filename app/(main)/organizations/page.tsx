"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { CreateOrganizationForm } from "@/components/create-organization-form"

// Mock data for user's organizations
const organizations = [
  {
    id: 1,
    name: "Acme Inc",
    role: "Member",
    members: 24,
    plan: "Enterprise",
    joinedAt: "2023-03-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Widget Co",
    role: "Admin",
    members: 12,
    plan: "Pro",
    joinedAt: "2023-01-20T14:30:00Z",
  },
]

export default function OrganizationsPage() {
  const [isCreatePanelOpen, setIsCreatePanelOpen] = React.useState(false)

  const handleAddClick = () => {
    setIsCreatePanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsCreatePanelOpen(false)
  }

  return (
    <div
      className="grid transition-[grid-template-columns] duration-300 ease-in-out h-full"
      style={{
        gridTemplateColumns: isCreatePanelOpen ? "minmax(0, 1fr) 500px" : "minmax(0, 1fr) 0px",
      }}
    >
      <div className="min-w-0 pr-6 flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Organizations</h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search organizations..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          <Button variant="ghost" className="hover:bg-primary hover:text-primary-foreground" onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>

        <div className="rounded-md border overflow-auto flex-1">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Your Role</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.role}</TableCell>
                  <TableCell>{org.members}</TableCell>
                  <TableCell>{org.plan}</TableCell>
                  <TableCell>{new Date(org.joinedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Invitations</CardTitle>
            <CardDescription>Pending invitations to organizations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
              You don't have any pending invitations.
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="overflow-hidden relative h-full">
        <CreateOrganizationForm isOpen={isCreatePanelOpen} onClose={handleClosePanel} />
      </div>
    </div>
  )
}

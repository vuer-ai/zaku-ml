"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search } from "lucide-react"
import type { Organization } from "@/lib/types"
import { OrganizationDetailPanel } from "@/components/admin/organization-detail-panel"
import { CreateOrganizationPanel } from "@/components/admin/create-organization-panel"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Mock data for organizations
const organizations: Organization[] = [
  {
    id: "org_1",
    name: "Acme Inc",
    slug: "acme-inc",
    members: 24,
    plan: "Enterprise",
    status: "Active",
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "org_2",
    name: "Widget Co",
    slug: "widget-co",
    members: 12,
    plan: "Pro",
    status: "Active",
    createdAt: "2023-02-20T14:30:00Z",
  },
  {
    id: "org_3",
    name: "Example LLC",
    slug: "example-llc",
    members: 8,
    plan: "Basic",
    status: "Inactive",
    createdAt: "2022-11-05T09:15:00Z",
  },
]

export default function AdminOrganizationsPage() {
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(null)
  const [isCreatePanelOpen, setIsCreatePanelOpen] = React.useState(false)

  const handleRowClick = (org: Organization) => {
    setIsCreatePanelOpen(false)
    setSelectedOrg((prevOrg) => (prevOrg?.id === org.id ? null : org))
  }

  const handleAddClick = () => {
    setSelectedOrg(null)
    setIsCreatePanelOpen(true)
  }

  const handleClosePanels = () => {
    setSelectedOrg(null)
    setIsCreatePanelOpen(false)
  }

  const isPanelOpen = selectedOrg !== null || isCreatePanelOpen

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
            <h1 className="text-xl font-semibold">Organization Management</h1>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search organizations..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          <Button variant="ghost" className="hover:bg-primary hover:text-primary-foreground" onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </div>

        <div className="rounded-md border overflow-auto flex-1">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow
                  key={org.id}
                  onClick={() => handleRowClick(org)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedOrg?.id === org.id ? "bg-muted/50 hover:bg-muted/60" : "hover:bg-muted/30",
                  )}
                >
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.members}</TableCell>
                  <TableCell>{org.plan}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        org.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {org.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="overflow-hidden relative h-full">
        <OrganizationDetailPanel organization={selectedOrg} onClose={handleClosePanels} />
        <CreateOrganizationPanel isOpen={isCreatePanelOpen} onClose={handleClosePanels} />
      </div>
    </div>
  )
}

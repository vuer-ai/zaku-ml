"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Organization } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrganizationDetailPanelProps {
  organization: Organization | null
  onClose: () => void
}

export function OrganizationDetailPanel({ organization, onClose }: OrganizationDetailPanelProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-300",
        organization ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {organization && (
        <Card className="h-full rounded-lg border flex flex-col">
          <CardHeader className="flex flex-row items-start gap-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Close panel</span>
            </Button>
            <div>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>View and edit organization information.</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="org-name" className="text-right">
                  Name
                </Label>
                <Input id="org-name" defaultValue={organization.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="org-slug" className="text-right">
                  Slug
                </Label>
                <Input id="org-slug" defaultValue={organization.slug} className="col-span-3" />
              </div>

              <Separator />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="org-plan" className="text-right">
                  Plan
                </Label>
                <Select defaultValue={organization.plan}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="org-status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={organization.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Organization ID:</strong> <Badge variant="outline">{organization.id}</Badge>
                  </p>
                  <p>
                    <strong>Members:</strong> {organization.members}
                  </p>
                  <p>
                    <strong>Date Created:</strong> {new Date(organization.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto border-t pt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="ml-auto">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

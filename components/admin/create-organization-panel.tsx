"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateOrganizationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateOrganizationPanel({ isOpen, onClose }: CreateOrganizationPanelProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <Card className="max-h-full rounded-lg border flex flex-col">
        <CardHeader className="flex flex-row items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Close panel</span>
          </Button>
          <div>
            <CardTitle>Create Organization</CardTitle>
            <CardDescription>Fill in the details to create a new organization.</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            // Handle form submission logic here
            console.log("Form submitted")
            onClose() // Close panel on submit
          }}
        >
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-org-name" className="text-right">
                  Name
                </Label>
                <Input id="new-org-name" placeholder="Acme Inc." className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-org-slug" className="text-right">
                  Slug
                </Label>
                <Input id="new-org-slug" placeholder="acme-inc" className="col-span-3" />
              </div>

              <Separator />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-org-plan" className="text-right">
                  Plan
                </Label>
                <Select>
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
                <Label htmlFor="new-org-status" className="text-right">
                  Status
                </Label>
                <Select defaultValue="Active">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto border-t pt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="ml-auto">
              Create Organization
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateOrganizationFormProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateOrganizationForm({ isOpen, onClose }: CreateOrganizationFormProps) {
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
            <CardTitle>Create a new Organization</CardTitle>
            <CardDescription>Fill in the details to get started.</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log("Create organization form submitted")
            onClose()
          }}
        >
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" placeholder="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-slug">Organization Slug</Label>
                <Input id="org-slug" placeholder="acme-inc" />
                <p className="text-xs text-muted-foreground">This will be used in the URL for your organization.</p>
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

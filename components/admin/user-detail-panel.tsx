"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ClerkUser } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserDetailPanelProps {
  user: ClerkUser | null
  onClose: () => void
}

export function UserDetailPanel({ user, onClose }: UserDetailPanelProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-300",
        user ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {user && (
        <Card className="h-full rounded-lg border flex flex-col">
          <CardHeader className="flex flex-row items-start gap-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Close panel</span>
            </Button>
            <div>
              <CardTitle>User Details</CardTitle>
              <CardDescription>View and edit user information.</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image_url || "/placeholder.svg"} alt={user.username ?? ""} />
                <AvatarFallback>
                  {user.first_name[0]}
                  {user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first-name" className="text-right">
                  First Name
                </Label>
                <Input id="first-name" defaultValue={user.first_name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last-name" className="text-right">
                  Last Name
                </Label>
                <Input id="last-name" defaultValue={user.last_name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  defaultValue={user.email_addresses[0].email_address}
                  className="col-span-3"
                  disabled
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Account Status</h4>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label htmlFor="banned-switch">Banned</Label>
                    <p className="text-xs text-muted-foreground">Prevent this user from signing in.</p>
                  </div>
                  <Switch id="banned-switch" defaultChecked={user.banned} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label htmlFor="locked-switch">Locked</Label>
                    <p className="text-xs text-muted-foreground">Temporarily lock this user's account.</p>
                  </div>
                  <Switch id="locked-switch" defaultChecked={user.locked} />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>User ID:</strong> <Badge variant="outline">{user.id}</Badge>
                  </p>
                  <p>
                    <strong>Last Sign In:</strong>{" "}
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
                  </p>
                  <p>
                    <strong>Date Created:</strong> {new Date(user.created_at).toLocaleString()}
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

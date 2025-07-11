import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"

// Mock data for notes
const notes = [
  {
    id: 1,
    title: "Meeting Notes",
    content:
      "Discussed project timeline and deliverables with the team. Key points: launch date moved to Q3, need additional resources for design phase.",
    createdAt: "2023-06-10T10:00:00Z",
    tags: ["meeting", "project"],
  },
  {
    id: 2,
    title: "Ideas for New Feature",
    content:
      "User authentication improvements: social login integration, two-factor authentication. Dashboard redesign with customizable widgets.",
    createdAt: "2023-06-08T14:30:00Z",
    tags: ["feature", "design"],
  },
  {
    id: 3,
    title: "Weekly Goals",
    content:
      "Complete user management system by Friday. Start on reporting module. Review pull requests from team members.",
    createdAt: "2023-06-05T09:15:00Z",
    tags: ["goals", "planning"],
  },
  {
    id: 4,
    title: "Client Feedback",
    content:
      "Client requested changes to the navigation structure. They also want a more prominent call-to-action on the homepage.",
    createdAt: "2023-06-03T11:45:00Z",
    tags: ["client", "feedback"],
  },
  {
    id: 5,
    title: "Research Notes",
    content:
      "Looked into competing products. Key differentiators we should focus on: ease of use, integration capabilities, and pricing model.",
    createdAt: "2023-06-01T13:20:00Z",
    tags: ["research", "competition"],
  },
]

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Notes</h2>
          <p className="text-muted-foreground">Manage and organize your notes</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search notes..." className="pl-8" />
        </div>
        <Button variant="ghost" className="hover:bg-primary hover:text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <CardDescription>{new Date(note.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

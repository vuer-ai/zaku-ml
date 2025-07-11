import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Mock data for notes
const notes = [
  {
    id: 1,
    title: "Meeting Notes",
    content: "Discussed project timeline and deliverables",
    createdAt: "2023-06-10T10:00:00Z",
  },
  {
    id: 2,
    title: "Ideas for New Feature",
    content: "User authentication improvements and dashboard redesign",
    createdAt: "2023-06-08T14:30:00Z",
  },
  {
    id: 3,
    title: "Weekly Goals",
    content: "Complete user management system and start on reporting module",
    createdAt: "2023-06-05T09:15:00Z",
  },
]

export function NotesList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Your Notes</h3>
        <Button size="sm" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{note.title}</h4>
              <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

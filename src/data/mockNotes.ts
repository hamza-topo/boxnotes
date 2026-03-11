import type { Note } from "../types/note";
export const mockNotes: Note[] = [
  {
    id: 1,
    title: "Docker command",
    description: "Run local container with mapped port",
    quickReminder: "Use -p flag",
    category: "devops"
  },
  {
    id: 2,
    title: "Git branch",
    description: "Create feature branch before coding",
    quickReminder: "git checkout -b feature/name",
    category: "git"
  },
  {
    id: 3,
    title: "Linux grep",
    description: "grep -r keyword .",
    quickReminder: "Case-sensitive search",
    category: "linux"
  }
]
import type { Note } from "../types/note";

export const initialNotes: Note[] = [
  {
    id: 1,
    title: "Docker command",
    quickReminder: "Run local container with mapped port",
    category: "devops",
    description: "Use docker run -p 8080:80 image_name to expose container ports locally.",
  },
  {
    id: 2,
    title: "Git branch",
    quickReminder: "Create feature branch before coding",
    category: "git",
    description: "Use git checkout -b feature/my-branch before starting a new change.",
  },
  {
    id: 3,
    title: "Linux grep",
    quickReminder: "Search recursively inside files",
    category: "linux",
    description: "Use grep -r 'keyword' . to search recursively from the current folder.",
  },
];
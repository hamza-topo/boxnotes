export type NoteCategory = "linux" | "git" | "php" | "javascript" | "devops" | "career";

export type Note = {
  id: number;
  title: string;
  quickReminder: string;
  category: NoteCategory;
  description: string;
};
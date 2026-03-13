export type NoteTag =
  | "linux"
  | "git"
  | "php"
  | "javascript"
  | "devops"
  | "career";

export type Note = {
  id: number;
  title: string;
  bullet?: string | null;
  content: string;
  description?: string;
  quickReminder?: string;
  tag: NoteTag;
  category?: string;
  createdAt?: string;
  updatedAt?: string | null;
};
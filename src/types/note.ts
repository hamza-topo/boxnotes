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
  bullet: string | null;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string | null;
};
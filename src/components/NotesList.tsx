import type { Note } from "../types/note";
import NoteCard from "./NoteCard";

type Props = {
  notes: Note[];
};

export default function NotesList({ notes }: Props) {
  if (!notes.length) {
    return (
      <div className="emptyState">
        <h3>No notes found</h3>
        <p>Try another keyword or create a new note.</p>
      </div>
    );
  }

  return (
    <div className="notesGrid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
import type { Note } from "../types/note";
import NoteCard from "./NoteCard";

type Props = {
  notes: Note[];
  loading?: boolean;
};

export default function NotesList({ notes, loading = false }: Props) {
  if (loading) {
    return (
      <div className="notesGrid">
        {Array.from({ length: 4 }, (_, index) => (
          <NoteCard key={index} loading />
        ))}
      </div>
    );
  }

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
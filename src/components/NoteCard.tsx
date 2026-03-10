import type { Note } from "../types/note";

type Props = {
  note: Note;
};

export default function NoteCard({ note }: Props) {
  return (
    <article className="noteCard">
      <div className="noteCardTop">
        <span className={`tag tag-${note.category}`}>#{note.category}</span>
      </div>

      <h3 className="noteTitle">{note.title}</h3>
      <p className="noteReminder">{note.quickReminder}</p>

      <div className="noteDivider" />

      <p className="noteDescription">{note.description}</p>
    </article>
  );
}
import type { Note } from "../types/note";

type Props = {
  note: Note;
};

function formatDate(dateString: string | null) {
  if (!dateString) return null;

  return new Date(dateString).toLocaleString();
}

export default function NoteCard({ note }: Props) {
  const createdAt = formatDate(note.createdAt);
  const updatedAt = formatDate(note.updatedAt);

  return (
    <article className="noteCard">
      <div className="noteCardTop">
        <span className={`tag tag-${note.tag}`}>#{note.tag}</span>
      </div>

      <h3 className="noteTitle">{note.title}</h3>

      {note.bullet && <p className="noteReminder">{note.bullet}</p>}

      <div className="noteDivider" />

      <div
        className="noteDescription"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      <div className="noteMeta">
        <p className="noteDate">
          Created: <span>{createdAt}</span>
        </p>

        {updatedAt && (
          <p className="noteDate">
            Updated: <span>{updatedAt}</span>
          </p>
        )}
      </div>
    </article>
  );
}
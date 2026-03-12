import type { Note } from "../types/note";

type Props = {
  note?: Note;
  loading?: boolean;
};

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return null;

  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoteCard({ note, loading = false }: Props) {
  const createdAt = formatDate(note?.createdAt);
  const updatedAt = formatDate(note?.updatedAt);

  return (
    <article className={`noteCard ${loading ? "isLoading" : ""}`}>
      <div className="noteCardTop">
        {loading ? (
          <span className="skeletonBlock skeletonTag" />
        ) : (
          <span className={`tag tag-${note?.tag}`}>#{note?.tag}</span>
        )}
      </div>

      {loading ? (
        <div className="skeletonBlock skeletonTitle" />
      ) : (
        <h3 className="noteTitle">{note?.title}</h3>
      )}

      {loading ? (
        <div className="skeletonBlock skeletonReminder" />
      ) : note?.bullet ? (
        <p className="noteReminder">{note.bullet}</p>
      ) : null}

      <div className="noteDivider" />

      {loading ? (
        <div className="noteDescription">
          <div className="skeletonBlock skeletonLine skeletonLineLg" />
          <div className="skeletonBlock skeletonLine" />
          <div className="skeletonBlock skeletonLine skeletonLineSm" />
        </div>
      ) : (
        <div
          className="noteDescription"
          dangerouslySetInnerHTML={{ __html: note?.content || "" }}
        />
      )}

      <div className="noteMeta">
        {loading ? (
          <>
            <div className="skeletonBlock skeletonMeta" />
            <div className="skeletonBlock skeletonMeta skeletonMetaSm" />
          </>
        ) : (
          <>
            <p className="noteDate">
              Created: <span>{createdAt}</span>
            </p>

            {updatedAt && (
              <p className="noteDate">
                Updated: <span>{updatedAt}</span>
              </p>
            )}
          </>
        )}
      </div>
    </article>
  );
}
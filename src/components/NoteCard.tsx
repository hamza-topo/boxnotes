import { useState } from "react";
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

function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export default function NoteCard({ note, loading = false }: Props) {
  const [copied, setCopied] = useState(false);

  const createdAt = formatDate(note?.createdAt);
  const updatedAt = formatDate(note?.updatedAt);

  const commandText = note?.bullet?.trim() || "No command yet";
  const previewText = truncateText(stripHtml(note?.content), 90);

  const handleCopy = async () => {
    if (!note?.bullet?.trim()) return;

    try {
      await navigator.clipboard.writeText(note.bullet.trim());
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <article className={`noteCard noteCardSnippet ${loading ? "isLoading" : ""}`}>
      <div className="noteCardHead">
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
        <div className="skeletonBlock skeletonLine skeletonLineLg" />
      ) : (
        <div className="noteCommandRow">
          <code className="noteCommandInline">{commandText}</code>

          <button
            type="button"
            className={`noteCopyButton ${copied ? "isCopied" : ""}`}
            onClick={handleCopy}
            aria-label="Copy command"
            title={copied ? "Copied!" : "Copy command"}
            disabled={!note?.bullet?.trim()}
          >
            {copied ? "✓" : "📋"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="noteDescriptionPreview">
          <div className="skeletonBlock skeletonLine skeletonLineLg" />
        </div>
      ) : (
        <p className="noteDescriptionPreview">
          {previewText || "No description preview available."}
        </p>
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
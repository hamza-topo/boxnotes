import { useState } from "react";
import { Pencil, Trash2, Clipboard, Check } from "lucide-react";
import type { Note } from "../types/note";

type Props = {
  note?: Note;
  loading?: boolean;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
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

export default function NoteCard({
  note,
  loading = false,
  onEdit,
  onDelete,
}: Props) {
  const [copied, setCopied] = useState(false);

  const createdAt = formatDate(note?.createdAt);
  const updatedAt = formatDate(note?.updatedAt);

  const commandText = note?.bullet?.trim() || "No command yet";
  const previewText = truncateText(stripHtml(note?.content), 90);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

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

  const handleEdit = () => {
    if (!note || loading) return;
    onEdit?.(note);
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setDeleteInput("");
  };

  const handleConfirmDelete = () => {
    if (!note) return;

    if (deleteInput !== (note.bullet ?? "")) return;

    onDelete?.(note);

    setConfirmDelete(false);
    setDeleteInput("");
  };

  return (
    <article className={`noteCard noteCardSnippet ${loading ? "isLoading" : ""}`}>
      <div className="noteCardHead">
        {loading ? (
          <span className="skeletonBlock skeletonTag" />
        ) : (
          <>
            <span className={`tag tag-${note?.tag}`}>#{note?.tag}</span>

            <div className="noteCardTools" aria-label="Note actions">
              <button
                type="button"
                className="noteToolButton"
                onClick={handleEdit}
                aria-label="Edit note"
                title="Edit note"
              >
                <Pencil size={15} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                className="noteToolButton noteToolButtonDanger"
                onClick={handleDeleteClick}
                aria-label="Delete note"
                title="Delete note"
              >
                <Trash2 size={15} strokeWidth={2.2} />
              </button>
              {confirmDelete && note && (
                <div className="noteDeletePopover" role="dialog" aria-label="Delete note confirmation">
                  <div className="noteDeletePopoverHeader">
                    <p className="noteDeletePopoverTitle">Delete note</p>
                    <button
                      type="button"
                      className="noteDeleteClose"
                      onClick={handleCancelDelete}
                      aria-label="Close delete confirmation"
                      title="Close"
                    >
                      ×
                    </button>
                  </div>

                  <p className="noteDeletePopoverText">
                    Type the command below to confirm deletion.
                  </p>

                  <code className="noteDeletePopoverCode">
                    {note.bullet?.trim() || "No command available"}
                  </code>

                  <input
                    type="text"
                    className="noteDeletePopoverInput"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type exact command"
                    autoFocus
                  />

                  <div className="noteDeletePopoverActions">
                    <button
                      type="button"
                      className="noteDeletePopoverCancel"
                      onClick={handleCancelDelete}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="noteDeletePopoverDanger"
                      disabled={deleteInput !== (note.bullet ?? "")}
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
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
            {copied ? (
              <Check size={16} strokeWidth={2.6} />
            ) : (
              <Clipboard size={16} strokeWidth={2.2} />
            )}
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
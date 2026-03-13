import { useEffect, useRef, useState } from "react";
import type { Note, NoteTag } from "../types/note";
import DevEditor from "./DevEditor";

type NoteFormProps = {
  onAddNote: (note: Note) => Promise<void>;
  onUpdateNote: (note: Note) => Promise<void>;
  editingNote: Note | null;
  onCancelEdit: () => void;
};

const tags: NoteTag[] = [
  "linux",
  "git",
  "php",
  "javascript",
  "devops",
  "career",
];

export default function NoteForm({
  onAddNote,
  onUpdateNote,
  editingNote,
  onCancelEdit,
}: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [bullet, setBullet] = useState("");
  const [tag, setTag] = useState<NoteTag>("linux");
  const [content, setContent] = useState("");

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const isEditMode = Boolean(editingNote);

  useEffect(() => {
    if (!editingNote) {
      return;
    }

    setTitle(editingNote.title ?? "");
    setBullet(editingNote.bullet ?? "");
    setTag((editingNote.tag as NoteTag) ?? "linux");
    setContent(editingNote.content ?? "");

    window.requestAnimationFrame(() => {
      titleInputRef.current?.focus();
    });
  }, [editingNote]);

  const resetForm = () => {
    setTitle("");
    setBullet("");
    setTag("linux");
    setContent("");
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    const notePayload: Note = {
      id: editingNote?.id ?? Date.now(),
      title: title.trim(),
      bullet: bullet.trim() || null,
      tag,
      content: content.trim(),
      createdAt: editingNote?.createdAt ?? new Date().toISOString(),
      updatedAt: isEditMode ? new Date().toISOString() : null,
    };

    if (isEditMode) {
      await onUpdateNote(notePayload);
    } else {
      await onAddNote(notePayload);
    }

    resetForm();
  };

  return (
    <form
      className={`noteForm ${isEditMode ? "isEditMode" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="formHeader">
        <div className="formBadge">{isEditMode ? "✎" : "✎"}</div>
        <div>
          <h2>{isEditMode ? "Update note" : "Create note"}</h2>
          <p>
            {isEditMode
              ? "Update your command, reminder and quick knowledge."
              : "Save useful commands, reminders and quick knowledge."}
          </p>
        </div>
      </div>

      <div className="tagSelector">
        {tags.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTag(item)}
            className={`tag tag-${item} tagButton ${tag === item ? "tagSelected" : ""}`}
          >
            #{item}
          </button>
        ))}
      </div>

      <div className="fieldGroup">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          ref={titleInputRef}
          type="text"
          placeholder="Ex: Docker port mapping"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="fieldGroup">
        <label htmlFor="note-bullet">Quick reminder</label>
        <input
          id="note-bullet"
          type="text"
          placeholder="Ex: Use -p host:container"
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
        />
      </div>

      <div className="fieldGroup">
        <label>Description</label>

        <DevEditor
          value={content}
          onChange={setContent}
          language={tag}
        />
      </div>

      <div className="noteFormActions">
        {isEditMode && (
          <button
            className="noteFormSecondaryButton"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}

        <button className="saveButton" type="submit">
          {isEditMode ? "Update note" : "Create note"}
        </button>
      </div>
    </form>
  );
}
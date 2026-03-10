import { useState } from "react";
import type { Note, NoteCategory } from "../types/note";

type Props = {
  onAddNote: (note: Note) => void;
};

const categories: NoteCategory[] = [
  "linux",
  "git",
  "php",
  "javascript",
  "devops",
  "career",
];

export default function NoteForm({ onAddNote }: Props) {
  const [title, setTitle] = useState("");
  const [quickReminder, setQuickReminder] = useState("");
  const [category, setCategory] = useState<NoteCategory>("linux");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !quickReminder || !description) return;

    onAddNote({
      id: Date.now(),
      title,
      quickReminder,
      category,
      description,
    });

    setTitle("");
    setQuickReminder("");
    setDescription("");
  };

  return (
    <form className="noteForm" onSubmit={handleSubmit}>
      <div className="formHeader">
        <div className="formBadge">✎</div>
        <div>
          <h2>Create note</h2>
          <p>Save useful commands, reminders and quick knowledge.</p>
        </div>
      </div>

      {/* CATEGORY TAG PICKER */}
      <div className="tagSelector">
        {categories.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setCategory(tag)}
            className={`tag tag-${tag} tagButton ${
              category === tag ? "tagSelected" : ""
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* TITLE */}
      <div className="fieldGroup">
        <label>Title</label>
        <input
          type="text"
          placeholder="Ex: Docker port mapping"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* QUICK REMINDER */}
      <div className="fieldGroup">
        <label>Quick reminder</label>
        <input
          type="text"
          placeholder="Ex: Use -p host:container"
          value={quickReminder}
          onChange={(e) => setQuickReminder(e.target.value)}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="fieldGroup">
        <label>Description</label>
        <textarea
          rows={6}
          placeholder="Write the useful command, explanation, context..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button className="saveButton" type="submit">
        Save note
      </button>
    </form>
  );
}
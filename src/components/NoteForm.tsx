import { useState } from "react";
import type { Note, NoteTag } from "../types/note";

type Props = {
  onAddNote: (note: Note) => void;
};

const tags: NoteTag[] = [
  "linux",
  "git",
  "php",
  "javascript",
  "devops",
  "career",
];

export default function NoteForm({ onAddNote }: Props) {
  const [title, setTitle] = useState("");
  const [bullet, setBullet] = useState("");
  const [tag, setTag] = useState<NoteTag>("linux");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    onAddNote({
      id: Date.now(),
      title: title.trim(),
      bullet: bullet.trim() || null,
      tag,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    setTitle("");
    setBullet("");
    setTag("linux");
    setContent("");
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
        <label>Title</label>
        <input
          type="text"
          placeholder="Ex: Docker port mapping"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="fieldGroup">
        <label>Quick reminder</label>
        <input
          type="text"
          placeholder="Ex: Use -p host:container"
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
        />
      </div>

      <div className="fieldGroup">
        <label>Description</label>

        
      </div>

      <button className="saveButton" type="submit">
        Save note
      </button>
    </form>
  );
}
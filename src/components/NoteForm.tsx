import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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

    if (!title.trim() || !quickReminder.trim() || !description.trim()) {
      return;
    }

    onAddNote({
      id: Date.now(),
      title: title.trim(),
      quickReminder: quickReminder.trim(),
      category,
      description: description.trim(),
    });

    setTitle("");
    setQuickReminder("");
    setCategory("linux");
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

      <div className="tagSelector">
        {categories.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setCategory(tag)}
            className={`tag tag-${tag} tagButton ${category === tag ? "tagSelected" : ""}`}
          >
            #{tag}
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
          value={quickReminder}
          onChange={(e) => setQuickReminder(e.target.value)}
        />
      </div>

      <div className="fieldGroup">
        <label>Description</label>

        <div className="editorWrapper">
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(_, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </div>
      </div>

      <button className="saveButton" type="submit">
        Save note
      </button>
    </form>
  );
}
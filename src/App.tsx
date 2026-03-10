import { useMemo, useState } from "react";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
import { initialNotes } from "./data/notes";
import type { Note } from "./types/note";
import "./styles/ui.css";

export default function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(query) ||
        note.quickReminder.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query)
      );
    });
  }, [notes, search]);

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  return (
    <main className="appShell">
      <header className="hero">
        <div>
          <p className="eyebrow">Sketch Notes</p>
          <h1>Save your dev knowledge without losing it in terminal chaos.</h1>
          <p className="heroText">
            Keep commands, reminders, snippets, and technical notes in one clean workspace.
          </p>
        </div>
      </header>
      <section className="dashboardLayout">
        <aside className="panel stickyPanel">
          <NoteForm onAddNote={handleAddNote} />
        </aside>

        <section className="resultsColumn">
          <SearchBar value={search} onChange={setSearch} />

          <section className="panel resultsPanel">
            <div className="resultsHeader">
              <div>
                <p className="eyebrow">Library</p>
                <h2>Results</h2>
              </div>
              <div className="resultsCount">
                {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
              </div>
            </div>

            <NotesList notes={filteredNotes} />
          </section>
        </section>
      </section>
    </main>
  );
}
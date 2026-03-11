import { useMemo, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
import { initialNotes } from "./data/notes";
import type { Note } from "./types/note";
import "./styles/ui.css";

function stripHtml(html: string) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) => {
      const plainDescription = stripHtml(note.description).toLowerCase();

      return (
        note.title.toLowerCase().includes(query) ||
        note.quickReminder.toLowerCase().includes(query) ||
        plainDescription.includes(query) ||
        note.category.toLowerCase().includes(query)
      );
    });
  }, [notes, search]);

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  return (
    <main className="appShell">
      <Header />

      <header className="hero">
        <div>
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
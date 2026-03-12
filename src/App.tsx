// src/App.tsx
import { useEffect, useMemo, useState } from "react";
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

const ITEMS_PER_PAGE = 4;

export default function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const orderedNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.id - a.id);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return orderedNotes;

    return orderedNotes.filter((note) => {
      const plainDescription = stripHtml(note.description).toLowerCase();

      return (
        note.title.toLowerCase().includes(query) ||
        note.quickReminder.toLowerCase().includes(query) ||
        plainDescription.includes(query) ||
        note.category.toLowerCase().includes(query)
      );
    });
  }, [orderedNotes, search]);

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, notes]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredNotes.slice(start, end);
  }, [filteredNotes, currentPage]);

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
    setCurrentPage(1);
  };

  const visiblePages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

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

            <NotesList notes={paginatedNotes} />

            {filteredNotes.length > ITEMS_PER_PAGE && (
              <div className="paginationBar">
                <button
                  type="button"
                  className="paginationButton"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  &lt;
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`paginationButton ${
                      currentPage === page ? "paginationButtonActive" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="paginationButton"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
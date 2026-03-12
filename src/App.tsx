// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import FocusAudioBar from "./components/FocusAudioBar";
import NotesList from "./components/NotesList";
import type { Note } from "./types/note";
import "./styles/ui.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";
const ITEMS_PER_PAGE = 4;

type NotesApiResponse = {
  data: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

function stripHtml(html: string) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [serverTotalNotes, setServerTotalNotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) => {
      const plainContent = stripHtml(note.content).toLowerCase();

      return (
        note.title.toLowerCase().includes(query) ||
        (note.bullet ?? "").toLowerCase().includes(query) ||
        plainContent.includes(query) ||
        note.tag.toLowerCase().includes(query)
      );
    });
  }, [notes, search]);

  const totalPages = search.trim()
    ? Math.max(1, Math.ceil(filteredNotes.length / ITEMS_PER_PAGE))
    : Math.max(1, serverTotalPages);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const pageToLoad = search.trim() ? 1 : currentPage;

        const startTime = Date.now();

        const response = await fetch(`${API_BASE_URL}/api/notes?page=${pageToLoad}`);

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const json: NotesApiResponse = await response.json();

        const elapsed = Date.now() - startTime;
        const minimumLoadingTime = 800;

        if (elapsed < minimumLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minimumLoadingTime - elapsed)
          );
        }

        setNotes(json.data);
        setServerTotalPages(json.pagination.pages || 1);
        setServerTotalNotes(json.pagination.total || 0);
      } catch (err) {
        setError("Failed to load notes.");
        setNotes([]);
        setServerTotalPages(1);
        setServerTotalNotes(0);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [currentPage, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const paginatedNotes = useMemo(() => {
    if (!search.trim()) {
      return notes;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredNotes.slice(start, end);
  }, [notes, filteredNotes, currentPage, search]);

  const handleAddNote = async (note: Note) => {
    setCurrentPage(1);

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          bullet: note.bullet,
          content: note.content,
          tag: note.tag,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const created = await response.json();

      if (search.trim()) {
        setNotes((prev) => [created.note, ...prev]);
      } else {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/notes?page=1`);

        if (!refreshResponse.ok) {
          throw new Error("Failed to refresh notes");
        }

        const refreshJson: NotesApiResponse = await refreshResponse.json();
        setNotes(refreshJson.data);
        setServerTotalPages(refreshJson.pagination.pages || 1);
        setServerTotalNotes(refreshJson.pagination.total || 0);
      }
    } catch (err) {
      setError("Failed to create note.");
    }
  };

  const visiblePages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const displayedCount = search.trim() ? filteredNotes.length : serverTotalNotes;

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
          <FocusAudioBar />
          <SearchBar value={search} onChange={setSearch} />

          <section className="panel resultsPanel">
            <div className="resultsHeader">
              <div>
                <p className="eyebrow">Library</p>
                <h2>Results</h2>
              </div>
              <div className="resultsCount">
                {displayedCount} {displayedCount === 1 ? "note" : "notes"}
              </div>
            </div>

            {error ? (
              <div className="emptyState">
                <h3>Something went wrong</h3>
                <p>{error}</p>
              </div>
            ) : (
              <NotesList notes={paginatedNotes} loading={loading} />
            )}

            {!loading && !error && totalPages > 1 && (
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
                    className={`paginationButton ${currentPage === page ? "paginationButtonActive" : ""
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="paginationButton"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
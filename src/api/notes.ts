import type { Note } from "../types/note";

export type NotesApiResponse = {
  data: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

const API_BASE_URL = "http://localhost:8082";

export async function fetchNotes(page = 1): Promise<NotesApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/notes?page=${page}`);

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
}
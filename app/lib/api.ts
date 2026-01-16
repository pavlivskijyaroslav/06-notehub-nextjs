import type { Note } from '@/app/types/note';

import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const url = `${BASE_URL}notes`;

export interface FetchNotesParams {
  page: number;
  search?: string;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchNotes = async ({
  page,
  search,
}: FetchNotesParams): Promise<NotesResponse> => {
  await delay(2000);
  const { data } = await axios.get<NotesResponse>(url, {
    params: { page, search },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return data;
};

const createNote = async (note: NoteFormValues): Promise<Note> => {
  const { data } = await axios.post<Note>(
    url,
    {
      title: note.title,
      content: note.content,
      tag: note.tag,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    },
  );
  return data;
};

const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${url}/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};

export { fetchNotes, createNote, deleteNote };

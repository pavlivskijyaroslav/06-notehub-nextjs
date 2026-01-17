import css from '@/app/components/NoteList/NoteList.module.css';

import Link from 'next/link';
import type { Note } from '@/app/types/note';
import { deleteNote } from '@/app/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
  return (
    <ul className={css.list}>
      {notes.map((item) => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <Link href={`/notes/${item.id}`} className={css.view}>
              View details
            </Link>
            <button
              className={css.button}
              onClick={() => mutation.mutate(item.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
export default NoteList;

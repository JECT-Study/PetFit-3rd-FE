import styled from 'styled-components';

import { NoteItem } from '@/features/calendar/NoteItem';
import type { Note } from '@/types/note';

interface NoteItemListProps {
  notes: Note[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NoteItemList = ({ notes, onEdit, onDelete }: NoteItemListProps) => {
  if (notes.length === 0) return null;

  return (
    <Container>
      {notes.map(note => (
        <NoteItem
          key={note.id}
          title={note.title}
          content={note.content}
          onEdit={() => onEdit(note.id)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 12px;
`;

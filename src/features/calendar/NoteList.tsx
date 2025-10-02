import styled from 'styled-components';

import { NoteItem } from '@/features/calendar/NoteItem';
import type { UiNote } from '@/types/calendar.ui';

interface NoteItemListProps {
  notes: UiNote[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NoteList = ({ notes, onEdit, onDelete }: NoteItemListProps) => {
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

const Container = styled.ul`
  & > * {
    border-bottom: 1px solid ${({ theme }) => theme.color.gray[200]};
  }
`;

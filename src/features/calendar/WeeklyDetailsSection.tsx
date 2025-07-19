import { useState } from 'react';

import styled from 'styled-components';

import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { NoteItemList } from '@/features/calendar/NoteItemList';
import { NoteModal } from '@/features/calendar/NoteModal';
import { RoutineItem } from '@/features/routine/RoutineItem';
import { useModal } from '@/hooks/useModal';
import type { Note } from '@/types/note';

interface WeeklyDetailsSectionProps {
  selectedDate: Date;
}

const createEmptyNote = (): Note => ({
  id: Date.now(),
  title: '',
  content: '',
});

const isEditing = (list: Note[], target: Note) => list.some(note => note.id === target.id);

const addOrUpdateNoteList = (list: Note[], target: Note): Note[] =>
  isEditing(list, target)
    ? list.map(note => (note.id === target.id ? target : note))
    : [...list, target];

const deleteNoteById = (list: Note[], targetId: number): Note[] =>
  list.filter(note => note.id !== targetId);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const WeeklyDetailsSection = ({ selectedDate }: WeeklyDetailsSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note>(createEmptyNote());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  const handleAddNote = () => {
    setEditingNote(createEmptyNote());
    openModal();
  };

  const handleEditNote = (id: number) => {
    const targetNote = notes.find(note => note.id === id);
    if (!targetNote) return; // 방어 코드
    setEditingNote(targetNote);
    openModal();
  };

  const handleSubmitNote = (note: Note) => {
    setNotes(prev => addOrUpdateNoteList(prev, note));
    closeModal();
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId === null) return;
    setNotes(prev => deleteNoteById(prev, deleteTargetId));
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setDeleteTargetId(null);
  };

  return (
    <Wrapper>
      <Divider />

      <MarginTop>
        <MarginBottom>
          <SectionTitle>하루 루틴</SectionTitle>
          <SectionAction onClick={handleAddNote}>특이사항 추가</SectionAction>
        </MarginBottom>

        <RoutineItem />
        <NoteItemList notes={notes} onEdit={handleEditNote} onDelete={handleDeleteRequest} />
      </MarginTop>

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialNote={editingNote} // 추가 시엔 빈 객체, 수정 시엔 기존 특이사항
        onSubmit={handleSubmitNote}
      />

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 20px;
`;

const Divider = styled.div`
  height: 10px;
  background-color: #e0e0e0;
`;

const MarginTop = styled.div`
  margin-top: 16px;
`;

const MarginBottom = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.span`
  font-weight: bold;
  font-size: 16px;
  color: #212121;
`;

const SectionAction = styled.button`
  font-size: 14px;
  color: #757575;
  text-decoration: none;
  cursor: pointer;
`;

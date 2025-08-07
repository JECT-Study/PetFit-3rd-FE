/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchDailyEntries } from '@/apis/calendar';
import { createRemark, deleteRemark, updateRemark, type RemarkResponse } from '@/apis/note';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { NoteItemList } from '@/features/calendar/NoteItemList';
import { NoteModal } from '@/features/calendar/NoteModal';
import { RoutineItem } from '@/features/routine/RoutineItem';
import { useModal } from '@/hooks/useModal';
import type { RootState } from '@/store/store';
import type { Note } from '@/types/note';
import { formatDate } from '@/utils/calendar';
import { toRemarkFormData } from '@/utils/transform/note';

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

// eslint-disable-next-line no-empty-pattern
export const WeeklyDetailsSection = ({ selectedDate }: WeeklyDetailsSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note>(createEmptyNote());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  const selectedPetId = useSelector((state: RootState) => state.selectedPet.id);

  const formattedDate = formatDate(selectedDate); // 'YYYY-MM-DD'

  // ✅ 일간 특이사항 + 루틴 조회 API 호출
  const { data } = useQuery({
    queryKey: ['dailyEntries', selectedPetId, formattedDate],
    queryFn: () => {
      if (selectedPetId === null) throw new Error('No pet selected');
      return fetchDailyEntries(selectedPetId, formattedDate);
    },
    enabled: selectedPetId !== null,
  });

  useEffect(() => {
    const remarks = data?.remarkResponseList ?? [];
    const transformed: Note[] = remarks.map(r => ({
      id: r.remarkId,
      title: r.title,
      content: r.content,
    }));
    setNotes(transformed);
  }, [data]);

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

  const handleSubmitNote = async (note: Note) => {
    if (!selectedPetId) return;

    try {
      let saved: RemarkResponse;

      if (isEditing(notes, note)) {
        // 수정
        saved = await updateRemark(note.id, {
          title: note.title,
          content: note.content,
        });
      } else {
        // 등록
        const formData = toRemarkFormData(note, selectedDate);
        saved = await createRemark(selectedPetId, formData);
      }

      setNotes(prev =>
        addOrUpdateNoteList(prev, {
          id: saved.remarkId,
          title: saved.title,
          content: saved.content,
        })
      );

      closeModal();
    } catch (err) {
      console.error('특이사항 저장 실패', err);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;

    try {
      await deleteRemark(deleteTargetId);
      setNotes(prev => deleteNoteById(prev, deleteTargetId));
    } catch (err) {
      console.error('특이사항 삭제 실패', err);
    } finally {
      setDeleteTargetId(null);
    }
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

        <RoutineItem petId={selectedPetId ?? -1} />
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
  padding: 0 20px;
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchDailyEntries } from '@/apis/calendar';
import { createRemark, deleteRemark, updateRemark, type RemarkResponse } from '@/apis/note';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { NoteItemList } from '@/features/calendar/NoteItemList';
import { NoteModal } from '@/features/calendar/NoteModal';
import { useModal } from '@/hooks/useModal';
import { setMode } from '@/store/calendarSlice';
import type { RootState } from '@/store/store';
import type { Note } from '@/types/note';
import { formatDate, isSameDay } from '@/utils/calendar';
import { toRemarkFormData } from '@/utils/transform/note';

import { CalendarRoutineList } from './CalendarRoutineList';
import { DragSwitchHandle } from './DragSwitchHandle';
import { RoutineItem } from '../routine/RoutineItem';

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
  const dispatch = useDispatch();

  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const queryClient = useQueryClient();

  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note>(createEmptyNote());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  const selectedPetId = useSelector((state: RootState) => state.selectedPet.id);

  const formattedDate = formatDate(selectedDate); // 'YYYY-MM-DD'
  const monthKey = formattedDate.slice(0, 7); // 'YYYY-MM'

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

      // ✅ 캐시 무효화로 상위 패널의 마킹(remarked) 즉시 반영
      // 일간 상세 재조회
      queryClient.invalidateQueries({
        queryKey: ['dailyEntries', selectedPetId, formattedDate],
      });
      // 월간 마킹 재조회 (상위 Monthly/Weekly 패널에서 구독 중)
      queryClient.invalidateQueries({
        queryKey: ['monthlyEntries', selectedPetId, monthKey],
      });

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

      // ✅ 삭제도 동일하게 무효화
      queryClient.invalidateQueries({
        queryKey: ['dailyEntries', selectedPetId, formattedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ['monthlyEntries', selectedPetId, monthKey],
      });
    } catch (err) {
      console.error('특이사항 삭제 실패', err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTargetId(null);
  };

  // const routines = data?.routineResponseList?.map(toRoutineModel) ?? [];
  const isToday = isSameDay(selectedDate, new Date());

  return (
    <Wrapper>
      <SlidingContent
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragging ? 'none' : 'transform 180ms ease-out',
        }}
      >
        <DragSwitchHandle
          threshold={100}
          onExpandToMonth={() => dispatch(setMode('month'))}
          onDragChange={(dy, isDragging) => {
            setDragY(dy);
            setDragging(isDragging);
          }}
        />

        <MarginTop>
          <MarginBottom>
            <SectionTitle>하루 루틴</SectionTitle>
            <SectionAction onClick={handleAddNote}>특이사항 추가</SectionAction>
          </MarginBottom>

          {isToday ? (
            <RoutineItem petId={selectedPetId ?? -1} />
          ) : (
            <CalendarRoutineList petId={selectedPetId ?? -1} selectedDate={selectedDate} />
          )}

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
      </SlidingContent>
    </Wrapper>
  );
};

const SlidingContent = styled.div`
  will-change: transform; /* GPU 합성으로 부드럽게 */
`;
const Wrapper = styled.div`
  margin-top: 20px;
  padding: 0 20px;
  overscroll-behavior: contain;
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
`;

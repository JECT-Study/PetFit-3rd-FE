// features/calendar/RemarksSection.tsx
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { NoteList } from './NoteList';
import { NoteModal } from './NoteModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import type { UiNote } from '@/types/calendar.ui';
import { useQueryClient } from '@tanstack/react-query';
import { createNote, deleteNote, updateNote } from '@/apis/calendar';
import { toRemarkCreateDto, toRemarkUpdateDto, toUiNote } from '@/utils/transform/calendar';
import type { RemarkDto } from '@/types/calendar.dto';
import { formatDate } from '@/utils/calendar';

export type NoteSectionHandle = {
  openCreate: () => void; // ✅ 부모에서 호출
};

type Props = {
  petId: number;
  selectedDate: Date;
  notes: UiNote[];
};

const createEmptyNote = (): UiNote => ({ id: Date.now(), title: '', content: '' });
const isEditing = (list: UiNote[], target: UiNote) => list.some(n => n.id === target.id);
const addOrUpdate = (list: UiNote[], target: UiNote): UiNote[] =>
  isEditing(list, target) ? list.map(n => (n.id === target.id ? target : n)) : [...list, target];
const removeById = (list: UiNote[], id: number) => list.filter(n => n.id !== id);

export const NoteSection = forwardRef<NoteSectionHandle, Props>(
  ({ petId, selectedDate, notes }, ref) => {
    const qc = useQueryClient();

    const [localNotes, setLocalNotes] = useState<UiNote[]>(notes);
    const [editing, setEditing] = useState<UiNote | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // 부모가 재조회로 내려준 notes 반영
    useEffect(() => setLocalNotes(notes), [notes]);

    const dateStr = formatDate(selectedDate);
    const monthKey = useMemo(() => dateStr.slice(0, 7), [dateStr]);

    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['dailyEntries', petId, dateStr] });
      qc.invalidateQueries({ queryKey: ['monthlyEntries', petId, monthKey] });
    };

    const openCreate = () => setEditing(createEmptyNote()); // ✅ 외부에서 호출될 함수
    useImperativeHandle(ref, () => ({ openCreate }), []);

    const onEdit = (id: number) => setEditing(localNotes.find(n => n.id === id) ?? null);
    const onRequestDelete = (id: number) => setDeleteId(id);

    const onSubmit = async (note: UiNote) => {
      if (petId <= 0) return;
      try {
        let saved: RemarkDto;
        if (isEditing(localNotes, note)) {
          saved = await updateNote(note.id, toRemarkUpdateDto(note));
        } else {
          saved = await createNote(petId, toRemarkCreateDto(note, selectedDate));
        }
        setLocalNotes(prev => addOrUpdate(prev, toUiNote(saved)));
        invalidate();
        setEditing(null);
      } catch (e) {
        console.error('특이사항 저장 실패', e);
      }
    };

    const onConfirmDelete = async () => {
      if (deleteId == null) return;
      try {
        await deleteNote(deleteId);
        setLocalNotes(prev => removeById(prev, deleteId));
        invalidate();
      } catch (e) {
        console.error('특이사항 삭제 실패', e);
      } finally {
        setDeleteId(null);
      }
    };

    return (
      <>
        <NoteList notes={localNotes} onEdit={onEdit} onDelete={onRequestDelete} />

        <NoteModal
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          initialNote={editing ?? createEmptyNote()}
          onSubmit={onSubmit}
        />

        <ConfirmDeleteModal
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={onConfirmDelete}
        />
      </>
    );
  }
);
NoteSection.displayName = 'NoteSection';

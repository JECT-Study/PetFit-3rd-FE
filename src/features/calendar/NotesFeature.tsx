// features/calendar/NotesFeature.tsx
import { forwardRef, useImperativeHandle, useState } from 'react';
import { NoteList } from './NoteList';
import { NoteModal } from './NoteModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import type { UiNote } from '@/types/calendar.ui';
import { useQueryClient } from '@tanstack/react-query';
import { createNote, deleteNote, updateNote } from '@/apis/calendar';
import { toRemarkCreateDto, toRemarkUpdateDto } from '@/utils/transform/calendar';
import { formatDate } from '@/utils/calendar';
import { useNoteForm } from '@/hooks/useNoteForm';
import type { NoteForm } from '@/types/calendar.base';

export type NotesFeatureHandle = {
  openCreate: () => void; // ✅ 부모에서 호출
};

type Props = {
  petId: number;
  selectedDate: Date;
  notes: UiNote[];
};

const createEmpty = (): NoteForm => ({ title: '', content: '' });

export const NotesFeature = forwardRef<NotesFeatureHandle, Props>(
  ({ petId, selectedDate, notes }, ref) => {
    const qc = useQueryClient();

    // 드래프트(편집 중 1건) + 편집/삭제 대상 id만 로컬로 관리
    const [draft, setDraft] = useState<NoteForm | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const dateStr = formatDate(selectedDate);
    const monthKey = dateStr.slice(0, 7);

    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['dailyEntries', petId, dateStr] });
      qc.invalidateQueries({ queryKey: ['monthlyEntries', petId, monthKey] });
    };

    // 폼 훅(터치/에러/트림/변경 핸들러)
    const { errors, canSave, onChange, onBlurField, resetTouched } = useNoteForm(draft, setDraft);

    // 외부 버튼 → 새 드래프트 오픈
    const openCreate = () => {
      setEditingId(null);
      setDraft(createEmpty());
      resetTouched();
    };
    useImperativeHandle(ref, () => ({ openCreate }), [resetTouched]);

    // 편집/삭제 진입
    const handleEdit = (id: number) => {
      const found = notes.find(n => n.id === id);
      if (!found) return;
      setEditingId(found.id);
      setDraft({ title: found.title, content: found.content });
      resetTouched();
    };
    // 삭제 진입
    const handleRequestDelete = (id: number) => setDeleteId(id);

    // 저장
    const handleSubmit = async () => {
      if (!draft || petId <= 0 || !canSave) return;

      try {
        if (editingId == null) {
          await createNote(petId, toRemarkCreateDto(draft, selectedDate)); // 생성
        } else {
          await updateNote(editingId, toRemarkUpdateDto(draft)); // 수정
        }
        // 목록은 invalidate로 새로고침(서버 상태 신뢰)
        invalidate();
        setDraft(null);
        setEditingId(null);
      } catch (e) {
        console.error('특이사항 저장 실패', e);
      }
    };

    //삭제
    const handleConfirmDelete = async () => {
      if (deleteId == null) return;
      try {
        await deleteNote(deleteId);
        invalidate();
      } catch (e) {
        console.error('특이사항 삭제 실패', e);
      } finally {
        setDeleteId(null);
      }
    };

    return (
      <>
        <NoteList notes={notes} onEdit={handleEdit} onDelete={handleRequestDelete} />

        <NoteModal
          open={!!draft}
          onClose={() => {
            setDraft(null);
            setEditingId(null);
          }}
          note={draft ?? createEmpty()}
          errors={errors}
          canSave={canSave}
          onChange={onChange}
          onBlurField={onBlurField}
          onSubmit={handleSubmit}
        />

        <ConfirmDeleteModal
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  }
);
NotesFeature.displayName = 'NotesFeature';

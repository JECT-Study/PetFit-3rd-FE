import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { validators } from '@/utils/validators';
import type { EditableNote, NoteField } from '@/types/calendar.ui';
import type { NoteForm } from '@/types/calendar.base';

type NoteErrors = { title: string | null; content: string | null };

export const useNoteForm = (
  draft: NoteForm | null,
  setDraft: Dispatch<SetStateAction<NoteForm | null>>
) => {
  const [touched, setTouched] = useState<Partial<Record<NoteField, boolean>>>({});

  // 드래프트가 바뀌면 터치 상태 초기화
  useEffect(() => {
    if (!draft) return;
    setTouched({});
  }, [draft?.title, draft?.content]);

  // 실제 유효성(표시 여부와 무관)
  const rawErrors: NoteErrors = useMemo(() => {
    if (!draft) return { title: null, content: null };

    const t = validators.title(draft.title);
    const c = validators.content(draft.content);

    return {
      title: t.isValid ? null : t.message,
      content: c.isValid ? null : c.message,
    };
  }, [draft && draft.title, draft && draft.content]);

  // 화면에 표시할 에러(터치된 필드만 노출)
  const errors: NoteErrors = {
    title: touched.title ? rawErrors.title : null,
    content: touched.content ? rawErrors.content : null,
  };

  const canSave = !rawErrors.title && !rawErrors.content;

  // 필드 변경 (draft가 null이면 no-op)
  const onChange = <K extends NoteField>(k: K, v: EditableNote[K]) => {
    setDraft(prev => (prev ? { ...prev, [k]: v } : prev));
  };

  const onBlurField = (field: NoteField) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const resetTouched = () => setTouched({});

  return { errors, canSave, onChange, onBlurField, resetTouched };
};

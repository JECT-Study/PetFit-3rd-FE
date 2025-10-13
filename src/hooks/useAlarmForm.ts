import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { AlarmForm } from '@/types/alarm.base';
import { validators } from '@/utils/validators';

export type AlarmField = 'title' | 'content' | 'date' | 'hour' | 'minute';
export type EditableAlarm = Pick<AlarmForm, AlarmField>;
type AlarmErrors = { title: string | null; content: string | null };

export const useAlarmForm = (
  draft: AlarmForm | null,
  setDraft: Dispatch<SetStateAction<AlarmForm | null>>
) => {
  const [touched, setTouched] = useState<Partial<Record<AlarmField, boolean>>>({});

  useEffect(() => {
    if (!draft) return;
    setTouched({});
  }, [draft && draft.title, draft && draft.content]);

  // 실제 유효성: title/content만
  const rawErrors: AlarmErrors = useMemo(() => {
    if (!draft) return { title: null, content: null };
    const t = validators.title(draft.title);
    const c = validators.content(draft.content);
    return {
      title: t.isValid ? null : t.message,
      content: c.isValid ? null : c.message,
    };
  }, [draft && draft.title, draft && draft.content]);

  // 표시용 에러(터치된 필드만)
  const errors: AlarmErrors = {
    title: touched.title ? rawErrors.title : null,
    content: touched.content ? rawErrors.content : null,
  };

  const canSave = !rawErrors.title && !rawErrors.content;

  const onChange = <K extends AlarmField>(k: K, v: EditableAlarm[K]) => {
    setDraft(prev => (prev ? { ...prev, [k]: v } : prev));
  };

  const onBlurField = (field: AlarmField) => setTouched(prev => ({ ...prev, [field]: true }));
  const resetTouched = () => setTouched({});

  return { errors, canSave, onChange, onBlurField, resetTouched };
};

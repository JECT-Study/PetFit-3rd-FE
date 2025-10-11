import type { EditableNote, NoteField } from '@/types/calendar.ui';
import { Modal } from '@/ds/Modal';
import { Button } from '@/ds/Button';
import { useImeMaxLength } from '@/hooks/useImeMaxLength';
import {
  NOTE_CONTENT_INPUT_MAX,
  NOTE_CONTENT_VALIDATE_MAX,
  NOTE_TITLE_INPUT_MAX,
  NOTE_TITLE_VALIDATE_MAX,
} from '@/constants/note';
import { Field } from '@/ds/Field';
import { InputBase } from '@/ds/InputBase';
import { TextareaBase } from '@/ds/TextareaBase';
import type { NoteForm } from '@/types/calendar.base';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;

  note: NoteForm; // 드래프트 표시용
  errors: { title: string | null; content: string | null };
  canSave: boolean;

  onChange: <K extends NoteField>(k: K, v: EditableNote[K]) => void;
  onBlurField: (field: NoteField) => void;
  onSubmit: () => void; // 부모가 저장까지 처리
}

export const NoteModal = ({
  open,
  onClose,
  note,
  errors,
  canSave,
  onChange,
  onBlurField,
  onSubmit,
}: NoteModalProps) => {
  const titleIme = useImeMaxLength({
    setValue: v => onChange('title', v),
    max: NOTE_TITLE_INPUT_MAX,
  });
  const contentIme = useImeMaxLength({
    setValue: v => onChange('content', v),
    max: NOTE_CONTENT_INPUT_MAX,
  });

  return (
    <Modal
      open={open}
      onOpenChange={v => {
        if (!v) onClose(); // ✅ Modal이 닫힐 때 부모 onClose 호출
      }}
      title="특이사항"
      showClose
      footer={
        <Button size="lg" fullWidth disabled={!canSave} onClick={onSubmit}>
          저장
        </Button>
      }
    >
      <Field
        label="제목"
        hint={errors.title ?? null}
        invalid={!!errors.title}
        count={note.title.length}
        max={NOTE_TITLE_VALIDATE_MAX}
      >
        <InputBase
          id="note-title"
          placeholder="특이사항 제목을 입력해주세요."
          value={note.title}
          onChange={titleIme.imeOnChange} // ✅ IME 안전 onChange
          onCompositionEnd={titleIme.imeOnCompositionEnd} // ✅ 조합 종료 보정
          onPaste={titleIme.imeOnPaste} // ✅ 붙여넣기 보정
          onBlur={() => onBlurField('title')}
          maxLength={NOTE_TITLE_INPUT_MAX}
        />
      </Field>

      <Field
        label="내용"
        hint={errors.content ?? null}
        invalid={!!errors.content}
        count={note.content.length}
        max={NOTE_CONTENT_VALIDATE_MAX}
      >
        <TextareaBase
          id="note-content"
          placeholder="내용을 입력해주세요."
          value={note.content}
          onChange={contentIme.imeOnChange} // ✅ IME 안전 onChange
          onCompositionEnd={contentIme.imeOnCompositionEnd} // ✅ 조합 종료 보정
          onPaste={contentIme.imeOnPaste} // ✅ 붙여넣기 보정
          onBlur={() => onBlurField('content')}
          maxLength={NOTE_CONTENT_INPUT_MAX}
        />
      </Field>
    </Modal>
  );
};

import { CustomDatePicker } from '@/components/CustomDatePicker';
import type { AlarmField, EditableAlarm } from '@/hooks/useAlarmForm';
import { useImeMaxLength } from '@/hooks/useImeMaxLength';
import {
  ALARM_CONTENT_INPUT_MAX,
  ALARM_CONTENT_VALIDATE_MAX,
  ALARM_TITLE_INPUT_MAX,
  ALARM_TITLE_VALIDATE_MAX,
} from '@/constants/alarm';
import { Modal } from '@/ds/Modal';
import { Button } from '@/ds/Button';
import { Field } from '@/ds/Field';
import { TextareaBase } from '@/ds/TextareaBase';
import { InputBase } from '@/ds/InputBase';
import type { AlarmForm } from '@/types/alarm.base';
import { TimePicker } from './TimePicker';

interface AlarmModalProps {
  open: boolean;
  onClose: () => void;
  alarm: AlarmForm;
  errors: { title: string | null; content: string | null };
  canSave: boolean;
  onChange: <K extends AlarmField>(k: K, v: EditableAlarm[K]) => void;
  onBlurField: (field: AlarmField) => void;
  onSubmit: () => void;
}

export const AlarmModal = ({
  open,
  onClose,
  alarm,
  errors,
  canSave,
  onChange,
  onBlurField,
  onSubmit,
}: AlarmModalProps) => {
  const titleIme = useImeMaxLength({
    setValue: v => onChange('title', v),
    max: ALARM_TITLE_INPUT_MAX,
  });
  const contentIme = useImeMaxLength({
    setValue: v => onChange('content', v),
    max: ALARM_CONTENT_INPUT_MAX,
  });

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit();
    onClose();
  };

  return (
    <Modal
      open={open}
      onOpenChange={v => {
        if (!v) onClose();
      }}
      title="알람"
      labelledBy="알람 추가"
      showClose
      footer={
        <Button size="lg" fullWidth disabled={!canSave} onClick={handleSubmit}>
          저장
        </Button>
      }
    >
      <Field
        label="제목"
        hint={errors.title ?? null}
        invalid={!!errors.title}
        count={alarm.title.length}
        max={ALARM_TITLE_VALIDATE_MAX}
      >
        <InputBase
          id="alarm-title"
          placeholder="알람 제목을 입력해주세요."
          value={alarm.title}
          onChange={titleIme.imeOnChange}
          onCompositionEnd={titleIme.imeOnCompositionEnd}
          onPaste={titleIme.imeOnPaste}
          onBlur={() => onBlurField('title')}
          maxLength={ALARM_TITLE_INPUT_MAX}
        />
      </Field>

      <CustomDatePicker fieldLabel="날짜" value={alarm.date} onChange={d => onChange('date', d)} />

      <Field label="시간" showHelper={false}>
        {/* TimePicker가 (hour, minute, onChange) 시그니처라고 가정 */}
        <TimePicker
          hour24={alarm.hour}
          minute={alarm.minute}
          onChange={(h: number, m: number) => {
            onChange('hour', h);
            onChange('minute', m);
          }}
        />
      </Field>

      <Field
        label="내용"
        hint={errors.content ?? null}
        invalid={!!errors.content}
        count={alarm.content.length}
        max={ALARM_CONTENT_VALIDATE_MAX}
      >
        <TextareaBase
          id="alarm-content"
          placeholder="내용을 입력해주세요."
          value={alarm.content}
          onChange={contentIme.imeOnChange}
          onCompositionEnd={contentIme.imeOnCompositionEnd}
          onPaste={contentIme.imeOnPaste}
          onBlur={() => onBlurField('content')}
          maxLength={ALARM_CONTENT_INPUT_MAX}
        />
      </Field>
    </Modal>
  );
};

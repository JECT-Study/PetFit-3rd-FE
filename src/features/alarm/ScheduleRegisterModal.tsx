import { useEffect, useState } from 'react';

import { X } from 'lucide-react';
import styled from 'styled-components';

import { BaseModal } from '@/components/common/BaseModal';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import type { Alarm } from '@/types/alarm';
import {
  getTitleValidationMessage,
  isValidAlarmTitle,
  MAX_TITLE_LENGTH,
} from '@/utils/alarmValidation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialAlarm: Alarm;
  onSubmit: (alarm: Alarm) => void;
}

export const ScheduleRegisterModal = ({ isOpen, onClose, initialAlarm, onSubmit }: Props) => {
  const [alarm, setAlarm] = useState<Alarm>(initialAlarm);
  const [isTitleTouched, setIsTitleTouched] = useState(false);

  // 모달 열릴 때 초기 상태 설정 (부모의 initialAlarm 상태와 동기화)
  useEffect(() => {
    if (isOpen) {
      setAlarm(initialAlarm);
      setIsTitleTouched(false);
    }
  }, [isOpen, initialAlarm]);

  const isTitleInvalid = isTitleTouched && !isValidAlarmTitle(alarm.title);
  const titleErrorMessage = isTitleTouched ? getTitleValidationMessage(alarm.title) : undefined;

  const handleClose = () => {
    setIsTitleTouched(false); // 1. 입력 검증 상태 초기화
    onClose(); // 2. 외부에서 넘겨준 닫기 콜백 실행 (부모 상태 초기화 및 모달 닫기)
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTitleTouched(true);
    setAlarm({ ...alarm, title: e.target.value });
  };

  const handleSubmit = () => {
    if (!alarm.title || !alarm.startDate) return;
    onSubmit(alarm);
    handleClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose}>
      <ModalWrapper>
        <CloseButton onClick={handleClose}>
          <X size={24} />
        </CloseButton>

        <Form>
          <Label>시작 날짜</Label>
          <CustomDatePicker
            value={alarm.startDate}
            onChange={startDate => setAlarm({ ...alarm, startDate })}
          />

          <FormInput
            value={alarm.title}
            onChange={handleTitleChange}
            onBlur={() => setIsTitleTouched(true)}
            hasError={isTitleInvalid}
            errorMessage={titleErrorMessage}
            placeholder="할 일의 제목을 입력해주세요."
            maxLength={MAX_TITLE_LENGTH}
          />

          <FormTextarea
            value={alarm.description}
            onChange={e => setAlarm({ ...alarm, description: e.target.value })}
            placeholder="내용을 입력해주세요."
            maxLength={200}
          />

          <SubmitButton onClick={handleSubmit} disabled={!alarm.startDate || !alarm.title}>
            저장
          </SubmitButton>
        </Form>
      </ModalWrapper>
    </BaseModal>
  );
};

const ModalWrapper = styled.div`
  position: relative;
  padding-top: 24px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  cursor: pointer;

  svg {
    stroke: #333;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  padding: 16px 0;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  background-color: ${({ disabled }) => (disabled ? '#eee' : '#facc15')};
  color: ${({ disabled }) => (disabled ? '#999' : '#222')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

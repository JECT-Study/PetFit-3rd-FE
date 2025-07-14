import { useEffect, useMemo, useState } from 'react';

import { X } from 'lucide-react';
import styled from 'styled-components';

import { BaseModal } from '@/components/common/BaseModal';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import type { Alarm } from '@/types/alarm';

interface ScheduleRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAlarm: Alarm;
  onSubmit: (alarm: Alarm) => void;
}

export const ScheduleRegisterModal = ({
  isOpen,
  onClose,
  initialAlarm,
  onSubmit,
}: ScheduleRegisterModalProps) => {
  const [alarm, setAlarm] = useState<Alarm>(initialAlarm);

  const [formValidity, setFormValidity] = useState({
    startDate: true,
    title: false,
    content: false,
  });

  // 모달 열릴 때 초기 상태 설정 (부모의 initialAlarm 상태와 동기화)
  useEffect(() => {
    if (isOpen) {
      setAlarm(initialAlarm);
      setFormValidity({ startDate: true, title: false, content: false });
    }
  }, [isOpen, initialAlarm]);

  const fieldValidHandlers = useMemo(
    () => ({
      title: (isValid: boolean) => setFormValidity(prev => ({ ...prev, title: isValid })),
      content: (isValid: boolean) => setFormValidity(prev => ({ ...prev, content: isValid })),
    }),
    []
  );

  // 유효성 상태 → 전체 폼 유효 여부 판단
  const isFormValid = useMemo(() => Object.values(formValidity).every(Boolean), [formValidity]);

  const handleClose = () => {
    onClose(); // 1. 외부에서 넘겨준 닫기 콜백 실행 (부모 상태 초기화 및 모달 닫기)
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
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
          <CustomDatePicker
            label="시작 날짜"
            value={alarm.startDate}
            onChange={startDate => setAlarm({ ...alarm, startDate })}
          />

          <FormInput
            value={alarm.title}
            onChange={e => setAlarm(prev => ({ ...prev, title: e.target.value }))}
            validationType="title"
            placeholder="할 일의 제목을 입력해주세요."
            onFieldValidChange={fieldValidHandlers.title}
          />

          <FormTextarea
            value={alarm.description}
            onChange={e => setAlarm(prev => ({ ...prev, description: e.target.value }))}
            validationType="content"
            placeholder="내용을 입력해주세요."
            onFieldValidChange={fieldValidHandlers.content}
          />

          <SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
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

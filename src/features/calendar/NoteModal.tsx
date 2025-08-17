import { useCallback, useEffect, useMemo, useState } from 'react';

import { X } from 'lucide-react';
import styled from 'styled-components';

import { BaseModal } from '@/components/common/BaseModal';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import type { Note } from '@/types/note';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote: Note;
  onSubmit: (note: Note) => void;
}

export const NoteModal = ({ isOpen, onClose, initialNote, onSubmit }: NoteModalProps) => {
  const [note, setNote] = useState<Note>(initialNote);
  const [formValidity, setFormValidity] = useState({
    title: false,
    content: false,
  });

  useEffect(() => {
    if (isOpen) {
      setNote(initialNote);
      setFormValidity({
        title: true,
        content: true,
      });
    }
  }, [isOpen, initialNote]);

  const isFormValid = useMemo(() => Object.values(formValidity).every(Boolean), [formValidity]);

  // ✅ useCallback으로 고정
  const handleFieldValidChange = useCallback((field: 'title' | 'content', isValid: boolean) => {
    setFormValidity(prev => ({ ...prev, [field]: isValid }));
  }, []);

  // ✅ 필드별 핸들러 useCallback으로 고정
  const titleValidHandler = useCallback(
    (isValid: boolean) => handleFieldValidChange('title', isValid),
    [handleFieldValidChange]
  );
  const contentValidHandler = useCallback(
    (isValid: boolean) => handleFieldValidChange('content', isValid),
    [handleFieldValidChange]
  );

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit(note);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <FormInput
          label="특이사항 제목"
          value={note.title}
          onChange={e => setNote(prev => ({ ...prev, title: e.target.value }))}
          validationType="title"
          placeholder="특이사항 제목을 입력해주세요."
          onFieldValidChange={titleValidHandler}
        />

        <FormTextarea
          label="특이사항 내용"
          value={note.content}
          onChange={e => setNote(prev => ({ ...prev, content: e.target.value }))}
          validationType="content"
          placeholder="내용을 입력해주세요."
          onFieldValidChange={contentValidHandler}
        />

        <SaveButton onClick={handleSubmit} $disabled={!isFormValid}>
          저장
        </SaveButton>
      </ModalContainer>
    </BaseModal>
  );
};

const ModalContainer = styled.div`
  position: relative;
  padding-top: 24px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;

  svg {
    stroke: #373737;
  }
`;

const SaveButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  margin-top: 16px;
  padding: 12px 0;
  background-color: ${({ $disabled }) => ($disabled ? '#eee' : '#facc15')};
  border-radius: 10px;
  color: ${({ $disabled }) => ($disabled ? '#999' : '#222')};
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

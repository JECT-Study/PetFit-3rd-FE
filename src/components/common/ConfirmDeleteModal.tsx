import styled from 'styled-components';

import { BaseModal } from './BaseModal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        <Text>정말 삭제하시겠어요?</Text>
        <ButtonGroup>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <DeleteButton onClick={onConfirm}>삭제하기</DeleteButton>
        </ButtonGroup>
      </Wrapper>
    </BaseModal>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Text = styled.p`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.45px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 8px 0;
  color: #a5a5a5;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 8px 0;
  color: #f0f0f0;
  background: #ff5c33;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
`;

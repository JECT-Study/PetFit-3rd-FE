import styled from 'styled-components';

import { BaseModal } from '@/components/common/BaseModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal = ({ isOpen, onClose }: Props) => {
  // api 연결 시 로그아웃 구현 예정
  const onConfirm = () => {};

  return (
    <div>
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <Message>정말 로그아웃하시겠어요?</Message>
        <ButtonRow>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>로그아웃</ConfirmButton>
        </ButtonRow>
      </BaseModal>
    </div>
  );
};

const Message = styled.p`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;

  color: #a5a5a5;
  background: #f0f0f0;
  border-radius: 6px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;

  color: #373737;
  background: #ffc533;
  border-radius: 6px;
`;

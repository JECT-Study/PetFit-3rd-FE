import styled from 'styled-components';

import { BaseModal } from '@/components/common/BaseModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NonUnitModal = ({ isOpen, onClose }: Props) => {
  return (
    <div>
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <Message>기본값으로 제공돼요</Message>
        <Description>배변, 치아, 피부, 털에 대한 이상증상은</Description>
        <Description>나중에 입력할 수 있어요.</Description>
        <ButtonRow>
          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
        </ButtonRow>
      </BaseModal>
    </div>
  );
};

const Message = styled.p`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
`;

const Description = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: 400;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;

  color: #373737;
  background: #ffc533;
  border-radius: 6px;
`;

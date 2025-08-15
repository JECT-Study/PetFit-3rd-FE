import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { kakaoWithdraw } from '@/apis/auth';
import { BaseModal } from '@/components/common/BaseModal';
import type { RootState } from '@/store/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const memberId = useSelector((s: RootState) => s.user.memberId);

  const onConfirm = async () => {
    try {
      await kakaoWithdraw(memberId);
      // 개발 환경
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      navigate('/login');
    } catch (error) {
      console.log('회원 탈퇴 failed : ', error);
    }
  };

  return (
    <div>
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <Message>정말 탈퇴하시겠어요?</Message>
        <ButtonRow>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>탈퇴하기</ConfirmButton>
        </ButtonRow>
      </BaseModal>
    </div>
  );
};

const Message = styled.p`
  font-size: 18px;
  font-weight: 500;
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

  color: #ffffff;
  background: #ff5c33;
  border-radius: 6px;
`;

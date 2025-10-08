import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { SquareCheckBig } from 'lucide-react';
import styled from 'styled-components';

import { getNickname } from '@/apis/auth';
import { TitleHeader } from '@/components/common/TitleHeader';
import { WithdrawModal } from '@/features/mypage/WithdrawModal';

import WithdrawDog from '@/assets/icons/withdraw-dog.svg?react';
export const WithdrawPage = () => {
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getNickname(),
  });

  const handleAgreeClick = () => {
    if (!agreed) {
      setAgreed(true);
      setWithdrawModal(true);
    } else {
      setAgreed(false);
    }
  };

  const handleModalClose = () => {
    setWithdrawModal(false);
    setAgreed(false);
  };

  return (
    <>
      <TitleHeader title="탈퇴하기" showBack={true} />
      <Container>
        <Content>
          <WithdrawDog />
          <Title>{userInfo?.nickname} 님</Title>
          <Title>정말 탈퇴하시겠어요?</Title>
          <Description>
            계정을 삭제하면 반려동물의 모든 정보가 영구적으로 사라져서 복구할 수 없어요.
          </Description>
        </Content>
        <Checkbox>
          <AgreeButton onClick={handleAgreeClick} $checked={agreed}>
            <SquareCheckBig size={18} color={agreed ? '#FFC533' : '#A5A5A5'} />
            해당 사항을 모두 인지했으며, 이에 동의합니다.
          </AgreeButton>
        </Checkbox>
      </Container>
      <WithdrawModal isOpen={withdrawModal} onClose={handleModalClose} />
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 24px 24px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 70px 40px 0;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.div`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 400;
  color: #a5a5a5;
`;

const Checkbox = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 80px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const AgreeButton = styled.button<{ $checked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  color: ${({ $checked }) => ($checked ? '#000000' : '#A5A5A5')};
`;

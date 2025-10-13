import styled, { keyframes } from 'styled-components';
import { BaseModal } from '@/components/common/BaseModal';
import { tx } from '@/styles/typography';
import AILoadingSpinner from '@/assets/icons/AILoadingSpinner.svg?react';

interface Props {
  isOpen: boolean;
}

export const AIReportLoadingModal = ({ isOpen }: Props) => {
  return (
    <BaseModal isOpen={isOpen} onClose={() => {}}>
      <Container>
        <Title>AI 진단받기</Title>
        <SubText>약 20초 정도 소요됩니다.</SubText>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      </Container>
    </BaseModal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  ${tx.title('semi18')};
`;

const SubText = styled.div`
  margin-top: 10px;
  ${tx.body('semi14')};
  color: ${({ theme }) => theme.color.gray[500]};
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  margin: 20px 0;
  width: 100px;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled(AILoadingSpinner)`
  width: 100px;
  height: 88px;
  animation: ${spin} 2s linear infinite;
  transform-origin: center;
`;

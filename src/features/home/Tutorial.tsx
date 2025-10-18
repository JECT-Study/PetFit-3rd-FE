import styled, { keyframes } from 'styled-components';
import HandIcon from '@/assets/icons/hand.svg?react';
import { tx } from '@/styles/typography';

export const Tutorial = ({ onClose }: { onClose: () => void }) => {
  return (
    <Overlay onClick={onClose}>
      <Dimmed />
      <Content>
        <ImageContainer>
          <HandIcon width={80} height={80} />
          <ArrowContainer>
            <Arrow $direction="left">←</Arrow>
            <Arrow $direction="right">→</Arrow>
          </ArrowContainer>
        </ImageContainer>
        <Text>좌우로 스와이프해서</Text>
        <Text>루틴을 달성해보세요</Text>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const Dimmed = styled.div`
  width: 100%;
  height: 100%;
  background-color: #00000099;
`;

const Content = styled.div`
  position: absolute;
  top: 63%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: ${({ theme }) => theme.color.white};
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ArrowContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  width: 100px;
`;

const move = keyframes`
  0% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  100% { transform: translateX(-5px); }
`;

const Arrow = styled.span<{ $direction: 'left' | 'right' }>`
  font-size: 24px;
  animation: ${move} 1.5s infinite ease-in-out;
  animation-direction: ${({ $direction }) => ($direction === 'left' ? 'reverse' : 'normal')};
  color: ${({ $direction, theme }) =>
    $direction === 'left' ? theme.color.warning[500] : theme.color.sub[500]};
`;

const Text = styled.div`
  ${tx.body('med16')};
`;

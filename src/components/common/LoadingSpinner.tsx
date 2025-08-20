import styled, { keyframes } from 'styled-components';

export const LoadingSpinner = () => {
  return (
    <Overlay>
      <Spinner />
    </Overlay>
  );
};

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: absolute; /* 부모 컴포넌트 안에서만 덮임 */
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  z-index: 1;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 197, 51, 0.3);
  border-top-color: #ffc533;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

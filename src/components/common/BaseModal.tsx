import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';
import styled, { keyframes, css } from 'styled-components';

type ModalProps = { isOpen: boolean; onClose: () => void; children: React.ReactNode };

export const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      setIsAnimating(true);
    } else if (isAnimating) {
      // 모달 닫힐 때 애니메이션 완료이 끝나면 스크롤 복원
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        setIsAnimating(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isAnimating]);

  // 모달 밖에 눌렀을 때 모달 닫힘
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent $isOpen={isOpen}>{children}</ModalContent>
    </ModalOverlay>,
    document.body
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const fadeMotion = css<{ $isOpen: boolean }>`
  animation: ${({ $isOpen }) => ($isOpen ? fadeIn : fadeOut)} 0.2s
    ${({ $isOpen }) => ($isOpen ? 'ease-out' : 'ease-in')} forwards;
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #4a4a4acc;

  ${fadeMotion};
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  position: relative;

  width: auto;
  min-width: 300px;
  max-width: 90%;
  padding: 22px;

  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  ${fadeMotion};
`;

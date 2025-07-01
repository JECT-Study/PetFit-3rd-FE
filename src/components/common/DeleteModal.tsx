import styled from 'styled-components';

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({ open, onCancel, onConfirm }: DeleteModalProps) => {
  if (!open) return null;

  return (
    <Overlay>
      <Container>
        <Message>정말 삭제하시겠어요?</Message>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <DeleteButton onClick={onConfirm}>삭제하기</DeleteButton>
        </ButtonGroup>
      </Container>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  width: 230px;
  background: white;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Message = styled.p`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px 0;
  background: #f5f5f5;
  color: #757575;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 10px 0;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

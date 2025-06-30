import { X } from 'lucide-react';
import styled from 'styled-components';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
}

export const NoteModal = ({ open, onClose }: NoteModalProps) => {
  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <span style={{ paddingLeft: '8px' }}>특이사항 제목</span>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Input placeholder="특이사항 제목을 입력해주세요." maxLength={20} />
        <CharCount>0/20</CharCount>

        <Label>특이사항 내용</Label>
        <Textarea placeholder="내용을 입력해주세요." maxLength={200} />
        <CharCount>0/200</CharCount>

        <SaveButton disabled>저장</SaveButton>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 320px;
  background-color: white;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #f5c46a;
  background-color: #fff8e1;
  margin-bottom: 4px;
`;

const Label = styled.div`
  font-size: 14px;
  margin: 12px 0 4px;
  padding-left: 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #f5c46a;
  background-color: #fff8e1;
  resize: none;
`;

const CharCount = styled.div`
  font-size: 12px;
  text-align: right;
  color: #999;
  margin-top: 4px;
`;

const SaveButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 12px 0;
  background-color: #e0e0e0;
  border-radius: 10px;
  color: #999;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: default;
`;

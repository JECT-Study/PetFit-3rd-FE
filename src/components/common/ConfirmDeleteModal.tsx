import { Modal } from '@/ds/Modal';
import { Button } from '@/ds/Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={v => {
        if (!v) onClose();
      }}
      size="sm"
      title="정말 삭제하시겠어요?"
      showClose={false}
      footer={
        <>
          <Button size="sm" variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button size="sm" variant="destructive" onClick={onConfirm}>
            삭제하기
          </Button>
        </>
      }
    />
  );
};

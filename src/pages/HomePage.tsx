import { BaseModal } from '@/components/common/BaseModal';
import { useModal } from '@/hooks/useModal';

export const HomePage = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      홈화면
      <div>
        <button onClick={openModal}>모달 열기 버튼</button>
        <BaseModal isOpen={isOpen} onClose={closeModal}>
          <p>모달 내용</p>
        </BaseModal>
      </div>
    </div>
  );
};

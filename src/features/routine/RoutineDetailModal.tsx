import { useState, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import { memoRoutine } from '@/apis/routine';
import { BaseModal } from '@/components/common/BaseModal';
import { SLOT_ITEMS } from '@/constants/slot';
import type { SlotId } from '@/types/routine';
import { formatDate } from '@/utils/calendar';

interface Props {
  slotId: SlotId;
  isOpen: boolean;
  petId: number;
  onClose: () => void;
  initial?: { amount?: number; memo?: string | '' };
}

export const RoutineDetailModal = ({
  slotId,
  isOpen,
  petId,
  onClose,
  initial = { memo: '' },
}: Props) => {
  const slot = SLOT_ITEMS.find(slot => slot.id === slotId)!;
  const hasAmount = slot.unit !== null;
  const today = formatDate(new Date());
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  // 모달이 열릴 때마다 초기값 세팅
  useEffect(() => {
    if (isOpen) {
      setAmount(initial.amount?.toString() ?? '');
      setMemo(initial.memo ?? '');
    }
  }, [isOpen, slotId]);

  const isValid = hasAmount
    ? amount.trim() !== '' && memo.length <= 200
    : memo.trim() !== '' && memo.length <= 200;

  const handleSave = async () => {
    if (!isValid) return;

    const body = {
      actualAmount: hasAmount ? Number(amount) : undefined,
      content: memo ? memo.trim() : null,
    };

    await memoRoutine(petId, today, slotId, body);
    queryClient.invalidateQueries({ queryKey: ['dailyRoutine', petId, today] });

    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Header>
        <h2>{slot.label} 정보</h2>
        <Close onClick={onClose}>✕</Close>
      </Header>

      <Content>
        {hasAmount && (
          <Field>
            <FieldTitle>
              {slot.label} (단위: {slot.unit})
            </FieldTitle>
            <AmountInput
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              value={amount}
              placeholder="숫자를 입력해주세요."
              onChange={e => {
                const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                setAmount(onlyNumbers);
              }}
            />
            <InputLength>{amount.length}/5</InputLength>
          </Field>
        )}

        <Field>
          <FieldTitle>메모</FieldTitle>
          <MemoInput
            maxLength={200}
            value={memo}
            placeholder="내용을 입력해주세요."
            onChange={e => setMemo(e.target.value)}
          />
          <InputLength>{memo.length}/200</InputLength>
        </Field>
      </Content>

      <SaveButton disabled={!isValid} onClick={handleSave}>
        저장
      </SaveButton>
    </BaseModal>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;

  h2 {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
`;

const Close = styled.button`
  font-size: 20px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #4d4d4d;
`;

const AmountInput = styled.input`
  padding: 10px 12px;
  font-size: 14px;
  background: #fff8e5;
  border: 1px solid #ffc533;
  border-radius: 8px;
`;

const MemoInput = styled.textarea`
  height: 100px;
  padding: 12px;
  font-size: 14px;
  background: #fff8e5;
  border: 1px solid #ffc533;
  border-radius: 8px;
  resize: none;
`;

const InputLength = styled.span`
  align-self: flex-end;
  font-size: 12px;
  color: #a5a5a5;
`;

const SaveButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  margin-top: 8px;
  padding: 14px 0;

  font-size: 18px;
  font-weight: 600;

  color: ${({ disabled }) => (disabled ? '##A5A5A5' : '#373737')};
  background: ${({ disabled }) => (disabled ? '#F0F0F0' : '#FFC533')};
  border: ${({ disabled }) => (disabled ? '#DDDDDD' : '#FFC533')};
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`;

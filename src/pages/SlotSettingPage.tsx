import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { getSlot } from '@/apis/slot';
import { TitleHeader } from '@/components/common/TitleHeader';
import { SlotButton } from '@/features/slot/SlotButton';
import { SlotInput } from '@/features/slot/SlotInput';
import type { SlotType } from '@/types/slot';

import EmptyRoutine from '@/assets/icons/empty-routine.svg?react';

export const SlotSettingPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [defaultValues, setDefaultValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchSlot = async () => {
      const data: SlotType = await getSlot(1);
      // ✅ 활성화된 루틴 추출
      const newSelectedIds: string[] = [];
      const values: Record<string, number> = {};

      if (data.feedActivated) {
        newSelectedIds.push('meal');
        values['meal'] = data.feedAmount ?? 0;
      }
      if (data.waterActivated) {
        newSelectedIds.push('water');
        values['water'] = data.waterAmount ?? 0;
      }
      if (data.walkActivated) {
        newSelectedIds.push('walk');
        values['walk'] = data.walkAmount ?? 0;
      }
      if (data.pottyActivated) newSelectedIds.push('poop');
      if (data.dentalActivated) newSelectedIds.push('teeth');
      if (data.skinActivated) newSelectedIds.push('skin');

      setSelectedIds(newSelectedIds);
      setDefaultValues(values);
    };

    fetchSlot();
  }, []);

  const hasSelection = selectedIds.length > 0;
  const handleToggle = (id: string) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]));

  return (
    <Wrapper>
      <TitleHeader title="하루 루틴 설정" showBack={true} />
      <ContentArea>
        <SlotButton selectedIds={selectedIds} onToggle={handleToggle} />

        {!hasSelection && (
          <>
            <Notice>기록할 루틴을 선택해주세요</Notice>
            <EmptyState>
              <EmptyRoutine />
              <EmptyText>활성화 된 루틴이 없습니다</EmptyText>
            </EmptyState>
          </>
        )}

        {hasSelection && (
          <>
            <RoutineTitle>활성화된 루틴</RoutineTitle>
            <SlotInput selectedIds={selectedIds} mode="edit" defaultValues={defaultValues} />
          </>
        )}
      </ContentArea>
      <CompleteButton disabled={!hasSelection}>완료</CompleteButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px 16px;
  overflow-y: auto;
`;

const Notice = styled.div`
  position: relative;
  display: inline-block;
  padding: 6px 12px;
  margin-top: 12px;

  font-size: 14px;
  background-color: #ffb700;
  color: white;
  border-radius: 4px;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 20%;
    transform: translateX(-50%);
    border-width: 0 6px 6px 6px;
    border-style: solid;
    border-color: transparent transparent #ffc533 transparent;
  }
`;

const RoutineTitle = styled.div`
  margin: 30px 0;
  font-size: 18px;
  font-weight: 600;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 100px;
`;

const EmptyText = styled.div`
  font-size: 16px;
  color: #a5a5a5;
`;

const CompleteButton = styled.button<{ disabled?: boolean }>`
  height: 56px;
  margin: 16px;

  font-size: 18px;
  font-weight: 600;

  background-color: ${({ disabled }) => (disabled ? '#F0F0F0' : '#FFC533')};
  color: ${({ disabled }) => (disabled ? '#A5A5A5' : '#373737')};
  border-radius: 12px;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;
`;

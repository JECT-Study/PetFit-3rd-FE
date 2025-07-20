import { useState } from 'react';

import styled from 'styled-components';

import { TitleHeader } from '@/components/common/TitleHeader';
import { SlotButton } from '@/features/slot/SlotButton';
import { SlotInput } from '@/features/slot/SlotInput';

import EmptyRoutine from '@/assets/icons/empty-routine.svg?react';

export const SlotSettingPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]));
  const hasSelection = selectedIds.length > 0;

  return (
    <Wrapper>
      <TitleHeader title="하루 루틴 설정" showBack={true} />
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
          <SlotInput selectedIds={selectedIds} />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 24px 16px;
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

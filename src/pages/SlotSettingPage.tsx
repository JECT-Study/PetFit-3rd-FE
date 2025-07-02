import { useState } from 'react';

import styled from 'styled-components';

import { SlotButton } from '@/features/slot/SlotButton';
import { SlotInput } from '@/features/slot/SlotInput';

export const SlotSettingPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]));

  return (
    <Wrapper>
      <SlotButton selectedIds={selectedIds} onToggle={handleToggle} />
      <RoutineTitle>활성화된 루틴</RoutineTitle>
      <SlotInput selectedIds={selectedIds} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 24px 16px;
`;

const RoutineTitle = styled.div`
  margin: 30px 0;
  font-size: 18px;
  font-weight: 600;
`;

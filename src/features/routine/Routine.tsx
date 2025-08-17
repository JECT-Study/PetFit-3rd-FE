import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { RoutineItem } from '@/features/routine/RoutineItem';
import { useDailyRoutine } from '@/hooks/useDailyRoutine';
import { useSlot } from '@/hooks/useSlot';

import { RoutineProgress } from './RoutineProgress';

interface RoutineProps {
  petId: number;
}

export const Routine = ({ petId }: RoutineProps) => {
  const navigate = useNavigate();
  const { data: slot } = useSlot(petId);
  const { data: routineData } = useDailyRoutine(petId, {
    enabled: !!slot,
  });

  return (
    <Container>
      <RoutineTitleContainer>
        <RoutineTitle>오늘의 루틴</RoutineTitle>
        <Actions>
          <button onClick={() => navigate('/slot')}>
            <Plus />
          </button>
          {!routineData && <Notice>슬롯 설정하기</Notice>}
        </Actions>
      </RoutineTitleContainer>
      {routineData && <RoutineProgress petId={petId} />}

      <RoutineItem petId={petId} />
    </Container>
  );
};

const Container = styled.div`
  padding: 12px 20px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const Notice = styled.div`
  position: relative;
  display: inline-block;
  padding: 6px 12px;
  font-size: 14px;
  background-color: #ffb700;
  color: white;
  border-radius: 4px;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 9px;
    border-width: 0 6px 6px 6px;
    border-style: solid;
    border-color: transparent transparent #ffc533 transparent;
  }
`;

const RoutineTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
`;

const RoutineTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

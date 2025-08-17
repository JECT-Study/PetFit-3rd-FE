import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { RoutineItem } from '@/features/routine/RoutineItem';
import { useDailyRoutine } from '@/hooks/useDailyRoutine';

import { RoutineProgress } from './RoutineProgress';

interface RoutineProps {
  petId: number;
}

export const Routine = ({ petId }: RoutineProps) => {
  const navigate = useNavigate();
  const { data: routineData } = useDailyRoutine(petId);

  return (
    <Container>
      <RoutineTitleContainer>
        <RoutineTitle>오늘의 루틴</RoutineTitle>
        <button onClick={() => navigate('/slot')}>
          <Plus />
        </button>
      </RoutineTitleContainer>
      {routineData && <RoutineProgress petId={petId} />}

      <RoutineItem petId={petId} />
    </Container>
  );
};

const Container = styled.div`
  padding: 12px 20px;
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

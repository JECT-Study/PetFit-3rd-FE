import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { RoutineItem } from '@/features/routine/RoutineItem';

export const Routine = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <RoutineTitleContainer>
        <RoutineTitle>오늘의 루틴</RoutineTitle>
        <button onClick={() => navigate('/slot')}>
          <Plus />
        </button>
      </RoutineTitleContainer>
      <RoutineItem />
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

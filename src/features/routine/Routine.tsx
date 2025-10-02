import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { RoutineItem } from '@/features/routine/RoutineItem';
import { useDailyRoutine } from '@/hooks/useDailyRoutine';
import { useSlot } from '@/hooks/useSlot';

import { RoutineProgress } from './RoutineProgress';

interface RoutineProps {
  petId: number;
}

export const Routine = ({ petId }: RoutineProps) => {
  const navigate = useNavigate();
  const { data: slot, isLoading: isSlotLoading } = useSlot(petId);
  const { data: routineData, isLoading: isRoutineLoading } = useDailyRoutine(petId, {
    enabled: !!slot,
  });

  if (isSlotLoading || isRoutineLoading) return <LoadingSpinner />;

  return (
    <div>
      <Container>
        <RoutineTitleContainer>
          <RoutineTitle>오늘의 루틴</RoutineTitle>
          <Actions>
            <EditButton onClick={() => navigate('/slot')}>수정</EditButton>
            {!routineData && <Notice>슬롯 설정하기</Notice>}
          </Actions>
        </RoutineTitleContainer>
        {routineData && <RoutineProgress petId={petId} />}
      </Container>
      <RoutineItem petId={petId} />
    </div>
  );
};

const Container = styled.div`
  padding: 12px 20px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
`;

const EditButton = styled.div`
  margin-right: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.gray[400]};
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
    top: -5px;
    right: 6px;
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
  margin: 16px 0;
`;

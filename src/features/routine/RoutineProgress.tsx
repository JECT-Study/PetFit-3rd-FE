import styled from 'styled-components';
import { tx } from '@/styles/typography';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useDailyRoutine } from '@/hooks/useDailyRoutine';
import { useSlot } from '@/hooks/useSlot';
import type { Routine } from '@/types/routine';

interface RoutineProps {
  petId: number;
}

export const RoutineProgress = ({ petId }: RoutineProps) => {
  const { data: slot } = useSlot(petId);
  const { data: routineData, isLoading } = useDailyRoutine(petId, {
    enabled: !!slot,
  });

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  const totalRoutineCount = (routineData ?? []).length;
  const doneRoutineCount = (routineData ?? []).filter(
    (rtn: Routine) => rtn.status === 'CHECKED' || rtn.status === 'MEMO'
  ).length;
  const completedPercent = ((doneRoutineCount / totalRoutineCount) * 100).toFixed(1);

  return (
    <Container>
      <Label>루틴 달성률</Label>
      <ProgressBarContainer>
        <ProgressBar>
          <ProgressFill style={{ width: `${completedPercent}%` }} />
        </ProgressBar>
        <PercentText>{completedPercent}%</PercentText>
      </ProgressBarContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0px 0px 8px 0px #0000001f;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
`;

const Label = styled.div`
  ${tx.caption('med12')}
  color: ${({ theme }) => theme.color.gray[500]};
`;

const PercentText = styled.div`
  ${tx.body('semi13')}
  color: ${({ theme }) => theme.color.gray[500]};
`;

const ProgressBar = styled.div`
  width: 90%;
  height: 16px;
  background-color: #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.sub[500]};
  border-radius: 8px;
`;

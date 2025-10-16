import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { tx } from '@/styles/typography';

import { checkRoutine, uncheckRoutine } from '@/apis/routine';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SLOT_ITEMS } from '@/constants/slot';
import { RoutineDetailModal } from '@/features/routine/RoutineDetailModal';
import { useDailyRoutine } from '@/hooks/useDailyRoutine';
import { useSlot } from '@/hooks/useSlot';
import type { Routine, SlotId } from '@/types/routine';
import { formatDate } from '@/utils/calendar';

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  LeadingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

interface RoutineItemProps {
  petId: number;
  routines?: Routine[];
}

interface ModalProps {
  open: boolean;
  slotId: SlotId | null;
}

export const RoutineItem = ({ petId, routines }: RoutineItemProps) => {
  const [modal, setModal] = useState<ModalProps>({ open: false, slotId: null });
  const queryClient = useQueryClient();

  const { data: slot } = useSlot(petId);
  const { data: routineDataFromHook, isLoading } = useDailyRoutine(petId, {
    enabled: !!slot,
  });
  const routineList = routines ?? routineDataFromHook;

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!routineList) {
    return <NonSlot>슬롯을 설정해주세요</NonSlot>;
  }

  if (isLoading) return <LoadingSpinner />;

  const FIXED_ORDER = ['feed', 'water', 'walk', 'potty', 'dental', 'skin'];

  const sortedRoutineData = [...routineList].sort((a, b) => {
    return FIXED_ORDER.indexOf(a.category) - FIXED_ORDER.indexOf(b.category);
  });

  const handleCheck = async (id: SlotId) => {
    try {
      const today = formatDate(new Date());
      await checkRoutine(petId, today, id);
      queryClient.invalidateQueries({ queryKey: ['dailyRoutine', petId, today] });
    } catch (err) {
      console.error('루틴 체크 실패', err);
    }
  };

  const handleUncheck = async (id: SlotId) => {
    try {
      const today = formatDate(new Date());
      await uncheckRoutine(petId, today, id);
      queryClient.invalidateQueries({ queryKey: ['dailyRoutine', petId, today] });
    } catch (err) {
      console.error('루틴 언체크 실패', err);
    }
  };

  // 왼쪽으로 스와이프
  const getLeadingActions = (rtn: Routine) => {
    const id = rtn.category as SlotId;
    if (rtn.status === 'CHECKED') {
      return null;
    }

    if (rtn.status === 'MEMO') {
      return (
        <LeadingActions>
          <SwipeAction onClick={() => handleUncheck(id)}>
            <StatusContainer>
              <PendingText>대기</PendingText>
            </StatusContainer>
          </SwipeAction>
        </LeadingActions>
      );
    }

    return (
      <LeadingActions>
        <SwipeAction onClick={() => handleCheck(id)}>
          <CompleteContainer>
            <CompleteText>완료</CompleteText>
          </CompleteContainer>
        </SwipeAction>
      </LeadingActions>
    );
  };

  // 오른쪽으로 스와이프
  const getTrailingActions = (rtn: Routine) => {
    const id = rtn.category as SlotId;
    if (rtn.status === 'MEMO') {
      return null;
    }

    if (rtn.status === 'CHECKED') {
      return (
        <TrailingActions>
          <SwipeAction onClick={() => handleUncheck(id)}>
            <StatusContainer>
              <PendingText>대기</PendingText>
            </StatusContainer>
          </SwipeAction>
        </TrailingActions>
      );
    }

    return (
      <TrailingActions>
        <SwipeAction onClick={() => setModal({ open: true, slotId: id })}>
          <UncompleteContainer>
            <UncompleteText>미완</UncompleteText>
          </UncompleteContainer>
        </SwipeAction>
      </TrailingActions>
    );
  };

  return (
    <div>
      <TitleContainer>
        <TitleList>목록</TitleList>
        <TitleDescription>좌우로 스와이프해서 루틴을 완료하세요</TitleDescription>
      </TitleContainer>
      <SwipeableList>
        {sortedRoutineData.map((rtn: Routine) => {
          const { id, Icon, label, unit, placeholder } = SLOT_ITEMS.find(
            slot => slot.id === rtn.category
          )!;

          return (
            <SwipeableListItem
              key={id}
              leadingActions={getLeadingActions(rtn)}
              trailingActions={getTrailingActions(rtn)}
            >
              <Container $status={rtn.status}>
                <ItemContainer>
                  <MainInfoContainer>
                    <MainInfo>
                      <Icon
                        width={16}
                        color={
                          rtn.status === 'CHECKED'
                            ? '#4D9DE0'
                            : rtn.status === 'MEMO'
                              ? '#FF5C33'
                              : '#666666'
                        }
                      />
                      <TitleText $status={rtn.status}>{label}</TitleText>
                      <AmountText $status={rtn.status}>
                        {rtn.targetAmount != null ? (
                          <>
                            {rtn.actualAmount !== undefined ? `${rtn.actualAmount}${unit} / ` : ''}
                            {rtn.targetAmount}
                            {unit}
                          </>
                        ) : rtn.content ? (
                          ''
                        ) : (
                          placeholder
                        )}
                      </AmountText>
                      <MemoInfo>{rtn.content}</MemoInfo>
                    </MainInfo>
                  </MainInfoContainer>
                </ItemContainer>
                <StatusLabel $status={rtn.status}>
                  {rtn.status === 'CHECKED' ? '완료' : rtn.status === 'MEMO' ? '미완' : '대기'}
                </StatusLabel>
              </Container>
            </SwipeableListItem>
          );
        })}
      </SwipeableList>

      {modal.slotId && (
        <RoutineDetailModal
          slotId={modal.slotId}
          isOpen={modal.open}
          petId={petId}
          initial={{
            amount: sortedRoutineData.find(r => r.category === modal.slotId)?.actualAmount,
            memo: sortedRoutineData.find(r => r.category === modal.slotId)?.content ?? '',
          }}
          onClose={() => setModal({ open: false, slotId: null })}
        />
      )}
    </div>
  );
};

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
  padding: 0 20px;
`;

const TitleList = styled.div`
  ${tx.body('med16')}
`;

const TitleDescription = styled.div`
  ${tx.caption('med12')}
  color: ${({ theme }) => theme.color.gray[400]};
`;

const Container = styled.div<{ $status: 'UNCHECKED' | 'MEMO' | 'CHECKED' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  padding: 0 12px;

  background-color: ${({ $status, theme }) =>
    $status === 'CHECKED'
      ? theme.color.sub[500_30]
      : $status === 'MEMO'
        ? theme.color.warning[500_30]
        : null};
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 10px 0;
`;

const MainInfoContainer = styled.div``;

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CompleteContainer = styled(StatusContainer)`
  background-color: ${({ theme }) => theme.color.sub[500_30]};
`;

const UncompleteContainer = styled(StatusContainer)`
  background-color: ${({ theme }) => theme.color.warning[500_30]};
`;

const StatusText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 16.67px;
  font-weight: 600;
  border-radius: 6.67px;
  padding: 4px 8px;

  color: ${({ theme }) => theme.color.white};
`;

const PendingText = styled(StatusText)`
  background-color: ${({ theme }) => theme.color.gray[300]};
`;

const CompleteText = styled(StatusText)`
  background-color: ${({ theme }) => theme.color.sub[500]};
`;

const UncompleteText = styled(StatusText)`
  background-color: ${({ theme }) => theme.color.warning[500]};
`;

const TitleText = styled.div<{ $status: 'UNCHECKED' | 'MEMO' | 'CHECKED' }>`
  ${tx.body('med16')}
  color: ${({ $status, theme }) =>
    $status === 'CHECKED'
      ? theme.color.sub[500]
      : $status === 'MEMO'
        ? theme.color.warning[500]
        : theme.color.gray[700]};
`;

const AmountText = styled.div<{ $status: 'UNCHECKED' | 'MEMO' | 'CHECKED' }>`
  ${tx.body('reg14')}
  color: ${({ $status, theme }) =>
    $status === 'CHECKED'
      ? theme.color.sub[500]
      : $status === 'MEMO'
        ? theme.color.warning[500]
        : theme.color.gray[700]};
`;

const MainInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  gap: 6px;
  ${tx.body('reg14')}
`;

const MemoInfo = styled.div`
  display: flex;
  align-items: center;
  ${tx.body('reg14')}
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`;

const StatusLabel = styled.div<{ $status: 'UNCHECKED' | 'MEMO' | 'CHECKED' }>`
  font-size: 16.67px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;

  background-color: ${({ $status, theme }) =>
    $status === 'CHECKED'
      ? theme.color.sub[500]
      : $status === 'MEMO'
        ? theme.color.warning[500]
        : theme.color.gray[300]};

  color: ${({ theme }) => theme.color.white};
  white-space: nowrap;
`;

const NonSlot = styled.div`
  text-align: center;
`;

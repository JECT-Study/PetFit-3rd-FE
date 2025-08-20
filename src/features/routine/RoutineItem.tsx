import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Check } from 'lucide-react';
import styled from 'styled-components';

import { checkRoutine, uncheckRoutine } from '@/apis/routine';
import { SLOT_ITEMS } from '@/constants/slot';
import { RoutineDetailModal } from '@/features/routine/RoutineDetailModal';
import { useDailyRoutine } from '@/hooks/useDailyRoutine';
import { useSlot } from '@/hooks/useSlot';
import type { Routine, SlotId } from '@/types/routine';
import { formatDate } from '@/utils/calendar';

import Memo from '@/assets/icons/memo.svg?react';

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

  type StatusType = 'UNCHECKED' | 'MEMO' | 'CHECKED';

  const STATUS_ICON: Record<StatusType, React.ReactElement> = {
    UNCHECKED: <Check width={24} color="#DDDDDD" />,
    MEMO: <Memo />,
    CHECKED: <Check width={24} color="#4D9DE0" />,
  } as const;

  const { data: slot } = useSlot(petId);
  const { data: routineDataFromHook } = useDailyRoutine(petId, {
    enabled: !!slot,
  });
  const routineList = routines ?? routineDataFromHook;

  if (!routineList) {
    return <NonSlot>슬롯을 설정해주세요</NonSlot>;
  }

  const FIXED_ORDER = ['feed', 'water', 'walk', 'potty', 'dental', 'skin'];

  const sortedRoutineData = [...routineList].sort((a, b) => {
    return FIXED_ORDER.indexOf(a.category) - FIXED_ORDER.indexOf(b.category);
  });

  // 루틴을 완료하거나 취소하기
  const handleStatusClick = async (id: SlotId) => {
    try {
      const today = formatDate(new Date());

      const currentStatus = sortedRoutineData.find(rtn => rtn.category === id)?.status;
      if (currentStatus === 'CHECKED') {
        await uncheckRoutine(petId, today, id);
      } else {
        await checkRoutine(petId, today, id);
      }

      queryClient.invalidateQueries({ queryKey: ['dailyRoutine', petId, today] });
    } catch (err) {
      console.error('루틴 체크/해제 실패', err);
    }
  };

  return (
    <div>
      {sortedRoutineData.map((rtn: Routine) => {
        const { id, Icon, label, unit, placeholder } = SLOT_ITEMS.find(
          slot => slot.id === rtn.category
        )!;
        return (
          <Container key={id}>
            <ItemContainer>
              <StuatusIcon onClick={() => handleStatusClick(id)}>
                {STATUS_ICON[rtn.status]}
              </StuatusIcon>
              <MainInfoContainer>
                <MainInfo>
                  <Icon width={16} color="#4D9DE0" />
                  <TitleText>{label}</TitleText>
                  <AmountText>
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

            <NoteButton onClick={() => setModal({ open: true, slotId: id })}>
              <Pencil width={14} />
            </NoteButton>
          </Container>
        );
      })}

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

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px #dddddd solid;
  align-items: center;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 10px 0;
`;

const StuatusIcon = styled.div`
  cursor: pointer;
`;

const MainInfoContainer = styled.div``;

const TitleText = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

const AmountText = styled.div`
  font-size: 14px;
`;

const MainInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  gap: 6px;
  font-size: 14px;
`;

const MemoInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`;

const NoteButton = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const NonSlot = styled.div`
  text-align: center;
`;

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Ellipsis, Check } from 'lucide-react';
import styled from 'styled-components';

import { checkRoutine, uncheckRoutine } from '@/apis/routine';
import { SLOT_ITEMS } from '@/constants/slot';
import { RoutineDetailModal } from '@/features/routine/RoutineDetailModal';
import { useDailyRoutine } from '@/hooks/useDailyRoutine';
import type { Routine, SlotId } from '@/types/routine';
import { formatDate } from '@/utils/calendar';

import Notice from '@/assets/icons/notice.svg?react';

interface RoutineItemProps {
  petId: number;
}

interface ModalProps {
  open: boolean;
  slotId: SlotId | null;
}

export const RoutineItem = ({ petId }: RoutineItemProps) => {
  const [modal, setModal] = useState<ModalProps>({ open: false, slotId: null });
  const queryClient = useQueryClient();

  type StatusType = 'UNCHECKED' | 'note' | 'CHECKED';

  const STATUS_ICON: Record<StatusType, React.ReactElement> = {
    UNCHECKED: <Check width={24} color="#DDDDDD" />,
    note: <Notice />,
    CHECKED: <Check width={24} color="#4D9DE0" />,
  } as const;

  const { data: routineData } = useDailyRoutine(petId);

  if (!routineData) {
    return <NonSlot>슬롯을 설정해주세요</NonSlot>;
  }

  // 루틴을 완료하거나 취소하기
  const handleStatusClick = async (id: SlotId) => {
    try {
      const today = formatDate(new Date());

      const currentStatus = routineData.find(rtn => rtn.category === id)?.status;
      console.log('currentStatus', currentStatus);
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
      {routineData.map((rtn: Routine) => {
        const { id, Icon, label, unit, placeholder } = SLOT_ITEMS.find(
          slot => slot.id === rtn.category
        )!;
        return (
          <Container key={id}>
            <ItemContainer>
              <div onClick={() => handleStatusClick(id)}>{STATUS_ICON[rtn.status]}</div>
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
                    ) : (
                      placeholder
                    )}
                  </AmountText>
                </MainInfo>

                <MemoInfo>{rtn.content}</MemoInfo>
              </MainInfoContainer>
            </ItemContainer>

            <NoteButton onClick={() => setModal({ open: true, slotId: id })}>
              <Ellipsis width={16} />
            </NoteButton>
          </Container>
        );
      })}

      {modal.slotId && (
        <RoutineDetailModal
          slotId={modal.slotId}
          isOpen={modal.open}
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

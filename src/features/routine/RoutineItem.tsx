import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Ellipsis, Check } from 'lucide-react';
import styled from 'styled-components';

import { checkRoutine, getCheckedRoutine } from '@/apis/routine';
import { getSlot } from '@/apis/slot';
import { SLOT_ITEMS } from '@/constants/slot';
import { RoutineDetailModal } from '@/features/routine/RoutineDetailModal';
import type { SlotId } from '@/types/routine';

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

  type StatusType = 'todo' | 'note' | 'done';

  const STATUS_ICON: Record<StatusType, React.ReactElement> = {
    todo: <Check width={24} color="#DDDDDD" />,
    note: <Notice />,
    done: <Check width={24} color="#4D9DE0" />,
  } as const;

  // 체크되거나 메모된 루틴이 있는지 확인
  const today = dayjs().format('YYYY-MM-DD');

  const { data: checkedData } = useQuery({
    queryKey: ['checkedRoutine', petId, today],
    queryFn: () => getCheckedRoutine(petId, today),
  });

  // 기본 슬롯 데이터 가져오기
  const { data: slotData } = useQuery({
    queryKey: ['slot', petId],
    queryFn: () => getSlot(petId),
    staleTime: 1000 * 60 * 5,
  });

  if (!slotData) {
    return <NonSlot>슬롯을 설정해주세요</NonSlot>;
  }

  const routineData = SLOT_ITEMS.filter(({ id }) => {
    switch (id) {
      case 'feed':
        return slotData.feedActivated;
      case 'water':
        return slotData.waterActivated;
      case 'walk':
        return slotData.walkActivated;
      case 'potty':
        return slotData.pottyActivated;
      case 'dental':
        return slotData.dentalActivated;
      case 'skin':
        return slotData.skinActivated;
      default:
        return false;
    }
  }).map(({ id, ...rest }) => {
    const isChecked = checkedData?.some(
      (item: { category: string; status: string }) =>
        item.category === id && item.status === 'CHECKED'
    );
    const status: StatusType = isChecked ? 'done' : 'todo';

    return {
      id,
      ...rest,
      default:
        id === 'feed'
          ? slotData.feedAmount
          : id === 'water'
            ? slotData.waterAmount
            : id === 'walk'
              ? slotData.walkAmount
              : '이상 없음',
      current: ['feed', 'water', 'walk'].includes(id) ? 0 : undefined,
      status,
    };
  });

  // 루틴을 완료하거나 취소하기
  const handleStatusClick = async (id: SlotId) => {
    try {
      const today = dayjs().format('YYYY-MM-DD');
      await checkRoutine(petId, today, id);
    } catch (err) {
      console.error('루틴 체크 실패', err);
    }
  };

  return (
    <div>
      {routineData.map(rtn => {
        const { id, Icon, label, unit } = SLOT_ITEMS.find(slot => slot.id === rtn.id)!;
        return (
          <Container key={id}>
            <ItemContainer>
              <div onClick={() => handleStatusClick(id)}>{STATUS_ICON[rtn.status]}</div>
              <MainInfoContainer>
                <MainInfo>
                  <Icon width={16} color="#4D9DE0" />
                  <TitleText>{label}</TitleText>
                  <AmountText>
                    {rtn.current !== undefined ? `${rtn.current}${unit} / ` : null} {rtn.default}
                    {unit}
                  </AmountText>
                </MainInfo>

                <MemoInfo>{rtn.memo}</MemoInfo>
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

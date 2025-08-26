import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import styled from 'styled-components';

import { fetchDailyEntries } from '@/apis/calendar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SLOT_ITEMS } from '@/constants/slot';
import type { Routine } from '@/types/routine';
import { formatDate } from '@/utils/calendar';
import { toRoutineModel } from '@/utils/transform/routine';

import Memo from '@/assets/icons/memo.svg?react';

type Props = {
  petId: number;
  selectedDate: Date;
};

type StatusType = 'UNCHECKED' | 'MEMO' | 'CHECKED';

const STATUS_ICON: Record<StatusType, React.ReactElement> = {
  UNCHECKED: <Check width={24} color="#DDDDDD" />,
  MEMO: <Memo />,
  CHECKED: <Check width={24} color="#4D9DE0" />,
} as const;

/**
 * 달력 전용 루틴 조회 컴포넌트
 * - 수정/체크/메모 변경 없음(조회 전용)
 * - dailyEntries 캐시 키를 그대로 사용하므로 WeeklyDetailsSection의 동일 쿼리와 중복 호출되지 않음(React Query dedupe)
 */
export const CalendarRoutineList = ({ petId, selectedDate }: Props) => {
  const dateStr = formatDate(selectedDate); // 'YYYY-MM-DD'

  const { data, isLoading } = useQuery({
    queryKey: ['dailyEntries', petId, dateStr],
    queryFn: () => fetchDailyEntries(petId, dateStr),
    enabled: petId > 0,
    staleTime: 1000 * 60 * 5,
  });

  // API → 화면 모델 변환
  const routines: Routine[] = useMemo(
    () => (data?.routineResponseList ?? []).map(toRoutineModel),
    [data]
  );

  if (!petId) return null;
  if (isLoading) return <LoadingSpinner />;

  if (!routines || routines.length === 0) {
    return <NonSlot>해당 날짜에 표시할 루틴이 없습니다</NonSlot>;
  }

  const FIXED_ORDER = ['feed', 'water', 'walk', 'potty', 'dental', 'skin'];
  const sorted = [...routines].sort(
    (a, b) => FIXED_ORDER.indexOf(a.category) - FIXED_ORDER.indexOf(b.category)
  );

  return (
    <div>
      {sorted.map(rtn => {
        const { id, Icon, label, unit, placeholder } = SLOT_ITEMS.find(s => s.id === rtn.category)!;
        return (
          <Container key={id}>
            <ItemContainer>
              <StatusIcon>{STATUS_ICON[rtn.status]}</StatusIcon>

              <MainInfo>
                <Icon width={16} color="#4D9DE0" />
                <TitleText>{label}</TitleText>

                <AmountText>
                  {rtn.targetAmount != null ? (
                    <>
                      {rtn.actualAmount != null ? `${rtn.actualAmount}${unit} / ` : ''}
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
            </ItemContainer>
          </Container>
        );
      })}
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

const StatusIcon = styled.div``;

const MainInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  gap: 6px;
  font-size: 14px;
`;

const TitleText = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

const AmountText = styled.div`
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

const NonSlot = styled.div`
  text-align: center;
  color: #888;
`;

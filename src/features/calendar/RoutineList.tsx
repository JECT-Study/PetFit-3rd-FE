import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';
import type { UiRoutine } from '@/types/routine';

type Props = {
  routines: UiRoutine[]; // 타입 수정
};

/**
 * 달력 전용 루틴 조회 컴포넌트
 * - 수정/체크/메모 변경 없음(조회 전용)
 * - dailyEntries 캐시 키를 그대로 사용하므로 WeeklyDetailsSection의 동일 쿼리와 중복 호출되지 않음(React Query dedupe)
 */
export const RoutineList = ({ routines }: Props) => {
  if (!routines || routines.length === 0) {
    return <NonSlot>해당 날짜에 표시할 루틴이 없습니다</NonSlot>;
  }

  const FIXED_ORDER = ['feed', 'water', 'walk', 'potty', 'dental', 'skin'];
  const sorted = [...routines].sort(
    (a, b) => FIXED_ORDER.indexOf(a.category) - FIXED_ORDER.indexOf(b.category)
  );

  return (
    <List>
      {sorted.map(rtn => {
        const { id, Icon, label, unit, placeholder } = SLOT_ITEMS.find(s => s.id === rtn.category)!;
        return (
          <Container key={id}>
            <ItemContainer>
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
    </List>
  );
};

const List = styled.ul`
  & > * {
    border-bottom: 1px solid ${({ theme }) => theme.color.gray[200]};
  }
`;

const Container = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 10px 0;
`;

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

import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';
import { SLOT_IDS, type UiRoutine } from '@/types/routine';
import { tx } from '@/styles/typography';

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

  const sorted = [...routines].sort(
    (a, b) => SLOT_IDS.indexOf(a.slotKey) - SLOT_IDS.indexOf(b.slotKey)
  );

  return (
    <List>
      {sorted.map(rtn => {
        // 슬롯 메타(아이콘/라벨/단위/placeholder)
        const meta = SLOT_ITEMS.find(s => s.id === rtn.slotKey);
        if (!meta) return null;

        const { Icon, label, unit, placeholder } = meta;

        const hasTarget = rtn.targetAmount > 0;
        const hasActual =
          typeof rtn.actualAmount === 'number' && rtn.actualAmount !== null && rtn.actualAmount > 0;

        const unitText = unit ?? '';
        // ✅ 수량 영역: 목표/실측 수치만 표시 (placeholder 사용 안 함)
        const amountText = hasTarget
          ? `${hasActual ? `${rtn.actualAmount}${unitText} / ` : ''}${rtn.targetAmount}${unitText}`
          : '';

        // ✅ 메모 영역: 상태별로 분기 (CHECKED → 메모 없음, MEMO → content 표시, UNCHECKED → placeholder 표시)
        let memoText = '';
        if (rtn.status === 'UNCHECKED') {
          memoText = placeholder ?? '';
        } else if (rtn.status === 'MEMO') {
          memoText = rtn.content ?? '';
        }

        // 상태 → 버튼 라벨/톤 매핑
        const statusMap = {
          CHECKED: { label: '완료', tone: 'done' as const },
          MEMO: { label: '미완', tone: 'warn' as const },
          UNCHECKED: { label: '대기', tone: 'idle' as const },
        }[rtn.status];

        return (
          <Container key={rtn.id}>
            <ItemContainer>
              <MainInfo $tone={statusMap.tone}>
                <IconWrap aria-hidden>
                  <Icon width={16} />
                </IconWrap>
                <TitleText>{label}</TitleText>
                <AmountText aria-label="routine-amount">{amountText}</AmountText>
              </MainInfo>
              <MemoInfo aria-label="routine-memo">{memoText}</MemoInfo>
            </ItemContainer>
            <StateButton
              aria-label="routine-status"
              $tone={statusMap.tone}
              title={`상태: ${statusMap.label}`}
            >
              {statusMap.label}
            </StateButton>
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
  padding: 14px 0;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

/** ✅ tone → 실제 색상 */
const toneColor = (theme: any, tone: 'done' | 'warn' | 'idle') =>
  tone === 'done'
    ? theme.color.sub[500]
    : tone === 'warn'
      ? theme.color.warning[500]
      : theme.color.gray[300];

const MainInfo = styled.div<{ $tone: 'done' | 'warn' | 'idle' }>`
  display: flex;
  align-items: center;
  gap: 5px;
  /* ✅ 이 색을 currentColor로 하위에 상속 */
  color: ${({ theme, $tone }) => toneColor(theme, $tone)};
`;
const IconWrap = styled.span`
  display: inline-flex;
  line-height: 0;
  color: inherit;

  /* 혹시 fill/stroke가 고정된 아이콘이면 아래를 풀어 강제할 수 있음
  & svg {
    fill: currentColor;
    stroke: currentColor;
  }
  */
`;

const TitleText = styled.div`
  ${tx.body('semi14')};
  color: currentColor;
`;

const AmountText = styled.div`
  ${tx.body('semi14')};
  color: currentColor;
`;

const MemoInfo = styled.div`
  ${tx.body('reg14')};
  color: ${({ theme }) => theme.color.gray[500]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`;

/** ✅ 상태 버튼: tone 별 색상 적용
 *  - done  → sub-500
 *  - warn  → warning-500
 *  - idle  → gray-300
 */
const StateButton = styled.button<{ $tone: 'done' | 'warn' | 'idle' }>`
  padding: 0px 4px;
  border-radius: 6.667px;
  border: 2.333px solid ${({ theme, $tone }) => toneColor(theme, $tone)};
  background: ${({ theme, $tone }) => toneColor(theme, $tone)};
  color: ${({ theme }) => theme.color.white};

  font-size: 1.04169rem;
  font-style: normal;
  font-weight: 600;
  line-height: 135%; /* 1.40625rem */
  letter-spacing: -0.02606rem;
`;

const NonSlot = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.color.gray[300]};
`;

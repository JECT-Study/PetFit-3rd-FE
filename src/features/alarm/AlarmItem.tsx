import styled from 'styled-components';
import { OverflowMenu } from '@/components/common/OverflowMenu';
import type { UiAlarm } from '@/types/alarm.ui';
import { tx } from '@/styles/typography';

type Props = {
  alarm: UiAlarm;
  onEdit: () => void;
  onDelete: () => void;
};

/** D-day 라벨 */
const getDday = (targetDate: Date) => {
  const today = new Date();
  const target = new Date(targetDate);
  // 시, 분, 초, 밀리초 제거 → 날짜만 비교
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-Day';
  return `D+${Math.abs(diff)}`;
};
/** “오전 09:00” 라벨 */
const formatKTimeBadge = (dt: Date): string => {
  const d = dt instanceof Date ? dt : new Date(dt);
  if (isNaN(d.getTime())) return '';

  const h = d.getHours(); // 0..23
  const m = d.getMinutes(); // 0..59
  const period = h >= 12 ? '오후' : '오전';
  let h12 = h % 12; // 0 -> 0, 13 -> 1 ...
  if (h12 === 0) h12 = 12; // 0,12는 12로 표기

  return `${period} ${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const AlarmItem = ({ alarm, onEdit, onDelete }: Props) => {
  return (
    <ListItem role="listitem">
      <TitleRow>
        <TitleLeft>
          <TitleText>{alarm.title}</TitleText>
          <Badge>{getDday(alarm.notifyAt)}</Badge>
          <Badge>{formatKTimeBadge(alarm.notifyAt)}</Badge>
        </TitleLeft>
        <OverflowMenu
          context="alarm"
          targetDate={alarm.notifyAt}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TitleRow>

      <DetailText>・ {alarm.content}</DetailText>
    </ListItem>
  );
};

const ListItem = styled.li`
  padding: 16px 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TitleText = styled.span`
  color: ${({ theme }) => theme.color.gray[700]};
  ${tx.body('med16')};
`;

const Badge = styled.span`
  padding: 2px 8px;
  color: ${({ theme }) => theme.color.sub[500]};
  ${tx.caption('bold11')};
  border: 1px solid ${({ theme }) => theme.color.sub[500]};
  border-radius: 4px;
`;

const DetailText = styled.p`
  color: ${({ theme }) => theme.color.gray[700]};
  ${tx.body('med13')};
`;

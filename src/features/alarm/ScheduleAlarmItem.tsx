import styled from 'styled-components';

import { MoreActionDropdown } from '@/components/common/MoreActionDropdown';
import type { Alarm } from '@/types/alarm';

interface ScheduleAlarmItemProps {
  alarm: Alarm;
  onEdit: () => void;
  onDelete: () => void;
}

export const ScheduleAlarmItem = ({ alarm, onEdit, onDelete }: ScheduleAlarmItemProps) => {
  const getDday = (date: string) => {
    const today = new Date();
    const target = new Date(date);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return `D-${diff}`;
  };

  return (
    <ListItem>
      <TitleRow>
        <TitleLeft>
          <TitleText>{alarm.title}</TitleText>
          <Dday>{getDday(alarm.startDate)}</Dday>
        </TitleLeft>
        <MoreActionDropdown onEdit={onEdit} onDelete={onDelete} />
      </TitleRow>

      <DetailText>・ {alarm.description}</DetailText>
    </ListItem>
  );
};

const ListItem = styled.li`
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleText = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const Dday = styled.span`
  padding: 2px 8px;
  color: #4d9de0;
  border: 1px solid #4d9de0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const DetailText = styled.p`
  margin-top: 4px;
  font-size: 14px;
  color: #333;
`;

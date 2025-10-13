import styled from 'styled-components';
import { AlarmItem } from '@/features/alarm/AlarmItem';
import type { UiAlarm } from '@/types/alarm.ui';
import type { AlarmId } from '@/types/alarm.dto';

type Props = {
  alarms: UiAlarm[];
  onEdit: (alarm: UiAlarm) => void;
  onDelete: (id: AlarmId) => void;
};

export const AlarmList = ({ alarms, onEdit, onDelete }: Props) => {
  if (!alarms.length) return null;

  return (
    <List role="list">
      {alarms.map(a => (
        <AlarmItem key={a.id} alarm={a} onEdit={() => onEdit(a)} onDelete={() => onDelete(a.id)} />
      ))}
    </List>
  );
};

const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0 20px;

  & > li + li {
    border-top: 1px solid ${({ theme }) => theme.color.gray[200]};
  }
`;

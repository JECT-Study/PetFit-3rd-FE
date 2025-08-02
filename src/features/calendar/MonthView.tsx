import styled from 'styled-components';

import { LEGEND_MAP } from '@/constants/calendar';
import { MOCK_CALENDAR_MARKS } from '@/mocks/calendarData';
import type { CalendarMarkType } from '@/types/calendar';
import { formatDate, getMonthDates, isSameDay, isSameMonth } from '@/utils/calendar';

interface Props {
  viewDate: Date;
  selectedDate: Date;
  onDateClick: (date: Date) => void;
}

export const MonthView = ({ viewDate, selectedDate, onDateClick }: Props) => {
  const dates = getMonthDates(viewDate); // 월간 날짜 생성

  return (
    <Grid>
      {dates.map(date => {
        const day = date.getDate();
        const isInCurrentMonth = isSameMonth(date, viewDate);

        const isSelected = isSameDay(selectedDate, date);

        const formatted = formatDate(date);
        const dots = MOCK_CALENDAR_MARKS[formatted] || [];
        const dotColor = (type: CalendarMarkType) =>
          isInCurrentMonth ? LEGEND_MAP[type].color : '#ddd';

        return (
          <Cell key={formatted} $selected={isSelected} onClick={() => onDateClick(date)}>
            <DateNumber $dimmed={!isInCurrentMonth}>{day}</DateNumber>
            <DotRow $hasDots={dots.length > 0}>
              {dots.map(type => (
                <Dot key={type} $color={dotColor(type)} />
              ))}
            </DotRow>
          </Cell>
        );
      })}
    </Grid>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 4px;
`;

const Cell = styled.div<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 48px;
  border-radius: 6px;
  border: ${({ $selected }) => ($selected ? '2px solid orange' : 'none')};
  cursor: pointer;
`;

const DateNumber = styled.span<{ $dimmed?: boolean }>`
  text-align: center;
  color: ${({ $dimmed }) => ($dimmed ? '#DDD' : '#000')};
  font-size: 14px;
`;

const DotRow = styled.div<{ $hasDots: boolean }>`
  display: flex;
  justify-content: center;
  gap: 2px;
  min-height: 6px; // dot이 없는 날에도 영역 확보
  margin-top: 4px;
`;

const Dot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
`;

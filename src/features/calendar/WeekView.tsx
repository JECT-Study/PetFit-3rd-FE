import styled from 'styled-components';

import { LEGEND_MAP } from '@/constants/calendar';
import { MOCK_CALENDAR_MARKS } from '@/mocks/calendarData';
import type { CalendarMarkType } from '@/types/calendar';
import { formatDate, isSameDay, isSameMonth } from '@/utils/calendar';

interface WeekViewProps {
  viewDate: Date;
  selectedDate: Date;
  onDateClick: (date: Date) => void;
}

// 주간 날짜 생성
function getWeekDates(date: Date): Date[] {
  const result: Date[] = [];
  const dayOfWeek = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    result.push(d);
  }

  return result;
}

export const WeekView = ({ viewDate, selectedDate, onDateClick }: WeekViewProps) => {
  const dates = getWeekDates(viewDate);

  return (
    <Grid>
      {dates.map(date => {
        const day = date.getDate();
        const isInCurrentView = isSameMonth(date, viewDate);

        const isSelected = isSameDay(selectedDate, date);
        const isViewMatched = isSameDay(selectedDate, viewDate);

        const formatted = formatDate(date);
        const dots = MOCK_CALENDAR_MARKS[formatted] || [];
        const dotColor = (type: CalendarMarkType) =>
          isInCurrentView ? LEGEND_MAP[type].color : '#ddd';

        return (
          <Cell
            key={formatted}
            $selected={isSelected && isViewMatched}
            onClick={() => onDateClick(date)}
          >
            <DateNumber $dimmed={!isInCurrentView}>{day}</DateNumber>
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
  background-color: ${({ $selected }) => ($selected ? '#FFF3E0' : 'transparent')};
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

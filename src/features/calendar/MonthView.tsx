import styled from 'styled-components';

import { DAYS_OF_WEEK, CALENDAR_LEGEND } from '@/constants/calendar';
import type { CalendarMarksByDate, CalendarMarkType } from '@/types/calendar';
import { formatDate, getMonthDates, isSameDay, isSameMonth } from '@/utils/calendar';
import { tx } from '@/styles/typography';

interface MonthViewProps {
  viewDate: Date;
  selectedDate: Date;
  onDateClick: (date: Date) => void;
  calendarMarks: CalendarMarksByDate;
}

export const MonthView = ({
  viewDate,
  selectedDate,
  onDateClick,
  calendarMarks,
}: MonthViewProps) => {
  const dates = getMonthDates(viewDate); // 월간 날짜 생성

  return (
    <Wrapper>
      <DayOfWeekRow>
        {DAYS_OF_WEEK.map(day => (
          <DayHeaderCell key={day}>{day}</DayHeaderCell>
        ))}
      </DayOfWeekRow>

      <Grid>
        {dates.map(date => {
          const day = date.getDate();
          const isInCurrentMonth = isSameMonth(date, viewDate);

          const isSelected = isSameDay(selectedDate, date);
          const isToday = isSameDay(date, new Date());

          const formatted = formatDate(date);
          const dots = calendarMarks[formatted] || [];
          const dotColor = (type: CalendarMarkType) =>
            isInCurrentMonth ? CALENDAR_LEGEND[type].color : '#ddd';

          return (
            <Cell
              key={formatted}
              role="button"
              aria-label={String(day)}
              $selected={isSelected}
              $today={isToday}
              onClick={() => onDateClick(date)}
            >
              <DateNumber $dimmed={!isInCurrentMonth}>{day}</DateNumber>
              <DotRow $hasDots={dots.length > 0}>
                {dots.map(type => (
                  <Dot key={type} data-testid={`dot-${type}`} $color={dotColor(type)} />
                ))}
              </DotRow>
            </Cell>
          );
        })}
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DayOfWeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayHeaderCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;

  ${tx.body('med16')};
  color: ${({ theme }) => theme.color.black};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 4px;
`;

const Cell = styled.div<{ $selected?: boolean; $today?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  min-height: 48px;

  background: ${({ theme, $selected }) => ($selected ? theme.color.main[100] : theme.color.white)};
  border: 2px solid
    ${({ theme, $selected, $today }) =>
      $selected || $today ? theme.color.main[500] : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
`;

const DateNumber = styled.span<{ $dimmed?: boolean }>`
  ${tx.body('med16')};
  color: ${({ theme, $dimmed }) => ($dimmed ? theme.color.gray[300] : theme.color.gray[500])};
`;

const DotRow = styled.div<{ $hasDots: boolean }>`
  display: flex;
  justify-content: center;
  gap: 2px;
  min-height: 4px; // dot이 없는 날에도 영역 확보
`;

const Dot = styled.div<{ $color: string }>`
  width: 4px;
  height: 4px;
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
`;

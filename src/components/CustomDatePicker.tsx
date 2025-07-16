import { useState } from 'react';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { DAYS_OF_WEEK } from '@/constants/calendar';
import type { BaseFieldProps } from '@/types/form';
import { getMonthDates, isSameMonth } from '@/utils/calendar';

interface CustomDatePickerProps extends BaseFieldProps {
  value: string;
  onChange: (date: string) => void;
}

export const CustomDatePicker = ({
  label,
  value: selectedDate,
  onChange,
}: CustomDatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [visibleDate, setVisibleDate] = useState(new Date(selectedDate));

  const visibleYear = visibleDate.getFullYear();
  const visibleMonth = visibleDate.getMonth() + 1;
  const calendarDates = getMonthDates(visibleYear, visibleMonth);

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setVisibleDate(new Date(selectedDate));
    }
    setIsCalendarOpen(prev => !prev);
  };

  const handlePrevMonth = () => {
    const prev = new Date(visibleDate);
    prev.setMonth(prev.getMonth() - 1);
    setVisibleDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(visibleDate);
    next.setMonth(next.getMonth() + 1);
    setVisibleDate(next);
  };

  const handleSelectDate = (date: string) => {
    onChange(date);
    setIsCalendarOpen(false);
  };

  return (
    <FieldGroup>
      {label && <Label>{label}</Label>}
      <TriggerButton onClick={handleToggleCalendar}>
        <span>{selectedDate}</span>
        <Calendar size={18} />
      </TriggerButton>
      {isCalendarOpen && (
        <CalendarPanel>
          <CalendarHeaderRow>
            <button onClick={handlePrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <span>
              {visibleYear}년 {visibleMonth}월
            </span>
            <button onClick={handleNextMonth}>
              <ChevronRight size={18} />
            </button>
          </CalendarHeaderRow>

          <DayOfWeekRow>
            {DAYS_OF_WEEK.map(day => (
              <CalendarHeaderCell key={day}>{day}</CalendarHeaderCell>
            ))}
          </DayOfWeekRow>

          <CalendarGrid>
            {calendarDates.map(date => {
              const dateObj = new Date(date);
              const day = dateObj.getDate();
              const isCurrentMonth = isSameMonth(dateObj, visibleYear, visibleMonth);
              const isSelected = date === selectedDate;

              return (
                <DateCell
                  key={date}
                  $dimmed={!isCurrentMonth}
                  $isSelected={isSelected}
                  onClick={() => handleSelectDate(date)}
                >
                  {day}
                </DateCell>
              );
            })}
          </CalendarGrid>
        </CalendarPanel>
      )}
    </FieldGroup>
  );
};

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  padding-left: 8px;
  font-size: 14px;
  color: #333;
`;

const TriggerButton = styled.div`
  padding: 12px 16px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const CalendarPanel = styled.div`
  margin-top: -4px;
  padding: 16px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
`;

const CalendarHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CalendarHeaderCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  font-weight: bold;
  color: #373737;
`;

const DayOfWeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #fff;
`;

const DateCell = styled.div<{
  $dimmed?: boolean;
  $isSelected?: boolean;
  $isHeader?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  font-weight: normal;
  color: ${({ $dimmed }) => ($dimmed ? '#ccc' : '#000')};
  background-color: ${({ $dimmed, $isSelected }) =>
    $isSelected ? '#FFE299' : $dimmed ? '#fff' : 'transparent'};
  border: 2px solid #fff;
  cursor: pointer;

  &:hover {
    background-color: #fde68a;
  }
`;

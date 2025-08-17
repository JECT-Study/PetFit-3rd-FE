import { useState } from 'react';

import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { DAYS_OF_WEEK } from '@/constants/calendar';
import { typo } from '@/styles/tokens';
import type { BaseFieldProps } from '@/types/form';
import {
  formatDate,
  getMonthDates,
  getMonthNumber,
  getYear,
  isSameDay,
  isSameMonth,
} from '@/utils/calendar';

interface CustomDatePickerProps extends BaseFieldProps {
  value: Date;
  onChange: (date: Date) => void;
  withYearSelect?: boolean;
}

export const CustomDatePicker = ({
  label,
  value: selectedDate,
  onChange,
  withYearSelect,
}: CustomDatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [visibleDate, setVisibleDate] = useState(new Date(selectedDate));
  const [isSelectingYear, setIsSelectingYear] = useState(false);

  const calendarDates = getMonthDates(visibleDate);

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setVisibleDate(new Date(selectedDate));
    }
    setIsCalendarOpen(prev => !prev);
    setIsSelectingYear(false);
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

  const handleSelectDate = (date: Date) => {
    onChange(date);
    setIsCalendarOpen(false);
  };

  const handleToggleYearSelect = () => {
    if (withYearSelect) setIsSelectingYear(prev => !prev);
  };

  const yearList = Array.from({ length: 42 }, (_, i) => 1984 + i); // 1984 ~ 2025

  return (
    <FieldGroup>
      {label && <Label>{label}</Label>}
      <TriggerButton onClick={handleToggleCalendar}>
        <TriggerSpan>{formatDate(selectedDate)}</TriggerSpan>
        <Calendar size={18} color="var(--grey-700)" />
      </TriggerButton>
      {isCalendarOpen && (
        <CalendarPanel>
          <CalendarHeaderRow>
            <button onClick={handlePrevMonth}>
              <ChevronLeft size={18} color="var(--grey-700)" />
            </button>
            <CalendarHeaderCenter>
              <span>
                {getYear(visibleDate)}년 {getMonthNumber(visibleDate)}월
              </span>
              {withYearSelect && (
                <YearToggleButton onClick={handleToggleYearSelect}>
                  <ChevronDown size={18} color="var(--grey-700)" />
                </YearToggleButton>
              )}
            </CalendarHeaderCenter>
            <button onClick={handleNextMonth}>
              <ChevronRight size={18} color="var(--grey-700)" />
            </button>
          </CalendarHeaderRow>

          {isSelectingYear ? (
            <YearScrollContainer>
              {yearList.map(year => (
                <DateCell
                  key={year}
                  $isSelected={year === getYear(visibleDate)}
                  onClick={() => {
                    const newDate = new Date(visibleDate);
                    newDate.setFullYear(year);
                    setVisibleDate(newDate);
                    setIsSelectingYear(false);
                  }}
                >
                  {year}
                </DateCell>
              ))}
            </YearScrollContainer>
          ) : (
            <>
              <DayOfWeekRow>
                {DAYS_OF_WEEK.map(day => (
                  <CalendarHeaderCell key={day}>{day}</CalendarHeaderCell>
                ))}
              </DayOfWeekRow>

              <CalendarGrid>
                {calendarDates.map(date => {
                  const day = date.getDate();
                  const isCurrentMonth = isSameMonth(date, visibleDate);
                  const isSelected = isSameDay(date, selectedDate);

                  return (
                    <DateCell
                      key={date.toISOString()}
                      $dimmed={!isCurrentMonth}
                      $isSelected={isSelected}
                      onClick={() => handleSelectDate(date)}
                    >
                      {day}
                    </DateCell>
                  );
                })}
              </CalendarGrid>
            </>
          )}
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
  color: var(--grey-600);
  ${typo.bodyReg14};
`;

const TriggerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--main-100);
  border: 1.5px solid var(--main-500);
  border-radius: 8px;
  cursor: pointer;
`;

const TriggerSpan = styled.span`
  color: var(--grey-700);
  ${typo.bodySemi14};
`;

const CalendarPanel = styled.div`
  margin-top: -4px;
  padding: 16px;
  background-color: var(--main-100);
  border: 1.5px solid var(--main-500);
  border-radius: 8px;
`;

const CalendarHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CalendarHeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  ${typo.bodySemi14};
`;

const YearToggleButton = styled.button`
  background: transparent;
  padding: 0;
`;

const YearScrollContainer = styled.div`
  max-height: 210px; // 7줄까지 보여주고 나머진 스크롤
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 4px;
  border-top: 1px solid #eee;
`;

const CalendarHeaderCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  color: var(--grey-700);
  ${typo.bodyMed16};
`;

const DayOfWeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid var(--white-0);
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
  color: ${({ $dimmed }) => ($dimmed ? 'var(--grey-300)' : '#000')};
  background-color: ${({ $dimmed, $isSelected }) =>
    $isSelected ? 'var(--main-300)' : $dimmed ? 'var(--white-0)' : 'transparent'};
  border: 2px solid var(--white-0);
  cursor: pointer;

  &:hover {
    background-color: #fde68a;
  }
`;

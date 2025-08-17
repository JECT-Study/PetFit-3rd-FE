import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { MonthlyViewPanel } from '@/features/calendar/MonthlyViewPanel';
import { WeeklyViewPanel } from '@/features/calendar/WeeklyViewPanel';
import { setMode, setSelectedDate, setViewDate } from '@/store/calendarSlice';
import type { RootState } from '@/store/store';
import { isSameDay } from '@/utils/calendar';

export const CalendarPage = () => {
  const dispatch = useDispatch();

  const mode = useSelector((state: RootState) => state.calendar.mode);
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate);

  const handleSelectedtDate = (date: Date) => {
    // 주간 보기에서 동일 날짜를 다시 선택하면 월간 모드로 전환
    if (mode === 'week' && isSameDay(selectedDate, date)) {
      dispatch(setMode('month'));
    } else {
      dispatch(setMode('week'));
    }
    dispatch(setSelectedDate(date));
    dispatch(setViewDate(date)); // 선택된 날짜 기준으로 viewDate 갱신
  };

  return (
    <Wrapper>
      <Header>달력</Header>

      {mode === 'month' && (
        <MonthlyViewPanel
          viewDate={viewDate}
          selectedDate={selectedDate}
          onChangeViewDate={date => dispatch(setViewDate(date))}
          onDateClick={handleSelectedtDate}
        />
      )}

      {mode === 'week' && (
        <WeeklyViewPanel
          viewDate={viewDate}
          selectedDate={selectedDate}
          onChangeViewDate={date => dispatch(setViewDate(date))}
          onDateClick={handleSelectedtDate}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Header = styled.h2`
  text-align: center;
  padding: 18px 0;
`;

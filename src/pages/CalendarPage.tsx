import { useState } from 'react';

import { ChevronLeft, ChevronRight, Dog, Cat, PawPrint } from 'lucide-react';
import styled from 'styled-components';

import { formatDate } from '@/utils/formatDate';
import { getDatesInMonth } from '@/utils/getDatesInMonth';

// --- 타입 선언 ---
type PetType = '강아지' | '고양이' | '햄스터' | '조류' | '어류' | '파충류';
type CalendarMarkType = 'routine' | 'memo' | 'note';

// 상수 선언
const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// --- 목데이터 ---
const mockingPets: { id: number; name: string; type: PetType }[] = [
  { id: 1, name: '댕댕이', type: '강아지' },
  { id: 2, name: '냥이', type: '고양이' },
  { id: 3, name: '콩이', type: '햄스터' },
];

const LEGEND_ITEMS: Record<CalendarMarkType, { label: string; color: string }> = {
  routine: { label: '루틴 체크', color: '#4285F4' },
  memo: { label: '메모', color: '#EA4335' },
  note: { label: '특이사항', color: '#FBBC05' },
};

const LEGEND_ORDER: CalendarMarkType[] = ['routine', 'memo', 'note'];

const MOCK_CALENDAR_DATA: Record<string, CalendarMarkType[]> = {
  '2025-04-28': ['routine'], // 이전 달 dot
  '2025-05-01': ['routine', 'memo'],
  '2025-05-04': ['note'],
  '2025-05-15': ['routine'],
  '2025-05-30': ['memo'],
  '2025-06-01': ['note'], // 다음 달 dot
  '2025-06-04': ['routine', 'note'],
  '2025-06-08': ['memo'],
  '2025-06-15': ['routine', 'memo'],
  '2025-06-28': ['note'],
};

function getCalendarDates(year: number, month: number): string[] {
  const result: string[] = [];
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDay = firstDayOfMonth.getDay(); // 0 (일) ~ 6 (토)
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
  const currMonthLastDate = new Date(year, month, 0).getDate();

  // 이전 달 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 2, prevMonthLastDate - i);
    result.push(formatDate(date));
  }

  // 현재 달 날짜
  for (let i = 1; i <= currMonthLastDate; i++) {
    result.push(formatDate(new Date(year, month - 1, i)));
  }

  // 다음 달 날짜 채우기
  const totalCells = Math.ceil(result.length / 7) * 7; // 7의 배수 맞춤
  const remaining = totalCells - result.length;

  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month, i); // 정확히 다음 달 날짜
    result.push(formatDate(nextDate));
  }

  return result;
}

export const CalendarPage = () => {
  const [selectedPetId, setSelectedPetId] = useState<number>(1);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
    const lastDate = getDatesInMonth(newDate.getFullYear(), newDate.getMonth() + 1).pop();
    if (lastDate) setSelectedDate(lastDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
    const firstDate = getDatesInMonth(newDate.getFullYear(), newDate.getMonth() + 1)[0];
    setSelectedDate(firstDate);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  const dates = getCalendarDates(year, month);

  return (
    <Wrapper>
      <Header>달력</Header>

      {/* 동물 종류 탭 */}
      <PetTabs>
        {mockingPets.map(pet => {
          const Icon = pet.type === '강아지' ? Dog : pet.type === '고양이' ? Cat : PawPrint;

          return (
            <PetTab
              key={pet.id}
              $active={selectedPetId === pet.id}
              onClick={() => setSelectedPetId(pet.id)}
            >
              <PetIconWrapper $active={selectedPetId === pet.id}>
                <Icon size={20} />
              </PetIconWrapper>
              <span>{pet.name}</span>
            </PetTab>
          );
        })}
      </PetTabs>

      {/* 달력 뷰 영역 */}
      <CalendarMonthWrapper>
        <MonthNav>
          <button onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <MonthLabel>{`${year}년 ${month}월`}</MonthLabel>
          <button onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </MonthNav>

        <DayHeaderRow>
          {DAYS_OF_WEEK.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
        </DayHeaderRow>

        <Grid>
          {dates.map(date => {
            const day = new Date(date).getDate();
            const isSelected = selectedDate === date;
            const dots = MOCK_CALENDAR_DATA[date] || [];

            const dateObj = new Date(date);
            const isInViewMonth = dateObj.getMonth() + 1 === month;
            const dotColor = (type: CalendarMarkType) =>
              isInViewMonth ? LEGEND_ITEMS[type].color : '#BDBDBD';

            return (
              <Cell key={date} $selected={isSelected} onClick={() => setSelectedDate(date)}>
                <DateNumber>{day}</DateNumber>
                <DotRow hasDots={dots.length > 0}>
                  {dots.map(type => (
                    <Dot key={type} color={dotColor(type)} />
                  ))}
                </DotRow>
              </Cell>
            );
          })}
        </Grid>
      </CalendarMonthWrapper>

      {/* 범례 영역 */}
      <LegendRow>
        {LEGEND_ORDER.map(type => (
          <LegendItem key={type}>
            <Dot color={LEGEND_ITEMS[type].color} />
            <LegendLabel>{LEGEND_ITEMS[type].label}</LegendLabel>
          </LegendItem>
        ))}
      </LegendRow>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Header = styled.h2`
  text-align: center;
  padding: 18px 0;
`;

const PetTabs = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
  padding-left: 20px;
`;

const PetTab = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#000' : '#888')};
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
`;

const PetIconWrapper = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? '#E3F2FD' : '#eee')};
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ $active }) => ($active ? '2px solid #2196F3' : 'none')};
  color: ${({ $active }) => ($active ? '#2196F3' : '#999')};
`;

const CalendarMonthWrapper = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;

const MonthNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MonthLabel = styled.div`
  font-weight: bold;
`;

const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  text-align: center;
  font-weight: bold;
`;

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

const DateNumber = styled.span`
  font-size: 14px;
  text-align: center;
`;

const DotRow = styled.div<{ hasDots: boolean }>`
  display: flex;
  justify-content: center;
  gap: 2px;
  min-height: 6px; // dot이 없는 날에도 영역 확보
  margin-top: 4px;
`;

const Dot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
`;

const LegendRow = styled.div`
  display: flex;
  margin-top: 10px;
  padding-left: 32px;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendLabel = styled.span`
  font-size: 14px;
`;

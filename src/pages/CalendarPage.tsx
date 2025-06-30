import { useState } from 'react';

import { ChevronLeft, ChevronRight, Dog, Cat, PawPrint } from 'lucide-react';
import styled from 'styled-components';

import { MonthView } from '@/features/calendar/MonthView';
import { NoteModal } from '@/features/calendar/NoteModal';
import { WeekView } from '@/features/calendar/WeekView';
import { formatDate } from '@/utils/formatDate';
import { getDatesInMonth } from '@/utils/getDatesInMonth';

// --- 타입 선언 ---
type PetType = '강아지' | '고양이' | '햄스터' | '조류' | '어류' | '파충류';
type CalendarMarkType = 'routine' | 'memo' | 'note';
type CalendarMode = 'month' | 'week';

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
  '2025-06-29': ['note'],
  '2025-07-02': ['note'],
};

export const CalendarPage = () => {
  const [selectedPetId, setSelectedPetId] = useState<number>(1);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [mode, setMode] = useState<CalendarMode>('month');
  const [manuallySelected, setManuallySelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
    const lastDate = getDatesInMonth(newDate.getFullYear(), newDate.getMonth() + 1).pop();
    if (lastDate) {
      setSelectedDate(lastDate);
      setManuallySelected(false);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
    const firstDate = getDatesInMonth(newDate.getFullYear(), newDate.getMonth() + 1)[0];
    setSelectedDate(firstDate);
    setManuallySelected(false);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;

  const handleDateSelect = (date: string) => {
    // 주간 보기에서 동일 날짜를 다시 선택하면 월간 모드로 전환
    if (mode === 'week' && selectedDate === date) {
      setMode('month');
      setManuallySelected(false);
      return;
    }

    // 일반 날짜 선택
    setSelectedDate(date);
    setManuallySelected(true);
    setMode('week');
  };

  return (
    <Wrapper>
      <Header>달력</Header>

      {/* 동물 종류 탭 */}
      {mode === 'month' && (
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
      )}

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

        <DayHeaderRow $mode={mode}>
          {DAYS_OF_WEEK.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
        </DayHeaderRow>

        {mode === 'month' && (
          <MonthView
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            calendarData={MOCK_CALENDAR_DATA}
            legendItems={LEGEND_ITEMS}
            manuallySelected={manuallySelected}
          />
        )}

        {mode === 'week' && (
          <WeekView
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectedDate={handleDateSelect}
            calendarData={MOCK_CALENDAR_DATA}
            legendItems={LEGEND_ITEMS}
          />
        )}
      </CalendarMonthWrapper>

      {/* 범례 영역 */}
      {mode === 'month' && (
        <LegendRow>
          {LEGEND_ORDER.map(type => (
            <LegendItem key={type}>
              <Dot color={LEGEND_ITEMS[type].color} />
              <LegendLabel>{LEGEND_ITEMS[type].label}</LegendLabel>
            </LegendItem>
          ))}
        </LegendRow>
      )}

      <Divider />

      <MarginTop>
        <MarginBottom>
          <SectionTitle>하루 루틴</SectionTitle>
          <SectionAction onClick={() => setIsModalOpen(true)}>특이사항 추가</SectionAction>
        </MarginBottom>
        <div style={{ backgroundColor: 'red' }}>콘텐츠</div>
      </MarginTop>

      {isModalOpen && <NoteModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />}
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

const DayHeaderRow = styled.div<{ $mode: 'month' | 'week' }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: ${({ $mode }) => ($mode === 'week' ? '0' : '10px')};
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  text-align: center;
  font-weight: bold;
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

const Divider = styled.div`
  height: 7px;
  background-color: #e0e0e0;
  margin: 20px 0 16px;
`;

const MarginTop = styled.div`
  margin-top: 12px;
`;

const MarginBottom = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.span`
  font-weight: bold;
  font-size: 16px;
  color: #212121;
`;

const SectionAction = styled.button`
  font-size: 14px;
  color: #757575;
  text-decoration: none;
  cursor: pointer;
`;

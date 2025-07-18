import { useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { DAYS_OF_WEEK } from '@/constants/calendar';
import { WeeklyDetailsPanel } from '@/features/calendar/WeeklyDetailsPanel';
import { WeekView } from '@/features/calendar/WeekView';
import type { Note } from '@/types/note';
import { getMonthNumber } from '@/utils/calendar';

interface WeeklyViewPanelProps {
  viewDate: Date;
  selectedDate: Date;
  onChangeViewDate: (newDate: Date) => void;
  onDateClick: (date: Date) => void;
}

export const WeeklyViewPanel = ({
  viewDate,
  selectedDate,
  onChangeViewDate,
  onDateClick,
}: WeeklyViewPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  const isSameWeek = (date1: Date, date2: Date) => {
    const startOfWeek = (date: Date) => {
      const d = new Date(date);
      d.setDate(d.getDate() - d.getDay());
      return d;
    };
    return startOfWeek(date1).toDateString() === startOfWeek(date2).toDateString();
  };

  const getWeekOfMonth = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay(); // 0: 일요일 ~ 6: 토요일
    const offsetDate = date.getDate() + dayOfWeek;
    return Math.ceil(offsetDate / 7);
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(viewDate);
    prevWeek.setDate(viewDate.getDate() - 7);

    if (isSameWeek(prevWeek, selectedDate)) {
      onChangeViewDate(selectedDate);
    } else {
      const sunday = new Date(prevWeek);
      sunday.setDate(sunday.getDate() - sunday.getDay()); // 주 시작일 계산
      const lastDayPrevWeek = new Date(sunday);
      lastDayPrevWeek.setDate(sunday.getDate() + 6); // 이전 주의 마지막 날 (토요일)
      onChangeViewDate(lastDayPrevWeek);
    }
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(viewDate);
    nextWeek.setDate(viewDate.getDate() + 7);

    if (isSameWeek(nextWeek, selectedDate)) {
      onChangeViewDate(selectedDate);
    } else {
      const sunday = new Date(nextWeek);
      sunday.setDate(sunday.getDate() - sunday.getDay()); // 주 시작일 계산
      const firstDayNextWeek = new Date(sunday);
      onChangeViewDate(firstDayNextWeek); // 다음 주의 시작일 (일요일)
    }
  };

  const handleSubmitNote = (note: Note) => {
    if (editingNoteIndex !== null) {
      setNotes(prev => prev.map((n, i) => (i === editingNoteIndex ? note : n)));
      setEditingNoteIndex(null);
    } else {
      setNotes(prev => [...prev, note]);
    }
    setIsModalOpen(false);
  };

  const handleEditNote = (index: number) => {
    setEditingNoteIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteNote = (index: number) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <CalendarMonthWrapper>
        <MonthNav>
          <button onClick={handlePrevWeek}>
            <ChevronLeft size={20} />
          </button>
          <MonthLabel>{`${getMonthNumber(viewDate)}월 ${getWeekOfMonth(viewDate)}주차`}</MonthLabel>
          <button onClick={handleNextWeek}>
            <ChevronRight size={20} />
          </button>
        </MonthNav>

        <DayHeaderRow>
          {DAYS_OF_WEEK.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
        </DayHeaderRow>

        <WeekView viewDate={viewDate} selectedDate={selectedDate} onDateClick={onDateClick} />
      </CalendarMonthWrapper>

      <WeeklyDetailsPanel
        notes={notes}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onAdd={() => setIsModalOpen(true)}
        onSubmit={handleSubmitNote}
        onClose={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
        initialNote={
          editingNoteIndex !== null ? notes[editingNoteIndex] : { title: '', content: '' }
        }
      />
    </>
  );
};

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
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  text-align: center;
  font-weight: bold;
`;

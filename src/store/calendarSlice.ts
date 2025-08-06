import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CalendarMode } from '@/types/calendar';

interface CalendarState {
  mode: CalendarMode;
  viewDate: Date;
  selectedDate: Date;
}

const initialState: CalendarState = {
  mode: 'month',
  viewDate: new Date(),
  selectedDate: new Date(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<CalendarMode>) => {
      state.mode = action.payload;
    },
    setViewDate: (state, action: PayloadAction<Date>) => {
      state.viewDate = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setMode, setViewDate, setSelectedDate } = calendarSlice.actions;
export default calendarSlice.reducer;

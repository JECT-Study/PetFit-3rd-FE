// src/store/notifySlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ToastItem = {
  alarmId: number;
  title: string;
  content: string;
  timeLabel: string; // '오전 11:00'
  expireAt: number; // Date.now() + 60_000
};

type State = { current: ToastItem | null };
const initialState: State = { current: null };

const slice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    setToast(state, { payload }: PayloadAction<ToastItem>) {
      state.current = payload; // ✅ last-wins (덮어쓰기)
    },
    clearToast(state) {
      state.current = null;
    },
  },
});

export const { setToast, clearToast } = slice.actions;
export default slice.reducer;

// src/store/sseSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SsePhase = 'idle' | 'connecting' | 'open' | 'error' | 'closed';

interface SseState {
  phase: SsePhase;
  petId: number | null;
  retry: number; // 백오프 횟수
  lastEventAt: number | null;
  lastError?: string | null;
}

const initialState: SseState = {
  phase: 'idle',
  petId: null,
  retry: 0,
  lastEventAt: null,
  lastError: null,
};

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    sseConnecting(state, action: PayloadAction<{ petId: number }>) {
      state.phase = 'connecting';
      state.petId = action.payload.petId;
      state.lastError = null;
    },
    sseOpen(state) {
      state.phase = 'open';
      state.retry = 0;
    },
    sseEvent(state) {
      state.lastEventAt = Date.now();
    },
    sseError(state, action: PayloadAction<{ message?: string }>) {
      state.phase = 'error';
      state.lastError = action.payload.message ?? null;
      state.retry += 1;
    },
    sseClosed(state) {
      state.phase = 'closed';
    },
    sseReset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { sseConnecting, sseOpen, sseEvent, sseError, sseClosed, sseReset } = sseSlice.actions;
export default sseSlice.reducer;

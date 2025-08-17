// store/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string | null;
  nickname: string | null;
  memberId: number | null;
}

const initialState: UserState = {
  email: null,
  nickname: null,
  memberId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    setMemberId: (state, action: PayloadAction<number | null>) => {
      state.memberId = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, setMemberId, clearUser } = userSlice.actions;
export default userSlice.reducer;

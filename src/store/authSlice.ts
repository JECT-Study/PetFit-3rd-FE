import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isNewUser?: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isNewUser: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
    },
    setIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
    logout: () => initialState,
  },
});

export const { setTokens, setIsNewUser, logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated' | 'onboarding';
interface AuthState {
  status: AuthStatus; // 인증 흐름 상태
}

const initialState: AuthState = {
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** 부팅/새로고침 시, /auth/me 호출 전 */
    startAuthCheck(state) {
      state.status = 'checking';
    },
    /** /auth/me 성공 (기존 유저) */
    setAuthenticated(state) {
      state.status = 'authenticated';
    },
    /** /auth/me 성공 (신규 유저 → 온보딩) */
    setOnboarding(state) {
      state.status = 'onboarding';
    },
    /** /auth/me 실패(리프레시 실패 포함) */
    setUnauthenticated(state) {
      state.status = 'unauthenticated';
    },
    /** 명시적 로그아웃/탈퇴 */
    logout() {
      return initialState;
    },
  },
});

export const { startAuthCheck, setAuthenticated, setOnboarding, setUnauthenticated, logout } =
  authSlice.actions;
export default authSlice.reducer;

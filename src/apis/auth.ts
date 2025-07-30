import { IS_DEV } from '@/constants/env';

import { axiosInstance } from './axiosInstance';

/**
 * 카카오 로그인 요청
 * - dev: 응답에서 accessToken, refreshToken 반환
 * - prod: 쿠키(HttpOnly) 기반 자동 저장, 별도 응답 처리 없음
 */
export const kakaoLogin = async (code: string) => {
  const endpoint = IS_DEV ? '/auth/kakao/login/dev' : '/auth/kakao/login';

  try {
    // 302 redirect 목적의 요청만 수행 (개발 환경만 실행)
    await axiosInstance.get(endpoint, {
      params: { code },
    });
  } catch (error) {
    console.error('kakao login failed:', error);
    throw error;
  }
};

/**
 * 카카오 로그아웃 요청
 * - dev: refreshToken body로 전달
 * - prod: 쿠키 기반 로그아웃
 */
export const kakaoLogout = async () => {
  const endpoint = IS_DEV ? '/auth/kakao/logout/dev' : '/auth/kakao/logout';

  try {
    const body = IS_DEV ? { refreshToken: localStorage.getItem('refreshToken') } : undefined; // prod는 쿠키 기반이라 body 비움

    await axiosInstance.post(endpoint, body);
  } catch (error) {
    console.error('kakao logout failed:', error);
    throw error;
  }
};

/**
 * 카카오 회원탈퇴 (dev/prod 공통)
 */
export const kakaoWithdraw = async () => {
  try {
    await axiosInstance.post('/auth/kakao/withdraw');
  } catch (error) {
    console.error('user delete failed: ', error);
    throw error;
  }
};

/**
 * 운영환경: 서버에 accessToken, refreshToken 전달하여 쿠키 설정
 * - 서버가 쿠키(HttpOnly)를 응답으로 내려주는 역할
 * - 프론트는 토큰을 직접 저장하지 않고 쿠키로 인증 유지
 */
export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  try {
    const response = await axiosInstance.post('/auth/token/cookie', null, {
      params: {
        accessToken,
        refreshToken,
      },
    });

    const { newUser } = response.data.content;

    return { isNewUser: newUser }; // 호출부에서는 isNewUser로 사용할 수 있도록 변환
  } catch (error) {
    console.error('setAuthCookies failed:', error);
    throw error;
  }
};

/**
 * 서버에 쿠키 기반 인증 상태 확인 요청
 */
export const verifyAuth = async (): Promise<boolean> => {
  const res = await axiosInstance.get('/auth/verify'); // 서버에서 쿠키 기반 검증
  return res.data.isAuthenticated; // 서버에서 { isAuthenticated: true } 응답 가정
};

import axios from 'axios';

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
    const response = await axios.get(endpoint, {
      params: { code },
    });

    // 개발환경일 경우 accessToken, refreshToken 반환
    if (IS_DEV) {
      return {
        accessToken: response.data.content.accessToken,
        refreshToken: response.data.content.refreshToken,
      };
    }

    // 배포 환경은 쿠키 기반 저장 → 응답 별도 처리 없음
    return null;
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
 * Access Token을 쿠키로 재설정 요청 (서버가 쿠키로만 발급하는 경우에 사용)
 * - 주로 로그인 직후, 쿠키 기반 토큰을 새로 심기 위해 사용
 */
export const getAccessTokenFromCookie = async () => {
  try {
    await axiosInstance.get('/auth/accesscookie');
  } catch (error) {
    console.error('get access cookie failed:', error);
    throw error;
  }
};

/**
 * 서버에 쿠키 기반 인증 상태 확인 요청
 * @returns 인증 성공 시 true, 실패 시 false
 */
export const verifyAuth = async (): Promise<boolean> => {
  try {
    await axios.get('/auth/verify'); // 200 OK 시 인증됨
    return true;
  } catch (err) {
    console.log('verify auth failed:', err);
    return false;
  }
};

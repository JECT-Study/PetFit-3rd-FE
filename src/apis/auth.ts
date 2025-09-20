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
export const kakaoWithdraw = async (memberId: number | null) => {
  try {
    await axios.post(`/auth/kakao/withdraw`, { memberId }, { withCredentials: true });
  } catch (error) {
    console.error('user delete failed: ', error);
    throw error;
  }
};

/**
 * 서버에 쿠키 기반 인증 상태 확인 요청
 */
export const getAuthMe = async () => {
  const res = await axiosInstance.post('/auth/auth/me'); // 서버에서 쿠키 기반 검증
  const { memberId, newUser } = res.data.content;
  return { memberId, isNewUser: newUser };
};

export const getNickname = async (memberId: number | null) => {
  try {
    const response = await axiosInstance.get(`members/${memberId}`);
    return response.data.content;
  } catch (error) {
    console.error('get nickname failed: ', error);
  }
};

export const editNickname = async (memberId: number, nickname: string) => {
  try {
    await axiosInstance.put(`members/${memberId}`, { nickname });
  } catch (error) {
    console.error('edit nickname failed: ', error);
  }
};

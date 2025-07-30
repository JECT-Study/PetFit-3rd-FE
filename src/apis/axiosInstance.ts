import axios, { type InternalAxiosRequestConfig } from 'axios';

import { IS_DEV } from '@/constants/env';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 개발환경일 때만 accessToken 헤더 추가
    if (IS_DEV) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  error => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();

        if (IS_DEV && newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest); // 요청 재시도
      } catch (e) {
        console.error('토큰 갱신 실패:', e);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Access Token 재발급 요청 (401 대응용)
 * - dev: refreshToken을 body로 포함
 * - prod: 쿠키에서 자동 전달 (HttpOnly)
 */
const refreshAccessToken = async () => {
  try {
    const body = IS_DEV ? { refreshToken: localStorage.getItem('refreshToken') } : undefined;

    const response = await axiosInstance.post('/auth/refresh', body);

    if (IS_DEV) {
      const newAccessToken = response.data.content.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    }

    // prod: 서버가 쿠키로 재설정 → 별도 처리 없음
    return null;
  } catch (error) {
    console.error('refresh token failed:', error);
    throw error;
  }
};

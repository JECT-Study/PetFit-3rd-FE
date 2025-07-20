import axios from 'axios';

import { axiosInstance } from './axiosInstance';

export const kakaoLogin = async (code: string) => {
  try {
    await axios.get(`auth/kakao/login`, {
      params: { code },
    });
  } catch (error) {
    console.error('kakao Login failed:', error);
    throw error;
  }
};

export const kakaoLoginDev = async (code: string) => {
  try {
    const response = await axios.get(`auth/kakao/login/dev`, {
      params: { code },
    });
    return response;
  } catch (error) {
    console.error('kakao Login failed:', error);
    throw error;
  }
};

export const kakaoLogout = async () => {
  try {
    await axiosInstance.post('auth/kakao/logout', '');
  } catch (error) {
    console.error('logout failed: ', error);
    throw error;
  }
};

export const kakaoLogoutDev = async () => {
  try {
    await axiosInstance.post('auth/kakao/logout/dev');
    // redux 초기화 나중에 추가해줘야 함
  } catch (error) {
    console.error('logout failed: ', error);
    throw error;
  }
};

export const kakaoWithdraw = async () => {
  try {
    await axiosInstance.post('auth/kakao/withdraw');
  } catch (error) {
    console.error('user delete failed: ', error);
    throw error;
  }
};

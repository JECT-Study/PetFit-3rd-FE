import axios from 'axios';

import type { AppDispatch } from '@/store';
import { setUser } from '@/store/userSlice';

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

export const kakaoLoginDev = async (code: string, dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`auth/kakao/login/dev`, {
      params: { code },
    });
    dispatch(
      setUser({
        email: response.data.content.email,
        nickname: response.data.content.nickname,
        userId: response.data.content.userId,
      })
    );
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
    await axiosInstance.post('auth/kakao/logout/dev', '');
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

// 삭제될듯
// export const getNickname = async (memberId: number) => {
//   try {
//     const response = await axiosInstance.get(`members/${memberId}`);
//     console.log(response);
//     return response;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export const editNickname = async (memberId: number, nickname: string) => {
  try {
    const response = await axiosInstance.put(`members/${memberId}`, { nickname });
    console.log(response);
  } catch (error) {
    console.error('edit nickname failed: ', error);
    throw error;
  }
};

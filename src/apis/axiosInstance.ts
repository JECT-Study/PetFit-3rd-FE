import axios, { type InternalAxiosRequestConfig } from 'axios';

import { kakaoLogoutDev } from '@/apis/auth';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const status = error.response.data.status;
    const originalRequest = error.config;
    if (status === 'A004' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('check refreshToken');
        const newToken = await getRefreshToken();
        console.log(newToken);
        // getRefreshToken에서 axiosInstance.defaults.headers['Authorization']을 바꿔주는데 굳이?
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await kakaoLogoutDev();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const response = await axios.post('/auth/refresh', { refreshToken: refreshToken });
    console.log('getRefreshToken', response);
    if (response.data.data) {
      const accessToken = response.data.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

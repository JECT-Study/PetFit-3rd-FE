import axios, { type InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
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

// refreshToken으로 accessToken 발급받는 로직은 배포 후에 추가 예정
axiosInstance.interceptors.response.use();

export const getRefreshToken = async () => {};

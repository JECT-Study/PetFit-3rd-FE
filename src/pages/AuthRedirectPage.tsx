import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { kakaoLoginDev } from '@/apis/auth';
import type { AppDispatch } from '@/store';

export const AuthRedirectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) return;

    const getToken = async () => {
      try {
        const response = await kakaoLoginDev(code, dispatch);

        const accessToken = response.data.content.accessToken;
        const refreshToken = response.data.content.refreshToken;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        navigate('/');
      } catch (err) {
        console.error('로그인 실패', err);
        navigate('/login');
      }
    };

    getToken();
  }, []);

  return <div>로그인 중</div>;
};

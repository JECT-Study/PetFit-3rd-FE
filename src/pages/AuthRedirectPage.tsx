import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { getAccessTokenFromCookie, kakaoLogin } from '@/apis/auth';
import { IS_DEV } from '@/constants/env';

export const AuthRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) return;

    const getToken = async () => {
      try {
        const result = await kakaoLogin(code);

        if (IS_DEV && result) {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
        }

        if (!IS_DEV) {
          await getAccessTokenFromCookie(); // ✅ prod 환경에서 AT 쿠키 설정
        }

        navigate('/signup/pet'); // TODO: 추후 반려동물 유무에 따라 navigate 경로 수정 필요.
      } catch (err) {
        console.error('로그인 실패', err);
        navigate('/login');
      }
    };

    getToken();
  }, []);

  return <div>로그인 중</div>;
};

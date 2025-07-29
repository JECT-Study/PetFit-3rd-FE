import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { kakaoLogin } from '@/apis/auth';

export const AuthRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      console.error('❌ 인가 코드 없음');
      navigate('/login');
      return;
    }

    const getToken = async () => {
      try {
        await kakaoLogin(code); // API 호출만 수행
        // 이후 자동 302 리디렉션이 일어나서 /token 으로 이동
      } catch (err) {
        console.error('로그인 실패', err);
        navigate('/login');
      }
    };

    getToken();
  }, []);

  return <div>로그인 중</div>;
};

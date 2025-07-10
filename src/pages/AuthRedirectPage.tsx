import { useEffect } from 'react';

import { useSearchParams, useNavigate } from 'react-router-dom';

import { kakaoLoginDev } from '@/apis/auth';

export const AuthRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      navigate('/login');
      return;
    }

    const doLogin = async () => {
      try {
        await kakaoLoginDev(code);
        navigate('/');
      } catch (err) {
        console.log(err);
        navigate('/login');
      }
    };

    doLogin();
  }, []);
  return <div></div>;
};

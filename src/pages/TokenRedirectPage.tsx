import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { axiosInstance } from '@/apis/axiosInstance';
import { IS_DEV } from '@/constants/env';
import { setTokens, setIsNewUser } from '@/store/authSlice';
import type { RootState } from '@/store/store';

/**
 * 카카오 인증 후, 서버에서 리디렉션 되는 페이지
 * 리디렉션 되면서 리턴값과 쿠키 설정이 무시되므로, 쿠키 설정 요청을 직접 보냄.
 */
export const TokenRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxAccessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      console.error('❌ 토큰이 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
      return;
    }

    // 1. Redux에 토큰 저장
    dispatch(setTokens({ accessToken, refreshToken }));

    // 2. 개발환경: 로컬스토리지 저장
    if (IS_DEV) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.info('✅ 개발환경: 토큰을 localStorage에 저장했습니다.');
      navigate('/signup/pet'); // 개발환경에선 쿠키 설정 없이 바로 이동
      return;
    }

    // 3. 운영환경: 쿠키 설정 API 호출
    const setCookie = async () => {
      try {
        const res = await axiosInstance.post('/auth/cookie', {
          accessToken,
          refreshToken,
        });

        const { isNewUser } = res.data;

        dispatch(setIsNewUser(isNewUser));

        if (isNewUser) {
          navigate('/signup/pet');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('❌ 쿠키 설정 실패', err);
        // ✅ 임시 fallback 처리: accessToken이 있으면 /signup/pet로 이동
        if (reduxAccessToken) {
          console.warn('⚠️ 쿠키 설정 실패했지만 accessToken은 Redux에 있음 → /signup/pet로 이동');
          navigate('/signup/pet');
        } else {
          navigate('/login');
        }
      }
    };

    setCookie();
  }, [dispatch, navigate, searchParams]);

  return <p>로그인 처리 중입니다...</p>;
};

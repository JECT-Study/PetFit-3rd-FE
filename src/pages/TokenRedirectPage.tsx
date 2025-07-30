import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { setAuthCookies } from '@/apis/auth';
import { IS_DEV } from '@/constants/env';
import { setTokens, setIsNewUser } from '@/store/authSlice';

/**
 * 카카오 인증 후, 서버에서 리디렉션 되는 페이지
 * - 개발환경: 토큰을 localStorage에 저장 후 바로 회원가입 페이지로 이동
 * - 운영환경: 쿠키 설정 API 호출 후 신규 유저 여부에 따라 페이지 분기
 */
export const TokenRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    } else {
      // 3. 운영환경: 쿠키 설정 API 호출
      const setCookieAndRedirect = async () => {
        try {
          const { isNewUser } = await setAuthCookies(accessToken, refreshToken);

          dispatch(setIsNewUser(isNewUser));

          if (isNewUser) {
            navigate('/signup/pet');
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error('❌ 쿠키 설정 실패', err);

          if (accessToken) {
            console.warn('⚠️ 쿠키 설정 실패했지만 accessToken은 Redux에 있음 → /signup/pet로 이동');
            navigate('/signup/pet');
          } else {
            navigate('/login');
          }
        }
      };

      setCookieAndRedirect();
    }
  }, [dispatch, navigate, searchParams]);

  return <p>로그인 처리 중입니다...</p>;
};

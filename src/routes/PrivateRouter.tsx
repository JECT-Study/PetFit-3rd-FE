import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getAuthMe } from '@/apis/auth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  setAuthenticated,
  setOnboarding,
  setUnauthenticated,
  startAuthCheck,
} from '@/store/authSlice';
import type { RootState } from '@/store/store';
import { setUser } from '@/store/userSlice';

export const PrivateRouter = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const status = useSelector((s: RootState) => s.auth.status);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(startAuthCheck());
      try {
        const { memberId, isNewUser } = await getAuthMe();
        // 전역 유저 상태 저장
        dispatch(setUser({ memberId, email: null, nickname: null }));

        if (isNewUser) {
          dispatch(setOnboarding());
        } else {
          dispatch(setAuthenticated());
        }
      } catch (e) {
        console.error('❌ /auth/me 실패', e);
        dispatch(setUnauthenticated());
      }
    };

    if (status === 'idle') {
      checkAuth();
    }
  }, [dispatch, status]);

  // --- 분기 처리 ---
  if (status === 'checking') {
    return <LoadingSpinner />;
  }

  if (status === 'onboarding') {
    // 신규 유저 → 온보딩 페이지
    return <Navigate to="/signup/pet" replace />;
  }

  if (status === 'authenticated') {
    // 인증 성공 → 보호 라우트 컴포넌트 렌더
    return <Outlet />;
  }

  // unauthenticated (또는 초기화 실패) → 로그인 페이지로
  return <Navigate to="/login" replace state={{ from: location }} />;
};

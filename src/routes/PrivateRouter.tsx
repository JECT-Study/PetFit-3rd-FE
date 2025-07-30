import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { verifyAuth } from '@/apis/auth';
import { IS_DEV } from '@/constants/env';
import type { RootState } from '@/store/store';

export const PrivateRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const checkAuth = async () => {
      if (IS_DEV) {
        // 1. 개발환경: localStorage에 accessToken이 있으면 로그인으로 간주
        const accessToken = localStorage.getItem('accessToken');
        setIsAuthenticated(!!accessToken);
      } else {
        // 2. 운영환경: 서버에 쿠키가 존재하는지 verifyAuth로 확인
        try {
          const result = await verifyAuth(); // boolean 응답 예상
          setIsAuthenticated(result);
        } catch (e) {
          console.error('❌ 인증 검증 실패', e);

          // 임시로 Redux 상태에 accessToken이 있으면 인증된 것으로 간주
          if (accessToken) {
            console.warn('Redux에 accessToken 존재 → 인증된 것으로 간주');
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>로그인 검사 중...</div>; // 필요 시 Skeleton 처리 가능
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

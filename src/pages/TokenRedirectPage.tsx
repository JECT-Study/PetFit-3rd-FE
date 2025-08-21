import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { setAuthCookies } from '@/apis/auth';
import { getPets } from '@/apis/pets';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { IS_DEV } from '@/constants/env';
import { setTokens, setIsNewUser } from '@/store/authSlice';
import { setSelectedPetId } from '@/store/petSlice';
import { setMemberId } from '@/store/userSlice';

/**
 * 카카오 인증 후, 서버에서 리디렉션 되는 페이지
 * - 개발환경: 토큰을 localStorage에 저장 + (공통) memberId 조회 요청
 * - 운영환경: (공통) 쿠키 설정/조회 요청
 * - 공통: memberId/isNewUser를 기반으로 라우팅
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

    // 1) Redux에 토큰 저장
    dispatch(setTokens({ accessToken, refreshToken }));

    // 2) DEV: 로컬스토리지에도 저장
    if (IS_DEV) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.info('✅ DEV: 토큰을 localStorage에 저장했습니다.');
    }

    // 3) 공통: 서버에 요청하여 memberId/isNewUser 확보 (운영: 쿠키 설정 포함)
    const fetchMemberAndRoute = async () => {
      try {
        const { memberId, isNewUser } = await setAuthCookies(accessToken, refreshToken);

        // 상태/스토리지 반영
        dispatch(setMemberId(memberId));
        dispatch(setIsNewUser(isNewUser));
        localStorage.setItem('memberId', String(memberId));

        if (isNewUser) {
          // 신규 유저 → 온보딩
          localStorage.removeItem('selectedPetId');
          navigate('/signup/pet');
          return;
        }

        // ✅ 기존 유저: 펫 목록으로 selectedPetId 초기화
        const pets = await getPets(memberId);

        if (!pets || pets.length === 0) {
          // 기존 유저지만 펫 없음 → 온보딩 유도
          localStorage.removeItem('selectedPetId');
          navigate('/signup/pet');
          return;
        }

        // 1) 기존 저장된 selectedPetId가 목록에 존재하면 유지
        const stored = localStorage.getItem('selectedPetId');
        const storedId = stored ? Number(stored) : null;
        const hasStored = storedId != null && pets.some(p => p.id === storedId);

        // 2) 없거나 유효하지 않으면 대표(즐겨찾기) 우선, 그 외 첫 번째
        const nextSelected = hasStored
          ? storedId!
          : pets.slice().sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite))[0].id;

        // 상태/스토리지 동기화
        dispatch(setSelectedPetId(nextSelected));
        localStorage.setItem('selectedPetId', String(nextSelected));

        // 홈으로 이동
        navigate('/');
      } catch (err) {
        console.error('❌ memberId 조회/쿠키 설정 실패', err);

        // 폴백 전략
        if (IS_DEV) {
          // DEV: 토큰은 보유 중 → 최소한 회원가입 플로우로 진입
          console.warn('⚠️ DEV 폴백: /signup/pet로 이동');
          navigate('/signup/pet');
        } else {
          // PROD: 재로그인 유도
          navigate('/login');
        }
      }
    };

    fetchMemberAndRoute();
  }, [dispatch, navigate, searchParams]);

  return (
    <p>
      <LoadingSpinner />
    </p>
  );
};

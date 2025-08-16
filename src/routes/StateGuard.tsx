// routes/StateGuard.tsx
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { IS_DEV } from '@/constants/env';
import { setSelectedPetId } from '@/store/petSlice';
import type { RootState } from '@/store/store';
import { setMemberId } from '@/store/userSlice';

interface Props {
  requireMemberId?: boolean;
  requireSelectedPet?: boolean;
}

export const StateGuard = ({ requireMemberId = true, requireSelectedPet = true }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const memberId = useSelector((s: RootState) => s.user.memberId);
  const selectedPetId = useSelector((s: RootState) => s.selectedPet.id);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // 1) memberId 요구 시 검증/보정
    if (requireMemberId && memberId == null) {
      const m = localStorage.getItem('memberId');
      if (m) {
        // 보정 디스패치 후 다음 렌더를 기다림(이번 사이클에서는 종료)
        dispatch(setMemberId(Number(m)));
        return;
      }
      // 로컬에도 없음 → 로그아웃 처리
      if (IS_DEV) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      localStorage.removeItem('memberId');
      localStorage.removeItem('selectedPetId');
      alert('로그아웃되었습니다. 다시 로그인해 주세요.');
      navigate('/login', { replace: true });
      return;
    }

    // 2) selectedPetId 요구 시 검증/보정
    if (requireSelectedPet && (selectedPetId == null || selectedPetId === -1)) {
      const p = localStorage.getItem('selectedPetId');
      if (p) {
        dispatch(setSelectedPetId(Number(p)));
        return;
      }

      // ✅ 온보딩 미완료 → 가입 플로우로 소프트 리다이렉트 (로그아웃 ❌)
      navigate('/signup/pet', { replace: true });
      return;
    }

    // 3) 모든 요구 조건 충족 → 통과
    setChecked(true);
  }, [requireMemberId, requireSelectedPet, memberId, selectedPetId, dispatch, navigate]);

  if (!checked) return null; // 보정 중엔 화면 미표시
  return <Outlet />;
};

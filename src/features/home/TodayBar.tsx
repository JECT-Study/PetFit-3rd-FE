import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPetById } from '@/apis/pets';
import type { RootState } from '@/store/store';

export const TodayBar = () => {
  const selectedPetId = useSelector((s: RootState) => s.selectedPet.id);

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', selectedPetId],
    queryFn: () => getPetById(selectedPetId as number),
    enabled: selectedPetId !== null, // ✅ 선택된 경우만 호출
    staleTime: 1000 * 60 * 5,
  });

  // ✅ 'YYYY-MM-DD' 안전 파싱(타임존 이슈 회피)
  const parseISODate = (iso?: string | null) => {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d); // 로컬 자정
  };

  const today = new Date();
  const toYMD = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const birth = parseISODate(pet?.birthDate);
  const diffDays =
    birth != null
      ? Math.max(0, Math.floor((toYMD(today).getTime() - toYMD(birth).getTime()) / 86400000))
      : null;

  const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(
    today.getDate()
  ).padStart(2, '0')}일`;

  const dDay =
    selectedPetId === null || isLoading ? 'D —' : diffDays === null ? 'D —' : `D+ ${diffDays}`;

  return (
    <Wrapper>
      <TodayText>
        <strong>Today</strong> {formattedDate}
      </TodayText>
      <DDayText>{dDay}</DDayText>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const TodayText = styled.span`
  font-size: 14px;
  color: #333;

  strong {
    margin-right: 4px;
    font-weight: 600;
  }
`;

const DDayText = styled.span`
  font-size: 14px;
  color: #555;
`;

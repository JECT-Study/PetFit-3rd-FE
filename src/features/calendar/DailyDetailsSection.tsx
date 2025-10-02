/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchDailyEntries } from '@/apis/calendar';
import type { RootState } from '@/store/store';
import { formatDate } from '@/utils/calendar';

import { RoutineList } from './RoutineList';
import { NoteSection } from './NoteSection';
import { tx } from '@/styles/typography';
import type { UiNote } from '@/types/calendar.ui';
import { toUiNote } from '@/utils/transform/calendar';
import { toUiRoutine } from '@/utils/transform/routine';
import type { NoteSectionHandle } from './NoteSection';

interface DailyDetailsSectionProps {
  selectedDate: Date;
}

export const DailyDetailsSection = ({ selectedDate }: DailyDetailsSectionProps) => {
  const selectedPetId = useSelector((state: RootState) => state.selectedPet.id);

  const formattedDate = formatDate(selectedDate); // 'YYYY-MM-DD'

  // ✅ 일간 특이사항 + 루틴 조회 API 호출
  const { data } = useQuery({
    queryKey: ['dailyEntries', selectedPetId, formattedDate],
    queryFn: () => {
      if (selectedPetId === null) throw new Error('No pet selected');
      return fetchDailyEntries(selectedPetId, formattedDate);
    },
    enabled: selectedPetId !== null,
    staleTime: 5 * 60 * 1000,
  });

  // ✅ 조회 결과 → UI 모델 변환 (부모에서 계산만)
  const notes: UiNote[] = useMemo(() => (data?.remarkResponseList ?? []).map(toUiNote), [data]);

  const routines = useMemo(
    () => (data?.routineResponseList ?? []).map(toUiRoutine).filter(Boolean),
    [data]
  );

  // ✅ 자식 메서드 호출을 위한 ref
  const remarksRef = useRef<NoteSectionHandle>(null);
  const handleAddNote = () => remarksRef.current?.openCreate(); // ✅ 부모 버튼 → 자식 모달 오픈

  return (
    <Wrapper>
      <MarginBottom>
        <SectionTitle>하루 루틴</SectionTitle>
        <SectionAction onClick={handleAddNote} data-testid="note-add">
          특이사항 추가
        </SectionAction>
      </MarginBottom>

      <Section role="region" aria-label="하루 루틴">
        {/* ✅ 프레젠테이션 전용: 데이터만 전달 */}
        <RoutineList routines={routines} />

        {/* ✅ CRUD/모달은 NoteSection이 관리 (조회 데이터만 주입) */}
        <NoteSection
          ref={remarksRef}
          petId={selectedPetId ?? -1}
          selectedDate={selectedDate}
          notes={notes}
        />
      </Section>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
`;

const MarginBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Section = styled.section`
  padding: 0 20px;
`;

const SectionTitle = styled.span`
  color: #434343;
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 1.575rem */
  letter-spacing: -0.02813rem;
`;

const SectionAction = styled.button`
  color: #797979;
  ${tx.body('med13')};
`;

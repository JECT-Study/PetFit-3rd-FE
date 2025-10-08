// features/home/BriefFeature.tsx
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { tx } from '@/styles/typography';
import { useBriefCardData } from '@/hooks/useBriefCardData';
import { BriefCard } from './BriefCard';

import { NoteModal } from '@/features/calendar/NoteModal';
import { useNoteForm } from '@/hooks/useNoteForm';
import type { UiNote } from '@/types/calendar.ui';
import { createNote } from '@/apis/calendar';
import { toRemarkCreateDto } from '@/utils/transform/calendar';
import { mapRemarksToBrief, mapSchedulesToBrief } from './mappers';

type Props = {
  petId: number;
  today: Date; // 보통 오늘
};

const createEmpty = (): UiNote => ({ id: Date.now(), title: '', content: '' });

export const BriefFeature = ({ petId, today }: Props) => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // 홈 브리핑 데이터(서버 상태)
  const { scheduleData, remarkData } = useBriefCardData(petId);
  // 카드용 단순 타입으로 매핑 (id + title)
  const scheduleItems = mapSchedulesToBrief(scheduleData);
  const remarkItems = mapRemarksToBrief(remarkData);

  // 특이사항 모달 드래프트만 로컬
  const [draft, setDraft] = useState<UiNote | null>(null);
  const { errors, canSave, onChange, onBlurField, resetTouched } = useNoteForm(draft, setDraft);

  const openCreateNote = () => {
    setDraft(createEmpty());
    resetTouched();
  };

  const closeNote = () => setDraft(null);

  const onSubmitNote = async () => {
    if (!draft || petId <= 0 || !canSave) return;
    try {
      await createNote(petId, toRemarkCreateDto(draft, today));
      // 홈 카드 리프레시
      qc.invalidateQueries({ queryKey: ['remark', petId] });
      // (캘린더 등 다른 화면도 갱신이 필요하면 여기에 invalidate 추가)
      closeNote();
    } catch (e) {
      console.error('특이사항 저장 실패', e);
    }
  };

  const todayLabel = useMemo(() => {
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${m}월 ${d}일`;
  }, [today]);

  return (
    <Wrapper>
      <BriefHeader>
        <SectionTitle>오늘의 브리핑</SectionTitle>
        <TodayText>{todayLabel}</TodayText>
      </BriefHeader>

      <CardRow>
        <BriefCard variant="alarm" items={scheduleItems} onAdd={() => navigate('/alarm')} />
        <BriefCard
          variant="note"
          items={remarkItems}
          onAdd={openCreateNote} // ⬅️ 모달 오픈
        />
      </CardRow>

      {/* 특이사항 모달 */}
      <NoteModal
        open={!!draft}
        onClose={closeNote}
        note={draft ?? createEmpty()}
        errors={errors}
        canSave={canSave}
        onChange={onChange}
        onBlurField={onBlurField}
        onSubmit={onSubmitNote}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 20px;
`;

const BriefHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
`;

const SectionTitle = styled.h2`
  ${tx.title('semi18')};
  color: ${({ theme }) => theme.color.black};
`;

const TodayText = styled.span`
  ${tx.body('reg14')};
  color: ${({ theme }) => theme.color.gray[700]};
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

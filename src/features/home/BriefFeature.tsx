// features/home/BriefFeature.tsx
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';

import { tx } from '@/styles/typography';
import { useBriefCardData } from '@/hooks/useBriefCardData';
import { BriefCard } from './BriefCard';

import { NoteModal } from '@/features/calendar/NoteModal';
import { useNoteForm } from '@/hooks/useNoteForm';
import type { UiNote } from '@/types/calendar.ui';
import { createNote } from '@/apis/calendar';
import { toRemarkCreateDto } from '@/utils/transform/calendar';
import { mapAlarmsToBrief, mapRemarksToBrief } from './mappers';
import type { AlarmForm } from '@/types/alarm.base';
import { createAlarm } from '@/apis/alarm';
import { toCreateAlarmRequestDto } from '@/utils/transform/alarm';
import { useAlarmForm } from '@/hooks/useAlarmForm';
import { AlarmModal } from '../alarm/AlarmModal';
import type { NoteForm } from '@/types/calendar.base';

type Props = {
  petId: number;
  today: Date; // 보통 오늘
};

const createEmptyNote = (): NoteForm => ({ title: '', content: '' });
const createEmptyAlarm = (date: Date): AlarmForm => ({
  title: '',
  content: '',
  date, // 기본 오늘
  hour: 9, // 기본 09:00
  minute: 0,
});

export const BriefFeature = ({ petId, today }: Props) => {
  const qc = useQueryClient();

  // 홈 브리핑 데이터(서버 상태)
  const { alarmData, remarkData } = useBriefCardData(petId);
  // 카드용 단순 타입으로 매핑 (id + title)
  const alarmItems = mapAlarmsToBrief(alarmData);
  const remarkItems = mapRemarksToBrief(remarkData);

  // ===== 특이사항 모달 =====
  const [noteDraft, setNoteDraft] = useState<NoteForm | null>(null);
  const {
    errors: noteErrors,
    canSave: canSaveNote,
    onChange: onChangeNote,
    onBlurField: onBlurNoteField,
    resetTouched: resetNoteTouched,
  } = useNoteForm(noteDraft, setNoteDraft);

  const openCreateNote = () => {
    setNoteDraft(createEmptyNote());
    resetNoteTouched();
  };
  const closeNote = () => setNoteDraft(null);

  const onSubmitNote = async () => {
    if (!noteDraft || petId <= 0 || !canSaveNote) return;
    try {
      await createNote(petId, toRemarkCreateDto(noteDraft, today));
      // 홈 카드 리프레시
      qc.invalidateQueries({ queryKey: ['remark', petId] });
      closeNote();
    } catch (e) {
      console.error('특이사항 저장 실패', e);
    }
  };

  // ===== 알람 모달 =====
  const [alarmDraft, setAlarmDraft] = useState<AlarmForm | null>(null);
  const {
    errors: alarmErrors,
    canSave: canSaveAlarm,
    onChange: onChangeAlarm,
    onBlurField: onBlurAlarmField,
    resetTouched: resetAlarmTouched,
  } = useAlarmForm(alarmDraft, setAlarmDraft);

  const openCreateAlarm = () => {
    setAlarmDraft(createEmptyAlarm(today));
    resetAlarmTouched();
  };
  const closeAlarm = () => setAlarmDraft(null);

  const onSubmitAlarm = async () => {
    if (!alarmDraft || petId <= 0 || !canSaveAlarm) return;
    try {
      await createAlarm(petId, toCreateAlarmRequestDto(alarmDraft));
      // 홈 카드의 알람 데이터 쿼리 갱신
      qc.invalidateQueries({ queryKey: ['alarm', petId] });
      closeAlarm();
    } catch (e) {
      console.error('알람 저장 실패', e);
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
        <BriefCard variant="alarm" items={alarmItems} onAdd={openCreateAlarm} />
        <BriefCard variant="note" items={remarkItems} onAdd={openCreateNote} />
      </CardRow>

      {/* 알람 모달 */}
      <AlarmModal
        open={!!alarmDraft}
        onClose={closeAlarm}
        alarm={alarmDraft ?? createEmptyAlarm(today)}
        errors={alarmErrors}
        canSave={canSaveAlarm}
        onChange={onChangeAlarm}
        onBlurField={onBlurAlarmField}
        onSubmit={onSubmitAlarm}
      />

      {/* 특이사항 모달 */}
      <NoteModal
        open={!!noteDraft}
        onClose={closeNote}
        note={noteDraft ?? createEmptyNote()}
        errors={noteErrors}
        canSave={canSaveNote}
        onChange={onChangeNote}
        onBlurField={onBlurNoteField}
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

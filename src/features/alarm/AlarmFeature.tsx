import { forwardRef, useImperativeHandle, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AlarmList } from '@/features/alarm/AlarmList';
import { AlarmModal } from '@/features/alarm/AlarmModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { useAlarmForm } from '@/hooks/useAlarmForm';

import type { UiAlarm } from '@/types/alarm.ui';
import type { AlarmForm } from '@/types/alarm.base';
import type { AlarmId } from '@/types/alarm.dto';

import { createAlarm, deleteAlarm, updateAlarm } from '@/apis/alarm';
import {
  toCreateAlarmRequestDto,
  toUpdateAlarmRequestDto,
  toAlarmForm,
} from '@/utils/transform/alarm';

type Props = {
  petId: number; // 서버 호출에 필요
  alarms: UiAlarm[]; // 페이지에서 조회해 주입(SSOT)
};

export type AlarmFeatureHandle = { openCreate: () => void };

const createEmpty = (): AlarmForm => ({
  title: '',
  content: '',
  date: new Date(),
  hour: 9,
  minute: 0,
});

export const AlarmFeature = forwardRef<AlarmFeatureHandle, Props>(({ petId, alarms }, ref) => {
  const qc = useQueryClient();

  // 드래프트/삭제대상만 로컬 관리 (목록은 서버 상태 신뢰)
  const [draft, setDraft] = useState<AlarmForm | null>(null);
  const [editingId, setEditingId] = useState<AlarmId | null>(null);
  const [deleteId, setDeleteId] = useState<AlarmId | null>(null);

  // 검증 훅(제목/내용만)
  const { errors, canSave, onChange, onBlurField, resetTouched } = useAlarmForm(draft, setDraft);

  // invalidate (SSOT)
  const invalidate = () => qc.invalidateQueries({ queryKey: ['alarms', petId] });

  const createMut = useMutation({
    mutationFn: (form: AlarmForm) => createAlarm(petId, toCreateAlarmRequestDto(form)),
    onSuccess: invalidate,
  });
  const updateMut = useMutation({
    mutationFn: ({ id, form }: { id: AlarmId; form: AlarmForm }) =>
      updateAlarm(id, toUpdateAlarmRequestDto(form)),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({
    mutationFn: (id: AlarmId) => deleteAlarm(id),
    onSuccess: invalidate,
  });

  // 진입
  const openCreate = () => {
    setEditingId(null);
    setDraft(createEmpty());
    resetTouched();
  };
  useImperativeHandle(ref, () => ({ openCreate }), [resetTouched]);

  const openEdit = (a: UiAlarm) => {
    setEditingId(a.id);
    // UiAlarm → AlarmForm (시간 분리)
    const form = toAlarmForm({
      id: a.id,
      title: a.title,
      content: a.content,
      notifyAt: a.notifyAt,
      read: a.read,
    });
    setDraft(form);
    resetTouched();
  };

  // 저장
  const handleSubmit = async () => {
    if (!draft || petId <= 0 || !canSave) return;
    try {
      if (editingId == null) {
        await createMut.mutateAsync(draft);
      } else {
        await updateMut.mutateAsync({ id: editingId, form: draft });
      }
      setDraft(null);
      setEditingId(null);
    } catch (e) {
      console.error('알람 저장 실패', e);
    }
  };

  // 삭제
  const requestDelete = (id: AlarmId) => setDeleteId(id);
  const handleConfirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteMut.mutateAsync(deleteId);
    } catch (e) {
      console.error('알람 삭제 실패', e);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <AlarmList alarms={alarms} onEdit={openEdit} onDelete={requestDelete} />

      <AlarmModal
        open={!!draft}
        onClose={() => {
          setDraft(null);
          setEditingId(null);
        }}
        alarm={draft ?? createEmpty()}
        errors={errors}
        canSave={canSave}
        onChange={onChange}
        onBlurField={onBlurField}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
});
AlarmFeature.displayName = 'AlarmFeature';

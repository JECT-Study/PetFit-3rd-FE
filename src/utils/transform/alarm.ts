import type { AlarmDto, CreateAlarmRequestDto, UpdateAlarmRequestDto } from '@/types/alarm.dto';
import type { AlarmEntity } from '@/types/alarm.entity';
import type { AlarmForm } from '@/types/alarm.base';

/* ───────────── Date 유틸 ───────────── */

/** 로컬 date-only + 시분 → 로컬 Date(해당 일자 시각) */
export const mergeLocalDateTime = (dateOnly: Date, hour: number, minute: number): Date =>
  new Date(dateOnly.getFullYear(), dateOnly.getMonth(), dateOnly.getDate(), hour, minute, 0, 0);

/** Date → 시/분 분리(로컬) */
export const splitTime = (dt: Date) => ({
  hour: dt.getHours(),
  minute: dt.getMinutes(),
});

/* ───────────── DTO → Entity ───────────── */

export const toAlarmEntity = (dto: AlarmDto): AlarmEntity => ({
  id: dto.alarmId,
  title: dto.title,
  content: dto.content,
  notifyAt: new Date(dto.targetDateTime), // ISO(UTC) → Date(로컬로 표시됨)
  read: dto.read,
});

/* ───────────── Entity → UI ───────────── */

import type { UiAlarm } from '@/types/alarm.ui';

export const toUiAlarm = (e: AlarmEntity): UiAlarm => ({
  id: e.id,
  title: e.title,
  content: e.content,
  notifyAt: e.notifyAt,
  read: e.read,
  // timeLabel: new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }).format(e.notifyAt),
});

/* ───────────── Form ⇄ DTO/Entity ───────────── */

/** 폼 → 생성 요청 DTO */
export const toCreateAlarmRequestDto = (f: AlarmForm): CreateAlarmRequestDto => ({
  title: f.title,
  content: f.content,
  targetDateTime: mergeLocalDateTime(f.date, f.hour, f.minute).toISOString(), // KST→UTC ISO
});

/** 폼 → 수정 요청 DTO */
export const toUpdateAlarmRequestDto = (f: AlarmForm): UpdateAlarmRequestDto => ({
  title: f.title,
  content: f.content,
  targetDateTime: mergeLocalDateTime(f.date, f.hour, f.minute).toISOString(),
});

/** 엔티티 → 폼 초기값(수정 모드) */
export const toAlarmForm = (e: AlarmEntity): AlarmForm => {
  const { hour, minute } = splitTime(e.notifyAt);
  return {
    title: e.title,
    content: e.content,
    date: new Date(e.notifyAt.getFullYear(), e.notifyAt.getMonth(), e.notifyAt.getDate()), // date-only
    hour,
    minute,
  };
};

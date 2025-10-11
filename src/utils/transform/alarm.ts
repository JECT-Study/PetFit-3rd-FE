import type { AlarmDto, CreateAlarmRequestDto, UpdateAlarmRequestDto } from '@/types/alarm.dto';
import type { AlarmEntity } from '@/types/alarm.entity';
import type { AlarmForm } from '@/types/alarm.base';

/* ───────────── Date 유틸 ───────────── */

/** Date → 시/분 분리(로컬) */
export const splitTime = (dt: Date) => ({
  hour: dt.getHours(),
  minute: dt.getMinutes(),
});

// UI(Form) → DTO (생성/수정 요청)
// 로컬 date+time → Date → ISO → 밀리초/‘Z’ 제거(서버 규약)
const mergeLocalDateTime = (d: Date, h: number, m: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0, 0);

const toServerUtcString = (dt: Date) => dt.toISOString().replace(/\.\d{3}Z$/, ''); // 'YYYY-MM-DDTHH:mm:ss'

// 서버 문자열이 타임존 없으니 UTC로 간주해 파싱
const parseServerUtcString = (s: string) => new Date(`${s}Z`);

/* ───────────── DTO → Entity ───────────── */

export const toAlarmEntity = (dto: AlarmDto): AlarmEntity => ({
  id: dto.alarmId,
  title: dto.title,
  content: dto.content,
  notifyAt: parseServerUtcString(dto.targetDateTime), // ISO(UTC로 해석) → Date(로컬로 표시됨)
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
  targetDateTime: toServerUtcString(mergeLocalDateTime(f.date, f.hour, f.minute)), // KST→UTC ISO(no ms)
});

/** 폼 → 수정 요청 DTO */
export const toUpdateAlarmRequestDto = (f: AlarmForm): UpdateAlarmRequestDto => ({
  title: f.title,
  content: f.content,
  targetDateTime: toServerUtcString(mergeLocalDateTime(f.date, f.hour, f.minute)),
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

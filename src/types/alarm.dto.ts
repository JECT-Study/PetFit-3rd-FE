// BE 스키마 그대로 반영

export type AlarmId = number;

export interface AlarmDto {
  alarmId: AlarmId;
  title: string;
  content: string;
  /** ISO(UTC) 예: "2025-10-07T15:18:49.391Z" */
  targetDateTime: string;
  read: boolean;
}

export interface CreateAlarmRequestDto {
  title: string;
  content: string;
  /** ISO(UTC) */
  targetDateTime: string;
}

export type UpdateAlarmRequestDto = Partial<CreateAlarmRequestDto>;

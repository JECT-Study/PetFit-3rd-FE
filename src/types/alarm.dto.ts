// BE 스키마 그대로 반영

export type AlarmId = number;

// 밀리초 없는 ISO 문자열 (예: "2025-10-15T15:03:00")
export type IsoUtcNoMsNoZString = string;

export interface AlarmDto {
  alarmId: AlarmId;
  title: string;
  content: string;
  /** ISO(UTC) 예: "2025-10-07T15:18:49" */
  targetDateTime: IsoUtcNoMsNoZString;
  read: boolean;
}

export interface CreateAlarmRequestDto {
  title: string;
  content: string;
  /** ISO(UTC) */
  targetDateTime: IsoUtcNoMsNoZString;
}

export type UpdateAlarmRequestDto = Partial<CreateAlarmRequestDto>;

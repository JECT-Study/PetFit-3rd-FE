// 도메인 공통 값 + 폼 스냅샷(식별자 없음)

export interface AlarmBase {
  title: string;
  content: string;
}

/** 폼 스냅샷(생성/수정 공용): 날짜·시간 분리형 */
export interface AlarmForm extends AlarmBase {
  /** 'YYYY-MM-DD' 의미의 로컬 Date(시간 00:00) */
  date: Date;
  /** 0..23 */
  hour: number;
  /** 0..59 */
  minute: number;
}

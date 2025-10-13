// 프레젠테이션 모델(필요 시 라벨/포맷 필드 추가 가능)

import type { AlarmId } from './alarm.dto';

export interface UiAlarm {
  id: AlarmId;
  title: string;
  content: string;
  /** 표시용 날짜 객체 (엔티티와 동일로 둠) */
  notifyAt: Date;
  read: boolean;

  // 파생 필드 예시(원하면 채워서 사용)
  // timeLabel?: string; // "오전 08:00"
  // ddayLabel?: string; // "D-2"
}

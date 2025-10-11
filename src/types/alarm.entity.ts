// 앱 내부 소스-오브-트루스(식별자 포함, Date 유지)

import type { AlarmId } from './alarm.dto';

export interface AlarmEntity {
  id: AlarmId;
  title: string;
  content: string;
  /** 알림 시각 (로컬 Date) */
  notifyAt: Date;
  read: boolean;
}

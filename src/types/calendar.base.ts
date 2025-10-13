// types/calendar.base.ts
// 공통 도메인 최소값 (id 없음)

// 생성/수정·엔티티·UI가 공유하는 최소 공통값 (id 없음)
export interface NoteBase {
  title: string;
  content: string;
}

/** 폼 스냅샷(생성/수정 공용) */
export type NoteForm = NoteBase;

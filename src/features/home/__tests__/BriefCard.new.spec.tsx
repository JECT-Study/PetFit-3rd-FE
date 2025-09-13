// src/features/home/__tests__/BriefCard.new.spec.tsx
import { describe, it } from 'vitest';

// TODO: 아직 구현 전이므로 skip 처리
describe('[BriefCard][new] 알람 추가 버튼 → 모달 열림', () => {
  it.skip('+ 버튼 클릭 시 오늘 알람 추가 모달이 뜬다', async () => {
    // 구현 시:
    // 1) BriefCard에 onAdd 도입, TestHost에서 onAdd={() => setOpen(true)}
    // 2) ScheduleRegisterModal isOpen={open} 렌더
    // 3) + 클릭 → findByRole('dialog', { name: /알람 추가/i })
  });
});

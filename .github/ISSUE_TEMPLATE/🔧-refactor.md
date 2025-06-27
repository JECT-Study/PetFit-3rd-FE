---
name: "🔧 Refactor"
about: 구조 개선 및 코드 정리
title: "[Refactor] "
labels: ""
assignees: ""
---

### ⚖️ 작업 내용

<!-- 리팩터링할 대상이나 구조 변경 내용을 한 줄로 작성해 주세요 -->
`ReviewCard` 컴포넌트에서 사용되지 않는 props 제거 및 조건부 렌더링 로직 개선

### ✅ 작업 이유 / 필요성

<!-- 리팩터링이 필요한 이유를 구체적으로 작성해 주세요 -->
- props로 내려보내던 `isActive`, `onToggle`이 실제로 내부에서 사용되지 않음
- 로직이 분기마다 중복되어 가독성이 떨어졌고, 유지보수에 불리했음

### 🌟 완료 기준

<!-- 리팩터링이 완료된 상태를 판단할 수 있는 기준을 체크리스트로 작성해 주세요 -->

- [ ] `props drilling` 없는지 확인
- [ ] 유닛 테스트 통과

### 📌 참고 사항 (Optional)

<!-- 관련 컴포넌트 경로나 기준 문서가 있다면 작성해 주세요 -->
- 관련 파일: `src/components/review/ReviewCard.tsx`
- 코드 컨벤션 기준: `docs/style-guide.md` 참고
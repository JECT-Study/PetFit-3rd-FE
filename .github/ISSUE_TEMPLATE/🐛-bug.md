---
name: "🐛 Bug"
about: 버그 수정
title: "[Bug] "
labels: ""
assignees: ""
---

### 🐞 버그 설명

<!-- 어떤 문제가 발생했는지 구체적으로 작성해 주세요 -->
모바일 Safari 브라우저에서 BottomSheet 내 버튼 클릭이 작동하지 않음.  
iOS 환경에서만 발생하며, 크롬 DevTools 모바일 뷰에서는 정상 작동.

### ✅ 재현 방법

<!-- 어떤 절차를 따라야 동일한 문제가 발생하는지 순서대로 작성해 주세요 -->
1. iPhone Safari로 배포 사이트 접속
2. 특정 게시글 진입 → "거래 요청" 버튼 클릭
3. BottomSheet 열림 → 하단 "요청 보내기" 버튼 클릭 시 아무 반응 없음

### 🔍 예상 원인

<!-- 원인으로 추정되는 로직이나 상태를 작성해 주세요 -->
- Safari 브라우저의 `pointer-events` 또는 `z-index` 관련 렌더링 문제
- BottomSheet 내부의 `position: fixed` 구조에서 이벤트가 막히는 것으로 추정

### 🌟 기대 결과 / 수용 기준

<!-- 수정 후 어떤 결과가 기대되는지 체크리스트로 작성해 주세요 -->

- [ ] iOS Safari에서도 "요청 보내기" 버튼 클릭 이벤트가 정상 작동할 것
- [ ] 모든 브라우저에서 BottomSheet 버튼이 일관되게 반응할 것

### 📌 참고 사항 (Optional)

<!-- 커밋 해시, 로그, 문서 등 참고할 자료가 있다면 작성해 주세요 -->
- 관련 커밋: `1a2b3c4`
- 유사 이슈 참고: https://github.com/ionic-team/ionic-framework/issues/15482
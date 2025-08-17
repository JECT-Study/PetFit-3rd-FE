// .stylelintrc.cjs
module.exports = {
  customSyntax: 'postcss-styled-syntax',
  extends: [
    'stylelint-config-recommended', // 최소 설정
    'stylelint-config-styled-components', // styled-components 호환성
    'stylelint-config-standard', // 표준 CSS 룰
    'stylelint-config-rational-order', // CSS 속성 자동 정렬
    'stylelint-config-prettier', // Prettier와 충돌 방지
  ],
  rules: {
    'no-empty-source': null, // 스타일 코드를 포함한 JS/TSX 파일만 검사
  },
};

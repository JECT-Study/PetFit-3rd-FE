// .stylelintrc.cjs
module.exports = {
  processors: ["stylelint-processor-styled-components"],
  extends: [
    'stylelint-config-recommended', // 최소 설정
    'stylelint-config-styled-components', // styled-components 호환성
    'stylelint-config-standard', // 표준 CSS 룰
    'stylelint-config-prettier', // Prettier와 충돌 방지
  ],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-order': [
      [
        // ✅ 위치 관련 우선
        'position',
        'top',
        'left',
        'bottom',
        'right',
        'z-index',

        // ✅ 박스 모델 관련
        'display',
        'flex-direction',
        'align-items',
        'justify-content',

        // ✅ 마진/패딩
        'margin',
        'padding',

        // ✅ 기타 시각 속성
        'width',
        'height',
        'font-size',
        'font-weight',
        'line-height',

        // ✅ 마지막으로 색/배경 등 디자인
        'color',
        'background-color',
        'border',
        'box-shadow',
      ],
      {
        unspecified: 'bottomAlphabetical',
      },
    ],
    'no-empty-source': null, // 스타일 코드를 포함한 JS/TSX 파일만 검사
  },
};

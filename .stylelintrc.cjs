// .stylelintrc.cjs
/**
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    'order/properties-order': [
      [
        // ✅ 위치 관련 우선
        'position',
        'top',
        'right',
        'bottom',
        'left',
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
        'line-height',

        // ✅ 마지막으로 색/배경 등 디자인
        'color',
        'background-color',
        'border',
        'box-shadow',
      ],
      {
        unspecified: 'bottomAlphabetical', // 명시 안된 속성은 마지막에 알파벳 순
      },
    ],
  },
};
 */
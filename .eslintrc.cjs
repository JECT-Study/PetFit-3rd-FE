module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off', // ✅ React 17+에서 불필요
    'react/prop-types': 'off', // ✅ PropTypes 사용 안함
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js built-ins
          'external', // 외부 라이브러리
          'internal', // 내부 모듈
          ['parent', 'sibling', 'index'], // 상대 경로
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    'import/no-named-as-default': 'off', // default export한 모듈에서 named export도 함께 사용하는 경우(styled-components)
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
      },
    },
  ],
};

import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser, // добавляет window, document, fetch и т.д.
        ...globals.jest,    // добавляет test, expect, jest и т.д.
        ...globals.node,    // добавляет require, module, process и т.д.
        process: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // отключаем проверку prop-types
      'no-unused-vars': 'warn',  // предупреждение вместо ошибки для неиспользуемых переменных
      'no-console': 'warn',      // предупреждение для console.log
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Отдельная конфигурация для тестовых файлов
    files: ['**/__tests__/**', '**/__mocks__/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
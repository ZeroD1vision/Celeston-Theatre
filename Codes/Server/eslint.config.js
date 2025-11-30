import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-useless-escape': 'warn',
    },
  },
  {
    // Специфично для браузерных файлов (public/js/*)
    files: [
      'public/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'middleware/**/*.js',
      'config/**/*.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Браузерные globals
        document: 'readonly',
        window: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        alert: 'readonly',
        // Добавь пользовательские globals, если они определены в других скриптах
        movies: 'readonly',
      },
    },
  },
  {
    // Специфично для миграций (если они JS)
    files: ['config/migrations/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
  }
];
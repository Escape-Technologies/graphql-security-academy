/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:svelte/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser' },
      rules: {
        'svelte/valid-compile': 'warn',
      },
    },
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: { browser: true, es2017: true, node: true },
};

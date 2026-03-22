import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import("typescript-eslint").Config} */
export const base = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist/**', '.next/**', 'node_modules/**', '*.config.*'],
  },
)

/** @type {import("typescript-eslint").Config} */
export const react = tseslint.config(...base, {
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
})

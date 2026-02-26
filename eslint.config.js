import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  globalIgnores(['dist']),
  {
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      perfectionist.configs['recommended-natural']
    ],
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          customGroups: [
            { elementNamePattern: '^(key|ref)$', groupName: 'reserved' },
            { elementNamePattern: '^(id|name|className|htmlFor)$', groupName: 'identifier' },
            { elementNamePattern: '^on.*', groupName: 'callback' },
          ],
          groups: ['reserved', 'identifier', 'callback', 'unknown'],
          order: 'desc',
          type: 'line-length',
        }
      ]
    },
  },
])

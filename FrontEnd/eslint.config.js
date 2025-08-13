// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      globals: globals.browser
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint.plugin,
      prettier
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      'prettier/prettier': [
        'error',
        {
          // Core formatting rules
          singleQuote: true,          // 'string' instead of "string"
          semi: false,                 // No semicolons (cleaner look, personal/team preference)
          trailingComma: 'all',        // Keep trailing commas for cleaner diffs
          printWidth: 80,              // Line wrap length
          tabWidth: 2,                 // Two spaces for indentation
          useTabs: false,              // Spaces instead of tabs
          bracketSpacing: true,        // { foo: bar } instead of {foo: bar}
          arrowParens: 'always',       // Always include parens in arrow functions

          // JSX & TSX specific
          jsxSingleQuote: false,       // Keep double quotes in JSX props (<Button text="OK" />)
          bracketSameLine: false,      // Puts `>` of a multi-line JSX element on a new line
        }
      ],

      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ]
    }
  }
]


import globals from "globals";
import js from "@eslint/js"; // Import JS recommended config
import ts from "typescript-eslint"; // Import TypeScript-ESLint tooling
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import tsParser from '@typescript-eslint/parser'; // Keep explicit parser import

// Apply recommended configurations
const eslintConfig = [
  js.configs.recommended, // Apply JS recommended rules
  ...ts.configs.recommended, // Apply TS recommended rules (using spread syntax)
  { // React specific settings
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules, // Apply React recommended rules
      ...reactHooksPlugin.configs.recommended.rules, // Apply React Hooks recommended rules
      "react/react-in-jsx-scope": "off", // Disable - Not needed with new JSX transform
      "react/prop-types": "off", // Disable - Use TypeScript instead
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Keep custom/overridden TypeScript rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/ban-ts-comment": "error",
    },
  },
  { // ESLint comments configuration
    plugins: {
      'eslint-comments': eslintCommentsPlugin,
    },
    rules: {
      'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-disable': 'error',
    },
  },
  {
    rules: {
      "no-console": "error",
    },
  },
  { // Ignore build output and node_modules
    ignores: ['dist/', 'node_modules/'],
  },
];

export default eslintConfig;

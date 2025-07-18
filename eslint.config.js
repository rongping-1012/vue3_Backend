// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tsEslint from '@typescript-eslint/eslint-plugin'
import vueEslintPlugin from 'eslint-plugin-vue'
import vueEslintParser from 'vue-eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // 1. 忽略规则
  {
    ignores: ['node_modules/**', 'dist/**', '*.min.js'],
  },

  // 2. 基础配置
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
      parser: vueEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser', // TypeScript 解析器
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      js,
      '@typescript-eslint': tsEslint,
      vue: vueEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // ESLint 核心规则
      'no-var': 'error',
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-unexpected-multiline': 'error',
      'no-useless-escape': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // Prettier 规则
      'prettier/prettier': 'error',
      'arrow-parens': 'off',
      'comma-dangle': 'off',
      semi: 'off',
    },
  },

  // 3. ESLint 推荐规则
  js.configs.recommended,

  // 4. TypeScript 规则
  {
    files: ['**/*.{ts,mts,cts,vue}'],
    rules: {
      ...tsEslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/semi': 'off',
    },
  },

  // 5. Vue 规则（适配最新插件版本）
  {
    files: ['**/*.vue'],
    rules: {
      // 保留存在的核心 Vue 规则（移除已废弃的规则）
      'vue/multi-word-component-names': 'off', // 关闭组件名检查
      'vue/no-dupe-keys': 'error', // 禁止重复键
      'vue/no-duplicate-attributes': 'error', // 禁止重复属性
      'vue/require-v-for-key': 'error', // v-for 必须加 key
      'vue/no-mutating-props': 'off', // 允许修改 props（根据项目需求）
      'vue/attribute-hyphenation': 'off', // 关闭属性连字符检查
    },
  },
])

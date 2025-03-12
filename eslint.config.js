import {
  combine,
  comments,
  formatters,
  ignores,
  javascript,
  jsdoc,
  jsonc,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  typescript,
  unicorn,
  yaml,
} from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import tailwind from 'eslint-plugin-tailwindcss'

const compat = new FlatCompat()
const config = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
    ],
  }),
  ...(await combine(
    comments(),
    ignores(),
    formatters(),
    javascript(),
    jsdoc(),
    jsonc(),
    node(),
    // react(),
    sortPackageJson(),
    sortTsconfig(),
    stylistic(),
    typescript(),
    unicorn(),
    yaml(),
  )),
  ...tailwind.configs['flat/recommended'],
  ...compat.config({
    overrides: [{
      extends: ['plugin:markdownlint/recommended'],
      files: ['*.md'],
      parser: 'eslint-plugin-markdownlint/parser',
      rules: {
        'markdownlint/md012': 'warn',
        'markdownlint/md013': 'off',
        'markdownlint/md031': ['warn', {
          list_items: false,
        }],
      },
    }],
  }),
  {
    rules: {
      'curly': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'style/indent': 'warn',
      'style/jsx-closing-tag-location': 'off',
      'antfu/no-top-level-await': 'off',
    },
  },
]

export default config

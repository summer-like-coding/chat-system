import {
  combine,
  comments,
  formatters,
  ignores,
  javascript,
  jsdoc,
  jsonc,
  node,
  react,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  typescript,
  unicorn,
  yaml,
} from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural'

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
    react(),
    sortPackageJson(),
    sortTsconfig(),
    stylistic(),
    typescript(),
    unicorn(),
    yaml(),
  )),
  ...compat.config({
    extends: ['plugin:tailwindcss/recommended'],
    rules: {
    },
  }),
  ...compat.config({
    overrides: [{
      extends: ['plugin:markdownlint/recommended'],
      files: ['*.md'],
      parser: 'eslint-plugin-markdownlint/parser',
      rules: {
        // no-multiple-blanks
        'markdownlint/md012': 'warn',
        // line-length
        'markdownlint/md013': 'off',
        // blanks-around-fences
        'markdownlint/md031': ['warn', {
          list_items: false,
        }],
      },
    }],
  }),
  perfectionistNatural,
  {
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    },
  },
]

export default config

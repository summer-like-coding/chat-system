import {
  combine,
  comments,
  ignores,
  javascript,
  jsdoc,
  jsonc,
  node,
  react,
  sortPackageJson,
  sortTsconfig,
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
    javascript(),
    jsdoc(),
    jsonc(),
    node(),
    react(),
    sortPackageJson(),
    sortTsconfig(),
    typescript(),
    unicorn(),
    yaml(),
  )),
  ...compat.config({
    extends: ['plugin:tailwindcss/recommended'],
    rules: {
    },
  }),
  perfectionistNatural,
  {
    rules: {
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
    }
  }
]

export default config

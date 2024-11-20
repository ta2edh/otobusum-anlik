const stylistic = require('@stylistic/eslint-plugin')

// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  plugins: [
    '@stylistic',
  ],
  rules: {
    ...stylistic.configs['recommended-extends'].rules,
    '@stylistic/brace-style': ['error', '1tbs'],
  },
}

'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
    // node files
    {
      files: ['./.eslintrc.js', './.prettierrc.js', './index.js'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
  ],
};

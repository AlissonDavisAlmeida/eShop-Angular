module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    quotes: "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": "off",
    "array-callback-return": "off",
  },
};

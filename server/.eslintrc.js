module.exports = {
  env: {
    node: true,
    mocha: true,
    es2020: true
  },
  extends: ['airbnb-base/legacy', 'plugin:chai-friendly/recommended', 'plugin:mocha/recommended'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'vars-on-top': 0,
    'max-len': ['warn', { code: 500 }],
    'no-console': 0,
    'no-use-before-define': 0,
    'mocha/no-mocha-arrows': 0
  }
};

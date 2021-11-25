const { defaults } = require('jest-config')

module.exports = {
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|mjs|tsx?|ts?)$',
  testPathIgnorePatterns: ['<rootDir>/build/", "<rootDir>/node_modules/'],
  moduleFileExtensions: ['js', 'jsx', 'mjs']
}

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testPathIgnorePatterns: ['integration', 'fixtures'],
  moduleNameMapper: {
    "%(.*)$": "<rootDir>/src/$1",
    "#tests/(.*)": [
      "<rootDir>/__tests__/fixtures/$1",
    ]
  },
  verbose: false,
  setupFilesAfterEnv: ["jest-extended"]
};

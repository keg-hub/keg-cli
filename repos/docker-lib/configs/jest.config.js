const path = require('path')

const kegMocks = path.join(__dirname, '../../../src/__mocks__')

module.exports = {
  rootDir: path.join(__dirname, '../'),
  testEnvironment: "node",
  verbose: true,
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {
    "^KegMocks(.*)$": `${kegMocks}$1`,
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.js?(x)",
    "<rootDir>/scripts/**/__tests__/**/*.js?(x)"
  ],
  transformIgnorePatterns: [
    ".*"
  ],
  collectCoverageFrom: [
    "src/**/*.{js}",
    "!**/__mocks__/**/*.{js}"
  ],
  coverageDirectory: "reports/coverage",
  setupFilesAfterEnv: []
}
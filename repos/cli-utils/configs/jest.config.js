const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '../'),
  testEnvironment: "node",
  verbose: true,
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {},
  testMatch: [
    "<rootDir>/__tests__/**/*.js?(x)",
    "<rootDir>/src/**/__tests__/**/*.js?(x)",
    "<rootDir>/src/**/__tests__/**/*.ts?(x)",
    "<rootDir>/scripts/**/__tests__/**/*.js?(x)",
    "<rootDir>/scripts/**/__tests__/**/*.ts?(x)",
  ],
  transformIgnorePatterns: [
    ".*"
  ],
  collectCoverageFrom: [
    "src/**/*.{js}",
    "!**/__mocks__/**/*.{js}"
  ],
  coverageDirectory: "reports/coverage",
  setupFilesAfterEnv: [
    "./configs/jest.setup.js"
  ]
}
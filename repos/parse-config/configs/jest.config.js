const path = require('path')
process.env.APP_ROOT_PATH = require('path').join(__dirname, `../`)

module.exports = {
  rootDir: path.join(__dirname, '../'),
  testEnvironment: "node",
  //collectCoverage: true,
  verbose: true,
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {},
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.js?(x)",
  ],
  transformIgnorePatterns: [
    ".*"
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!**/__mocks__/**/*.{js}",
    "!**/index.js"
  ],
  coverageDirectory: "reports/coverage",
  setupFilesAfterEnv: []
}
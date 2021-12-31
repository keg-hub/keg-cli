const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '../'),
  testEnvironment: "node",
  globals: {
    __DEV__: true
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.js?(x)"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}"
  ],
  coveragePathIgnorePatterns: [
    "src/index.js"
  ],
  coverageDirectory: "reports/coverage",
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "es6"
  ]
}
module.exports = {
  testEnvironment: 'node',
  // Exit the test suite immediately upon the first failing test suite
  bail: true,
  // Each individual test should be reported during the run
  verbose: true,
  setupFilesAfterEnv: [
    'jest-extended'
  ],
  reporters: [
    'default',
    'jest-junit',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/.*/**'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.*/'
  ],
  testMatch: [
    '<rootDir>/tests/**'
  ],
  "globalSetup": "./tests/config/globalSetup.js",
  "globalTeardown": "./tests/config/globalTeardown.js"
};

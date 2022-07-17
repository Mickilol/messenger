module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(scss)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.ts"
  ],
};
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(scss)$': 'identity-obj-proxy',
    "^api(.*)$": "<rootDir>/src/api$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^core(.*)$": "<rootDir>/src/core$1",
    "^pages(.*)$": "<rootDir>/src/pages$1",
    "^services(.*)$": "<rootDir>/src/services$1",
    "^store(.*)$": "<rootDir>/src/store$1",
    "^styles(.*)$": "<rootDir>/src/styles$1",
    "^tests(.*)$": "<rootDir>/src/tests$1",
    "^utils(.*)$": "<rootDir>/src/utils$1"
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.ts"
  ],
};
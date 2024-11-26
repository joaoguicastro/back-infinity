export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
  };
  
import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testMatch: ['**/*.test.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  coverageProvider: 'v8',
  moduleFileExtensions: ['ts', 'js'],
};

export default config;

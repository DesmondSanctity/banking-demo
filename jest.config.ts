export default {
 preset: 'ts-jest/presets/default-esm',
 testEnvironment: 'node',
 extensionsToTreatAsEsm: ['.ts'],
 moduleNameMapper: {
  '^(\\.{1,2}/.*)\\.js$': '$1',
 },
 setupFilesAfterEnv: ['<rootDir>/bank-core/src/tests/setup.ts'],
 transform: {
  '^.+\\.ts$': ['ts-jest', { useESM: true }],
 },
};

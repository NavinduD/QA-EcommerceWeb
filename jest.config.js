export default {
  testRegex: 'src(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|js?)$',
  testPathIgnorePatterns: ['lib/', 'node_modules/'],
  testEnvironment: 'node',
  rootDir: 'src',
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
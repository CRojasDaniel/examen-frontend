// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/api/**/*.test.{js,ts}'
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
};

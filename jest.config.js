var path = require('path');

var cwd = process.cwd();

module.exports = {
  collectCoverageFrom: [
    'index.js'
  ],
  mapCoverage: true,
  moduleFileExtensions: [
    'js'
  ],
  rootDir: cwd,
  testMatch: [
    path.resolve(cwd, '__tests__/index.js')
  ],
  testEnvironment: 'node',
  testURL: 'http://localhost'
};

var babel = require('@babel/core');
var fs = require('fs');
var path = require('path');

function transformActual(type, useJson) {
  useJson = useJson || false;

  var dir = path.resolve(__dirname, 'fixtures', type);

  var options = useJson
    ? {extends: path.resolve(dir, 'config.json')}
    : require(path.resolve(dir, 'config.js'));

  var result = babel.transformFileSync(path.resolve(dir, 'actual.js'), options);

  return result.code.trim();
}

function getExpected(type) {
  return fs.readFileSync(
    path.resolve(__dirname, 'fixtures', type, 'expected.js'),
    'utf8'
  ).trim();
}

function createTest(type, useJson) {
  return function () {
    var actual = transformActual(type, useJson);
    var expected = getExpected(type);

    expect(actual).toEqual(expected);
  }
}

describe('Babel plugin: transform imports', function () {
  describe('basic', function () {
    it('should remove exports from d.ts files', createTest('default'));
    it('should remove export declaration with only d.ts specifiers completely', createTest('removeWholeExport'));
    it('should not remove export declaration by default if import is not from d.ts file', createTest('notDts'));
    it('should remove export * from d.ts file', createTest('exportAll'));
  });

  describe('configuration', function () {
    it('should remove import declaration and all export specifiers connected with source in config if only source'
      + 'is specified', createTest('configurationOnlySource'));
    it('should remove only specifiers specifier for source in config if source is specified with specifiers',
      createTest('configurationSpecifiers'));
    it('should not remove export declaration for d.ts file specifiers if "disableDefaultBehavior" is set',
      createTest('disableDefaultBehavior'));
  });

  it('should work properly with json configuration', createTest('json', true));
});

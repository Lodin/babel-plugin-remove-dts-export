module.exports = {
  plugins: [
    [require('../../../index.js'), {
      specifiersBySource: {
        '__tests__/fixtures/configurationSpecifiers/declaration.ts': ['AType', 'BType']
      }
    }]
  ]
};

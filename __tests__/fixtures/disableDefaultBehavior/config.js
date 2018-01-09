module.exports = {
  plugins: [
    [require('../../../index.js'), {
      disableDefaultBehavior: true,
      specifiersBySource: {
        '__tests__/fixtures/disableDefaultBehavior/declaration.ts': ['AType', 'BType']
      }
    }]
  ]
};

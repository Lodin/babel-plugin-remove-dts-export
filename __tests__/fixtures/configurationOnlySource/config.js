module.exports = {
  plugins: [
    [require('../../../index.js'), {
      sources: ['__tests__/fixtures/configurationOnlySource/declaration.ts']
    }]
  ]
};

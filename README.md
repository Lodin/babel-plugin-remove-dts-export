# babel-plugin-remove-dts-export
For now official [Babel](https://github.com/babel/babel) typescript plugin has a
[Babel#6065](https://github.com/babel/babel/issues/6065) issue that forbids re-exporting types from `d.ts` files. It
can cause a lot of problems connected with using types from d.ts files freely. This plugin is designed to be a 
kind of patch for this issue.

With default settings it checks every import in file processing right now and checks if the source is `d.ts` file. If
it's true, it remembers all specifiers you imported from `d.ts` file and removes them from all exports defined in
current file. Import declaration is removed as well. 

Also you can set up a configuration. You can disable default checks for source to be a `d.ts` file (to avoid penalty
of synchronous file system reading) and set specific sources or even custom specifiers for source you want to be
erased.

## Installation
```bash
$ npm install --save-dev babel-plugin-remove-dts-export
```

## Configuration
Default behavior (checking every imports to be a `d.ts` file)([original](./__tests__/fixtures/default/actual.js),
[compiled](./__tests__/fixtures/default/expected.js)):
```json
{
  "plugins": [
    "babel-plugin-remove-dts-export"
  ]
}
```
Remove import declaration and all imported specifiers from all exports declared in a file
([original](./__tests__/fixtures/configurationOnlySource/actual.js),
[compiled](./__tests__/fixtures/configurationOnlySource/expected.js)):
```json
{
  "plugins": [
    ["babel-plugin-remove-dts-export", {
      "sources": [
        "path/to/declaration/from/cwd.d.ts",
        "path/to/declaration/from/cwd2.d.ts"
      ]
    }]
  ]
}
```
Remove only specific specifiers from all exports declared in a file
([original](./__tests__/fixtures/configurationSpecifiers/actual.js),
[compiled](./__tests__/fixtures/configurationSpecifiers/expected.js)): 
```json
{
  "plugins": [
    ["babel-plugin-remove-dts-export", {
      "specifiersBySource": {
        "path/to/declaration/from/cwd.ts": ["A", "B"]
      }
    }]
  ]
}
```
Disable checking all imports to be `d.ts` files (following configuration will disable plugin completely!):
```json
{
  "plugins": [
    ["babel-plugin-remove-dts-export", {
      "disableDefaultBehavior": true
    }]
  ]
}
```
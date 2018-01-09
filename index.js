'use strict';

var fs = require('fs');
var p = require('path');
var t = require('@babel/types');

var cwd = process.cwd();

function computeSourcePath(source, importer) {
  if (source.indexOf('./') === -1) {
    return require.resolve(p.resolve(cwd, 'node_modules', source));
  }

  var path = p.resolve(p.dirname(importer), source);
  var dir = p.dirname(path);
  var filePattern = new RegExp(p.basename(path));

  var files = fs.readdirSync(dir);

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    if (filePattern.test(file)) {
      return p.resolve(dir, file);
    }
  }

  return null;
}

function processSources(path, state) {
  var sourcePath = computeSourcePath(path.node.source.value, this.importer);

  for (var i = 0; i < state.opts.sources.length; i++) {
    var source = state.opts.sources[i];

    if (sourcePath === p.resolve(cwd, source)) {
      this.exportSpecifiersToRemove = this.exportSpecifiersToRemove.concat(
        path.node.specifiers.map(function (specifier) {
          return specifier.local.name;
        })
      );

      path.remove();
      return true;
    }
  }

  return false
}

function processSpecifiersBySource(path, state, isExport) {
  var sourcePath = computeSourcePath(path.node.source.value, this.importer);

  for (var optionSource in state.opts.specifiersBySource) {
    var specifiers = state.opts.specifiersBySource[optionSource];

    if (sourcePath === p.resolve(cwd, optionSource)) {
      this.exportSpecifiersToRemove =
        this.exportSpecifiersToRemove.concat(specifiers);

      if (!isExport) {
        this.importSpecifiersToRemove =
          this.importSpecifiersToRemove.concat(specifiers);
      }
    }
  }
}

function processOptions(path, state, isExport) {
  isExport = isExport || false;

  if (state.opts) {
    if (state.opts.sources) {
      if (processSources.call(this, path, state)) {
        return true;
      }
    }

    if (state.opts.specifiersBySource) {
      processSpecifiersBySource.call(this, path, state, isExport);
    }

    return state.opts.disableDefaultBehavior;
  }

  return false;
}

var dtsPattern = /\.d\.ts/;

module.exports = function () {
  return {
    pre: function pre(state) {
      this.exportSpecifiersToRemove = [];
      this.importSpecifiersToRemove = [];
      this.importer = p.resolve(cwd, state.opts.filename);
      this.processOptions = processOptions.bind(this);
    },

    visitor: {
      ImportDeclaration: function ImportDeclaration(path, state) {
        if (this.processOptions(path, state)) {
          return;
        }

        var file = computeSourcePath(path.node.source.value, this.importer);

        if (!dtsPattern.test(file)) {
          return;
        }

        this.exportSpecifiersToRemove = this.exportSpecifiersToRemove.concat(
          path.node.specifiers.map(function (specifier) {
            return specifier.local.name;
          })
        );

        path.remove();
      },

      ImportSpecifier: function ImportSpecifier(path) {
        if (this.importSpecifiersToRemove.indexOf(path.node.local.name) !== -1) {
          path.remove();
        }
      },

      ExportDeclaration: {
        enter: function ExportDeclarationEnter(path, state) {
          if (!path.node.source) {
            return;
          }

          if (this.processOptions(path, state, true)) {
            return;
          }

          var file = computeSourcePath(path.node.source.value, this.importer);

          if (dtsPattern.test(file)) {
            path.remove();
          }
        },
        exit: function ExportDeclarationExit(path) {
          if (path.node.specifiers.length === 0 && path.node.declaration === null) {
            path.remove();
          }
        }
      },

      ExportSpecifier: function ExportSpecifier(path) {
        if (this.exportSpecifiersToRemove.indexOf(path.node.local.name) !== -1) {
          path.remove();
        }
      }
    }
  };
};

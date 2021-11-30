/* eslint-disable */
export default function wrapListener(listener, name, options?: any) {
  return function detective(babel) {
    // Babel 6
    return {
      visitor: {
        ImportDeclaration: function (path, state) {
          return visitImportDeclaration(path, state.file, state.opts);
        },
        CallExpression: function (path, state) {
          return visitCallExpression(path, state.file, state.opts);
        },
        ExportNamedDeclaration: function (path, state) {
          return visitExportDeclaration(path, state.file, state.opts);
        },
        ExportAllDeclaration: function (path, state) {
          return visitExportDeclaration(path, state.file, state.opts);
        },
      },
    };
  };

  function visitExportDeclaration(path, file, opts) {
    if (includeExports(opts) && path.get('source').node) {
      listener(path.get('source'), file, opts);
    }
  }

  function visitImportDeclaration(path, file, opts) {
    if (includeImports(opts)) {
      listener(path.get('source'), file, opts);
    }
  }

  function visitCallExpression(path, file, opts) {
    if (!includeRequire(opts)) {
      return;
    }

    var callee = path.get('callee');

    if (callee.isIdentifier() && callee.node.name === word(opts)) {
      var arg = path.get('arguments.0');

      if (arg && (!arg.isGenerated() || includeGenerated(opts))) {
        listener(arg, file, opts);
      }
    }
  }

  // OPTION EXTRACTION:

  function word(opts) {
    opts = options || opts;
    return (opts && opts.word) || 'require';
  }

  function includeGenerated(opts) {
    opts = options || opts;
    return Boolean(opts && opts.generated);
  }

  function includeImports(opts) {
    opts = options || opts;
    return (!opts || opts.import) !== false;
  }

  function includeExports(opts) {
    opts = options || opts;
    return (!opts || opts.export) !== false;
  }

  function includeRequire(opts) {
    opts = options || opts;
    return (!opts || opts.require) !== false;
  }
}

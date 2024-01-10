/**
 * Rename import() -> $csbImport()
 */
export default function () {
  return {
    name: 'babel-plugin-csb-rename-import', // not required
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('dynamicImport');
    },
    visitor: {
      CallExpression(path) {
        if (path.node.callee.type === 'Import') {
          path.node.callee = { type: 'Identifier', name: '$csbImport' };
        }
      },
    },
  };
}

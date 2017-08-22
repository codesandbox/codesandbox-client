import traverse from 'babel-traverse';

export default function getRequireStatements(ast) {
  const dependencies = [];

  traverse(ast, {
    enter(path) {
      if (
        path.node.type === 'CallExpression' &&
        path.node.callee.name === 'require' &&
        path.node.arguments[0]
      ) {
        if (path.node.arguments[0].type === 'StringLiteral') {
          dependencies.push({
            type: 'direct',
            path: path.node.arguments[0].value,
          });
          // Dynamic require
        } else if (path.node.arguments[0].type === 'BinaryExpression') {
          // Sometimes these require statements get converted to
          // `require('' + ('./' + undefined.props.type))`;
          // We need to check for these wild beasts
          if (path.node.arguments[0].right.type === 'BinaryExpression') {
            if (path.node.arguments[0].right.left.type === 'StringLiteral') {
              dependencies.push({
                type: 'glob',
                path: path.node.arguments[0].right.left.value,
              });
            }
          } else if (path.node.arguments[0].left.type === 'StringLiteral') {
            dependencies.push({
              type: 'glob',
              path: path.node.arguments[0].left.value,
            });
          }
        }
      }
    },
  });

  return dependencies;
}

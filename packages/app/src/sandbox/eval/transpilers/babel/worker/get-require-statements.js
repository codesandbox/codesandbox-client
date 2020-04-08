export default function getRequireStatements(metadata) {
  if (!metadata) return [];

  const res = {};

  if (metadata.strings) {
    metadata.strings.forEach(s => {
      res[s.value] = 'direct';
    });
  }
  if (metadata.expressions) {
    metadata.expressions.forEach(s => {
      if (s.type === 'BinaryExpression') {
        res[s.left.value] = 'glob';
      } else if (s.type === 'TemplateLiteral') {
        res[s.quasis[0].value.raw] = 'glob';
      } else if (
        s.type === 'CallExpression' &&
        s.callee.type === 'MemberExpression' &&
        s.callee.property.type === 'Identifier' &&
        s.callee.property.name === 'concat' &&
        s.arguments &&
        s.arguments[0] &&
        s.arguments[0].left &&
        s.arguments[0].left.type === 'BinaryExpression' &&
        s.arguments[0].left.left.type === 'StringLiteral'
      ) {
        // require("".concat('./assets/' + ... + '.js');
        res[s.arguments[0].left.left.value] = 'glob';
      }
    });
  }

  const total = [];
  const paths = Object.keys(res);
  for (let i = 0; i < paths.length; i += 1) {
    total.push({ path: paths[i], type: res[paths[i]] });
  }

  return total;
}

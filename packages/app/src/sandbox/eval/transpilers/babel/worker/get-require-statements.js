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

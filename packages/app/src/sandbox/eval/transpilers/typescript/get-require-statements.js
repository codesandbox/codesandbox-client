export default function getRequireStatements(sourceFile, ts) {
  const requires = [];

  function findRequire(node) {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration: {
        requires.push({ type: 'direct', path: node.moduleSpecifier.text });
        break;
      }
      case ts.SyntaxKind.ExportDeclaration: {
        // For syntax 'export ... from '...'''
        if (node.moduleSpecifier) {
          requires.push({ type: 'direct', path: node.moduleSpecifier.text });
        }
        break;
      }
      case ts.SyntaxKind.CallExpression: {
        if (
          node.expression.text === 'require' &&
          node.arguments.length &&
          node.arguments[0].kind === ts.SyntaxKind.StringLiteral
        ) {
          requires.push({ type: 'direct', path: node.arguments[0].text });
        }

        if (
          node.expression.text === 'require' &&
          node.arguments.length &&
          node.arguments[0].kind === ts.SyntaxKind.BinaryExpression &&
          node.arguments[0].left.kind === ts.SyntaxKind.StringLiteral
        ) {
          requires.push({ type: 'glob', path: node.arguments[0].left.text });
        }

        if (
          node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments.length &&
          node.arguments[0].text
        ) {
          requires.push({ type: 'direct', path: node.arguments[0].text });
        }

        if (
          node.expression.text === 'require' &&
          node.arguments.length &&
          node.arguments[0].kind === ts.SyntaxKind.TemplateExpression &&
          node.arguments[0].head.kind === ts.SyntaxKind.TemplateHead
        ) {
          requires.push({
            type: 'glob',
            path: node.arguments[0].head.text,
          });
        }

        if (
          node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments.length &&
          node.arguments[0].kind === ts.SyntaxKind.TemplateExpression &&
          node.arguments[0].head.kind === ts.SyntaxKind.TemplateHead
        ) {
          requires.push({ type: 'glob', path: node.arguments[0].head.text });
        }

        if (
          node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments.length &&
          node.arguments[0].kind === ts.SyntaxKind.BinaryExpression &&
          node.arguments[0].left.kind === ts.SyntaxKind.StringLiteral
        ) {
          requires.push({ type: 'glob', path: node.arguments[0].left.text });
        }
        break;
      }
      default: {
        /* */
      }
    }
    ts.forEachChild(node, findRequire);
  }

  ts.forEachChild(sourceFile, findRequire);
  return requires;
}

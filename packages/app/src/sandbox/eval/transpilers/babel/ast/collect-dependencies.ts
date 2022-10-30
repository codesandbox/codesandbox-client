import { walk } from 'estree-walker';

import { ESTreeAST } from './utils';
import { Syntax as n } from './syntax';

export function collectDependenciesFromAST(ast: ESTreeAST): Array<string> {
  const deps: Set<string> = new Set();
  walk(ast.program, {
    enter(node) {
      // @ts-ignore
      if (node.type === n.CallExpression && node.callee.name === 'require') {
        // @ts-ignore
        if (node.arguments.length && node.arguments[0].value) {
          // @ts-ignore
          deps.add(node.arguments[0].value);
        }

        this.skip();
      }
    },
  });
  return Array.from(deps);
}

import { ESTree } from 'meriyah';
import { walk } from 'estree-walker';

interface Dependency {
  type: string;
  path: string;
  isGlob?: boolean;
}

export function collectDependencies(ast: ESTree.Program): Array<Dependency> {
  const deps: Array<Dependency> = [];
  walk(ast, {
    enter(node) {
      // @ts-ignore
      if (node.type === 'CallExpression' && node.callee.name === 'require') {
        // @ts-ignore
        if (node.arguments.length && node.arguments[0].value) {
          deps.push({
            type: 'direct',
            // @ts-ignore
            path: node.arguments[0].value,
          });
        }

        this.skip();
      }
    },
  });
  return deps;
}

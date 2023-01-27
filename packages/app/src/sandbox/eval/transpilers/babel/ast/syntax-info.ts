import { walk } from 'estree-walker';
import isESModule from 'sandbox/eval/utils/is-es-module';
import { Syntax as n } from './syntax';
import { ESTreeAST } from './utils';

const ESM_TYPES: Set<string> = new Set([
  n.ImportDeclaration,
  n.ExportAllDeclaration,
  n.ExportDefaultDeclaration,
  n.ExportNamedDeclaration,
  n.ExportSpecifier,
]);

export interface SyntaxInfo {
  jsx: boolean;
  esm: boolean;
  dynamicImports: boolean;
}

export function getSyntaxInfoFromAst(ast: ESTreeAST): SyntaxInfo {
  const syntaxInfo: SyntaxInfo = {
    jsx: false,
    esm: false,
    dynamicImports: false,
  };

  walk(ast.program, {
    enter(node) {
      // TODO: Figure out if we can exit the walk entirely
      // Just skip everything if we already know it's esm and jsx
      if (syntaxInfo.jsx && syntaxInfo.esm && syntaxInfo.dynamicImports) {
        this.skip();
        return;
      }

      if (ESM_TYPES.has(node.type)) {
        syntaxInfo.esm = true;
        // Imports cannot contain JSX
        if (node.type === n.ImportDeclaration) {
          this.skip();
        }
        return;
      }

      if (node.type === n.JSXElement) {
        syntaxInfo.jsx = true;
        this.skip();
      }

      if (node.type === n.ImportExpression) {
        syntaxInfo.dynamicImports = true;
        this.skip();
      }
    },
  });

  return syntaxInfo;
}

const JSXSyntax = /\n(.*?)<[A-z](.|\n)*?\/?>/;

function checkComment(match: string[]) {
  const startOfLine = match[1];

  // If it's in a comment or string, we're extremely aggressive here because
  // transpiling is absolutely our last resort.
  if (
    startOfLine.indexOf('//') > -1 ||
    startOfLine.indexOf('*') > -1 ||
    startOfLine.indexOf("'") > -1 ||
    startOfLine.indexOf('"') > -1 ||
    startOfLine.indexOf('`') > -1
  ) {
    return false;
  }

  return true;
}

export function getSyntaxInfoFromCode(code: string, path: string): SyntaxInfo {
  // Use getters so we can evaluate lazily
  const syntax: SyntaxInfo = {
    get jsx() {
      const jsxMatch = code.match(JSXSyntax);

      return jsxMatch && checkComment(jsxMatch);
    },
    get esm() {
      return isESModule(code);
    },
    get dynamicImports() {
      return code.includes('import(')
    }
  };

  if (path.endsWith('.min.js')) {
    // This needs no transpiling and often fools our JSX check with <a etc...
    return {
      jsx: false,
      esm: false,
      dynamicImports: false,
    };
  }

  return syntax;
}

import { walk } from 'estree-walker';
import { Program } from 'meriyah/dist/estree';
import isESModule from 'sandbox/eval/utils/is-es-module';
import { Syntax as n } from './convert-esmodule/syntax';

export interface SyntaxInfo {
  jsx: boolean;
  esm: boolean;
}

export function getSyntaxInfoFromAst(program: Program): SyntaxInfo {
  const syntaxInfo: SyntaxInfo = { jsx: false, esm: false };
  walk(program, {
    enter(node) {
      const esmTypes: string[] = [
        n.ImportDeclaration,
        n.ExportAllDeclaration,
        n.ExportDefaultDeclaration,
        n.ExportNamedDeclaration,
        n.ExportSpecifier,
      ];
      if (esmTypes.includes(node.type)) {
        syntaxInfo.esm = true;
        this.skip();
      }

      if (node.type === n.JSXElement) {
        syntaxInfo.jsx = true;
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
  };

  if (path.endsWith('.min.js')) {
    // This needs no transpiling and often fools our JSX check with <a etc...
    return {
      jsx: false,
      esm: false,
    };
  }

  return syntax;
}

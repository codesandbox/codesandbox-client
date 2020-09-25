import { walk } from 'estree-walker';
import { Program } from 'meriyah/dist/estree';
import { Syntax as n } from './convert-esmodule/syntax';

export interface SyntaxInfo {
  jsx: boolean;
}

export function getSyntaxInfoFromAst(program: Program): SyntaxInfo {
  const syntaxInfo: SyntaxInfo = { jsx: false };
  walk(program, {
    enter(node) {
      if (syntaxInfo.jsx) {
        // We already know enough
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
  let syntax: SyntaxInfo = {
    jsx: false,
  };
  if (path.endsWith('.min.js')) {
    // This needs no transpiling and often fools our JSX check with <a etc...
    return syntax;
  }

  const jsxMatch = code.match(JSXSyntax);
  if (jsxMatch) {
    syntax.jsx = checkComment(jsxMatch);
  }

  return syntax;
}

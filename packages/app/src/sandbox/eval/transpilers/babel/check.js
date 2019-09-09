import isESModule from '../../utils/is-es-module';

const JSXSyntax = /\n(.*?)<[A-z](.|\n)*?\/?>/;
const regeneratorSyntax = /\n(.*?)(\s|^)regeneratorRuntime\./;

function checkComment(match) {
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

export function shouldTranspile(code: string, path: string) {
  if (isESModule(code)) {
    return true;
  }

  if (path.endsWith('.min.js')) {
    // This needs no transpiling and often fools our JSX check with <a etc...
    return false;
  }

  const jsxMatch = code.match(JSXSyntax);
  if (jsxMatch) {
    return checkComment(jsxMatch);
  }

  const regeneratorMatch = code.match(regeneratorSyntax);
  if (regeneratorMatch) {
    return checkComment(regeneratorMatch);
  }

  return false;
}

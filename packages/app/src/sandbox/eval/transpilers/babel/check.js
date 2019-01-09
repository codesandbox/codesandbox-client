import isESModule from '../../utils/is-es-module';

const JSXSyntax = /\n(.*?)<[A-z](.|\n)*?\/?>/;

export function shouldTranspile(code: string, path: string) {
  if (isESModule(code)) {
    return true;
  }

  const match = code.match(JSXSyntax);
  if (match) {
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
  return false;
}

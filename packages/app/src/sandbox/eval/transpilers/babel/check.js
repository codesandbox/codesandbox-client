import isESModule from '../../utils/is-es-module';

const JSXSyntax = /<\w(.|\n)*\/?>/;

export function shouldTranspile(code: string, path: string) {
  return isESModule(code) || JSXSyntax.test(code);
}

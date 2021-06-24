import { getSyntaxInfoFromCode } from './ast/syntax-info';

export function shouldTranspile(code: string, path: string) {
  const syntaxInformation = getSyntaxInfoFromCode(code, path);
  return syntaxInformation.esm || syntaxInformation.jsx;
}

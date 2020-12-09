import { getSyntaxInfoFromCode } from './syntax-info';

export function shouldTranspile(code: string, path: string) {
  const syntaxInformation = getSyntaxInfoFromCode(code, path);
  if (syntaxInformation.esm) {
    return true;
  }

  return syntaxInformation.jsx;
}

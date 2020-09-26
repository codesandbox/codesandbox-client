import isESModule from '../../utils/is-es-module';
import { getSyntaxInfoFromCode } from './syntax-info';

export function shouldTranspile(code: string, path: string) {
  if (isESModule(code)) {
    return true;
  }

  return getSyntaxInfoFromCode(code, path).jsx === true;
}

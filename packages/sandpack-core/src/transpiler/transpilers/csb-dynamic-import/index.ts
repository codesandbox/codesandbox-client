import { Transpiler, TranspilerResult } from '../..';
import { LoaderContext } from '../../../transpiled-module';
import { convertDynamicImport } from './dynamic-import';

/**
 * This transpiler is run after all modules, to enable specific CodeSandbox features
 *
 * @class CodeSandbox
 * @extends {Transpiler}
 */
class CodeSandboxDynamicImports extends Transpiler {
  constructor() {
    super('codesandbox-dynamic-imports-loader');
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): TranspilerResult {
    const newCode = convertDynamicImport(code);
    return { transpiledCode: newCode };
  }
}

const transpiler = new CodeSandboxDynamicImports();

export { CodeSandboxDynamicImports };

export default transpiler;

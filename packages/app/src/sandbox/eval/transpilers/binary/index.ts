import { LoaderContext, Transpiler, TranspilerResult } from 'sandpack-core';

/**
 * Just fetches a file from the interwebs and converts it to a blob
 *
 * @class BinaryTranspiler
 * @extends {Transpiler}
 */
class BinaryTranspiler extends Transpiler {
  constructor() {
    super('binary-loader');
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    return fetch(code)
      .then(res => res.blob())
      .then(blob => ({ transpiledCode: blob }));
  }
}

const transpiler = new BinaryTranspiler();

export { BinaryTranspiler };

export default transpiler;

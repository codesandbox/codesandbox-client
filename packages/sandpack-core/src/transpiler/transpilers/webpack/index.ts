import { LoaderContext } from '../../../transpiled-module';
import { IEvaluator } from '../../../evaluator';

import { Transpiler, TranspilerResult } from '../..';

/**
 * This is a compatibility loader that acts as bridge between webpack loaders and sandpack
 * transpilers. It's a best effort on making webpack loaders work dynamically in Sandpack.
 */
export class WebpackTranspiler extends Transpiler {
  private webpackLoader: Promise<{
    raw?: boolean;
    (code: string | Buffer): string;
  }>;

  constructor(webpackLoader: string, evaluator: IEvaluator) {
    super(webpackLoader);

    this.webpackLoader = evaluator.evaluate(webpackLoader);
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    const loader = await this.webpackLoader;

    const asyncFunc = () => (err: Error | null, result: string) => {
      if (err) {
        throw err;
      }

      return result;
    };

    // Todo; this whole conversion from http strings to buffers should be done on the CodeSandbox
    // side in a pre-transpiler. Ideally code like this should be unaware of the implementation
    // details of http strings, and just work with buffers instead.
    const codeIsHttp = code.startsWith('http');
    const webpackCode = codeIsHttp
      ? await fetch(loaderContext._module.module.code)
          .then(x => x.arrayBuffer())
          .then(buffer => Buffer.from(buffer))
      : Buffer.from(code);

    const webpackLoaderContext = { ...loaderContext, async: asyncFunc };

    const webpackResult = await loader.apply(webpackLoaderContext, [
      loader.raw ? webpackCode : webpackCode.toString('utf-8'),
    ]);

    return {
      transpiledCode: webpackResult,
    };
  }
}

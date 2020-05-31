import { LoaderContext } from 'sandbox/eval/transpiled-module';
import { IEvaluator } from 'sandbox/eval/evaluator';

import Transpiler, { TranspilerResult } from '..';

/**
 * This is a compatibility loader that acts as bridge between webpack loaders and sandpack
 * transpilers. It's a best effort on making webpack loaders work dynamically in Sandpack.
 */
export class WebpackTranspiler extends Transpiler {
  private webpackLoader: Promise<(code: string) => string>;
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

    const webpackLoaderContext = { ...loaderContext, async: asyncFunc };

    const webpackResult = await loader.apply(webpackLoaderContext, [code]);

    return {
      transpiledCode: webpackResult,
    };
  }
}

// @flow
// eslint-disable-next-line
import HTMLWorker from 'worker-loader?publicPath=/&name=parcel-html-transpiler.[hash:8].worker.js!./html-worker';
import type { LoaderContext } from '../../../transpiled-module';
import WorkerTranspiler from '../../../transpilers/worker-transpiler';

class HTMLTranspiler extends WorkerTranspiler {
  constructor() {
    super('html-loader', HTMLWorker, 1);

    this.HMREnabled = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext): Promise<null> {
    return new Promise((resolve, reject) => {
      this.queueTask(
        {
          code,
        },
        loaderContext._module.getId(),
        loaderContext,
        (err, data) => {
          if (err) {
            loaderContext.emitError(err);

            return reject(err);
          }

          return resolve(data);
        }
      );
    });
  }
}

const transpiler = new HTMLTranspiler();

export { HTMLTranspiler };

export default transpiler;

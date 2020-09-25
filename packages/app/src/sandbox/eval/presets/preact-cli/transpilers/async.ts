import { NoopTranspiler } from '../../../transpilers/noop';

/**
 * This transpiler actually does nothing but return the code that was given,
 * this happens since our code is already in the browser, we don't need to
 * dynamically load it
 *
 * @class AsyncTranspiler
 * @extends {NoopTranspiler}
 */
class AsyncTranspiler extends NoopTranspiler {
  constructor() {
    super();

    this.name = 'async';
  }
}

const transpiler = new AsyncTranspiler();

export { AsyncTranspiler };

export default transpiler;

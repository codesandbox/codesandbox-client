/* eslint-disable no-extend-native, no-useless-computed-key */
const getFileName = () => '/index.js';
const stackSplit = { getFileName };

let hasStack = false;

function checkHasStack() {
  if (hasStack) {
    return;
  }

  const origPrepareStackTrace = Error.prepareStackTrace;

  // eslint-disable-next-line
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };

  const stack = new Error().stack;
  Error.prepareStackTrace = origPrepareStackTrace;

  // @ts-ignore
  hasStack = typeof stack[0].getFileName === 'function';
}

checkHasStack();

class NewError extends Error {
  constructor(n: string) {
    super(n);

    // @ts-ignore
    this.stack = {
      [2]: stackSplit,
      split() {
        return [stackSplit, stackSplit, stackSplit, stackSplit];
      },
      replace() {
        return '';
      },
    };
  }
}

/**
 * Babel expects to be able to do this:
 *
 * ```js
 * const error = new Error();
 * const fileName = error.stack.split()[2].getFileName();
 * ```
 *
 * This works, but only in the V8 engine, so Firefox and Safari will break.
 * This function will hardcode the functionality.
 */
export function installErrorMock() {
  if (!hasStack) {
    // @ts-ignore
    self.Error = NewError;

    hasStack = true;
  }
}

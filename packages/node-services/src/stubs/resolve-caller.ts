function stripURLAndLine(s: string) {
  return s.replace(/.*\.(\w{2}|\w{3})\//, '').replace(/:.*/, '');
}

/**
 * Gets the file that called the resolve, resolve calls this. It's literally
 *
 * ```js
 * module.exports = function () {
 *     // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
 *     var origPrepareStackTrace = Error.prepareStackTrace;
 *     Error.prepareStackTrace = function (_, stack) { return stack; };
 *     var stack = (new Error()).stack;
 *     Error.prepareStackTrace = origPrepareStackTrace;
 *     return stack[2].getFileName();
 * };
 * ```
 *
 * from https://unpkg.com/resolve@1.10.0/lib/caller.js
 *
 * but it's made to work in Firefox too  (doesn't have prepareStackTrace sadly)
 */
export function getCaller() {
  const stack = new Error().stack;
  if (stack) {
    const stacks = stack.split('\n');

    return '/' + stripURLAndLine(stacks[3]);
  } else {
    return '';
  }
}

export function getCallSites() {
  const stack = new Error().stack;
  if (stack) {
    const stacks = stack.split('\n');

    stacks.shift();

    return stacks.map(s => {
      const filename = stripURLAndLine(s);

      return {
        getFileName() {
          return filename;
        },
      };
    });
  } else {
    return [];
  }
}

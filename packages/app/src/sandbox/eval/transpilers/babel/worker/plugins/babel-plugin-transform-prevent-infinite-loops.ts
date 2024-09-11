/* eslint-disable */
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * Copyright (c) 2017, Amjad Masad
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Based on https://repl.it/site/blog/infinite-loops.

const MAX_ITERATIONS = 100001;

export default function infiniteLoopDetector({ types: t, template }) {
  // We set a global so that we can later fail the test
  // even if the error ends up being caught by the code.
  const buildGuard = template(`
  if (ITERATOR++ > MAX_ITERATIONS) {
    var csb_global = typeof window === 'undefined' ? self : window;
    csb_global.infiniteLoopError = new RangeError(
      'Potential infinite loop: exceeded ' +
      MAX_ITERATIONS +
      ' iterations. You can disable this check by creating a sandbox.config.json file.'
    );
    throw csb_global.infiniteLoopError;
  }
  `);

  return {
    visitor: {
      'WhileStatement|ForStatement|DoWhileStatement': (path, file) => {
        // An iterator that is incremented with each iteration
        const iterator = path.scope.parent.generateUidIdentifier('loopIt');
        const iteratorInit = t.numericLiteral(0);
        path.scope.parent.push({
          id: iterator,
          init: iteratorInit,
        });
        // If statement and throw error if it matches our criteria
        const guard = buildGuard({
          ITERATOR: iterator,
          MAX_ITERATIONS: t.numericLiteral(MAX_ITERATIONS),
        });
        // No block statment e.g. `while (1) 1;`
        if (!path.get('body').isBlockStatement()) {
          const statement = path.get('body').node;
          path.get('body').replaceWith(t.blockStatement([guard, statement]));
        } else {
          path.get('body').unshiftContainer('body', guard);
        }
      },
    },
  };
}

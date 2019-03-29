'use strict';

//
// Order of Levels used in these tests.
// Remark (indexzero): is abstracting this into a helper
// useful in `abstract-winston-transport`?
//
const testOrder = exports.testOrder = [
  'error',
  'warn',
  'dog',
  'cat',
  'info',
  'verbose',
  'silly',
  'parrot'
];

//
// Actual `testLevels` in the format expected by `winston`.
//
exports.testLevels = testOrder.reduce((acc, level, i) => {
  acc[level] = i;
  return acc;
}, {});

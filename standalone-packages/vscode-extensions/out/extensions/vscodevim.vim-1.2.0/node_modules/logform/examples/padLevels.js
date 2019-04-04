const { format } = require('../');
const { combine, padLevels, simple } = format;

const { MESSAGE } = require('triple-beam');

const paddedFormat = combine(
  padLevels({
    // Uncomment for a custom filler for the padding, defaults to ' '.
    // filler: 'foo',
    // Levels has to be defined, same as `winston.createLoggers({ levels })`.
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      verbose: 4,
      debug: 5,
      silly: 6
    }
  }),
  simple()
);

const info = paddedFormat.transform({
  level: 'info',
  message: 'This is an info level message.'
});
const error = paddedFormat.transform({
  level: 'error',
  message: 'This is an error level message.'
});
const verbose = paddedFormat.transform({
  level: 'verbose',
  message: 'This is a verbose level message.'
});

console.dir(info[MESSAGE]);
console.dir(error[MESSAGE]);
console.dir(verbose[MESSAGE]);

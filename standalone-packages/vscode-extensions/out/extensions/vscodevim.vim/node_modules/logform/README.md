# logform

An mutable object-based log format designed for chaining & objectMode streams.

``` js
const { format } = require('logform');

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
```

- [`info` Objects](#info-objects)
- [Understanding formats](#understanding-formats)
  - [Combining formats](#combining-formats)
  - [Filtering `info` objects](#filtering-info-objects)

## `info` Objects

The `info` parameter provided to a given format represents a single log message. The object itself is mutable. Every `info` must have at least the `level` and `message` properties:

``` js
{
  level: 'info',                 // Level of the logging message  
  message: 'Hey! Log something?' // Descriptive message being logged.
}
```

`logform` itself exposes several additional properties:

- `splat`: string interpolation splat for `%d %s`-style messages.
- `timestamp`: timestamp the message was received.
- `label`: custom label associated with each message.

As a consumer you may add whatever properties you wish – _internal state is maintained by `Symbol` properties:_

- `Symbol.for('level')` _**(READ-ONLY)**:_ equal to `level` property. Is treated as immutable by all code.
- `Symbol.for('message'):` complete string message set by "finalizing formats": `json`, `logstash`, `printf`, `prettyPrint`, and `simple`. 

## Understanding formats

Formats are prototypal objects (i.e. class instances) that define a single method: `transform(info, opts)` and return the mutated `info`

- `info`: an object representing the log message.
- `opts`: setting specific to the current instance of the format.

They are expected to return one of two things:

- **An `info` Object** representing the modified `info` argument. Object references need not be preserved if immutability is preferred. All current built-in formats consider `info` mutable, but [immutablejs] is being considered for future releases.
- **A falsey value** indicating that the `info` argument should be ignored by the caller. (See: [Filtering `info` Objects](#filtering-info-objects)) below.

`logform.format`  is designed to be as simple as possible. To define a new format simple pass it a `transform(info, opts)` function to get a new `Format`. 

The named `Format` returned can be used to create as many copies of the given `Format` as desired:

``` js
const { format } = require('logform');

const volume = format((info, opts) => {
  if (opts.yell) {
    info.message = info.message.toUpperCase(); 
  } else if (opts.whisper) {
    info.message = info.message.toLowerCase();
  }

  return info;
});

// `volume` is now a function that returns instances of the format.
const scream = volume({ yell: true });
console.dir(scream.transform({
  level: 'info',
  message: `sorry for making you YELL in your head!`
}, scream.options));
// {
//   level: 'info'
//   message: 'SORRY FOR MAKING YOU YELL IN YOUR HEAD!'
// }

// `volume` can be used multiple times to create different formats.
const whisper = volume({ whisper: true });
console.dir(whisper.transform({ 
  level: 'info', 
  message: `WHY ARE THEY MAKING US YELL SO MUCH!` 
}), whisper.options);
// {
//   level: 'info'
//   message: 'why are they making us yell so much!'
// }
```

### Combining formats

Any number of formats may be combined into a single format using `format.combine`. Since `format.combine` takes no `opts`, as a convenience it returns pre-created instance of the combined format.

``` js
const { format } = require('logform');
const { combine, timestamp, label } = format;

const labelTimestamp = combine(
  label({ label: 'right meow!' }),
  timestamp()
);

const info = labelTimestamp.transform({
  level: 'info',
  message: 'What time is the testing at?'
});

console.dir(info);
// { level: 'info',
//   message: 'What time is the testing at?',
//   label: 'right meow!',
//   timestamp: '2017-09-30T03:57:26.875Z' }
```

### Filtering `info` Objects

If you wish to filter out a given `info` Object completely then simply return a falsey value.

``` js
const ignorePrivate = format((info, opts) => {
  if (info.private) { return false; }
  return info;
});

console.dir(ignorePrivate.transform({
  level: 'error',
  message: 'Public error to share'
}));
// { level: 'error', message: 'Public error to share' }

console.dir(ignorePrivate.transform({
  level: 'error',
  private: true,
  message: 'This is super secret - hide it.'
}));
// false
```

Use of `format.combine` will respect any falsey values return and stop evaluation of later formats in the series. For example:

``` js
const { format } = require('logform');
const { combine, timestamp, label } = format;

const willNeverThrow = format.combine(
  format(info => { return false })(), // Ignores everything
  format(info => { throw new Error('Never reached') })()
);

console.dir(willNeverThrow.transform({
  level: 'info',
  message: 'wow such testing'
}))
```

## Tests

Tests are written with `mocha`, `assume`, and `nyc`. They can be run with `npm`:

```
npm test
```

##### LICENSE: MIT
##### AUTHOR: [Charlie Robbins](https://github.com/indexzero)

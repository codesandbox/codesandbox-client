[![NPM version](https://badge.fury.io/js/winston-console-for-electron.svg)](https://badge.fury.io/js/winston-console-for-electron)

# winston-console-for-electron

A modified version of Winston's [Console Transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport) to support Electron applications. Created mainly for use in [VSCodeVim](https://github.com/vscodevim/vim), an extension for VSCode, but it's generic enough to be used for other Electron applications.

## Installation

```
npm i --save winston-console-for-electron
```

## Usage

* Requires winston > 3.0

```
import * as winston from 'winston';
import { ConsoleForElectron } from 'winston-console-for-electron';

let logger = winston.createLogger({
  transports: [new ConsoleForElectron()],
});
```

## Options

* __level:__ Level of messages that this transport should log (default 'info').
* __silent:__ Boolean flag indicating whether to suppress output (default false).
* __colorize:__ Boolean flag indicating if we should colorize output (default false).
* __timestamp:__ Boolean flag indicating if we should prepend output with timestamps (default false). If function is specified, its return value will be used instead of timestamps.
* __json:__ Boolean flag indicating whether or not the output should be JSON. If true, will log out multi-line JSON objects. (default false)
* __stringify:__ Boolean flag indiciating if the output should be passed through JSON.stringify, resulting in single-line output. Most useful when used in conjunction with the json flag. (default false)
* __prettyPrint:__ Boolean flag indicating if we should `util.inspect` the meta (default false). If function is specified, its return value will be the string representing the meta.
* __depth__ Numeric indicating how many times to recurse while formatting the object with `util.inspect` (only used with `prettyPrint: true`) (default null, unlimited)
* __showLevel:__ Boolean flag indicating if we should prepend output with level (default true).
* __formatter:__ If function is specified, its return value will be used instead of default output. (default undefined)
* __stderrLevels:__ Array of strings containing the levels to log to stderr instead of stdout, for example `['error', 'debug', 'info']`. (default `['error', 'debug']`)
* __prefix:__ Prefix to log

## Inspirations/Alternatives

* https://github.com/dustinblackman/winston-electron - does not support Winston 3.0
* https://www.npmjs.com/package/winston-electron-console - looked sketchy; source code is nowhere to be found

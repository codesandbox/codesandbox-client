# del-cli [![Build Status](https://travis-ci.com/sindresorhus/del-cli.svg?branch=master)](https://travis-ci.com/sindresorhus/del-cli)

> Delete files and directories

Useful for use in build scripts and automated things.

*Note that this does permanent deletion. See [`trash-cli`](https://github.com/sindresorhus/trash-cli) for something safer.*

## Install

```
$ npm install --global del-cli
```

## Usage

```
$ del --help

  Usage
    $ del <path|glob> …

  Options
    --force, -f    Allow deleting the current working directory and outside
    --dry-run, -d  List what would be deleted instead of deleting

  Examples
    $ del unicorn.png rainbow.png
    $ del "*.png" "!unicorn.png"
```

Since `$ del` is already a builtin command on Windows, you need to use `$ del-cli` there.

## Related

- [del](https://github.com/sindresorhus/del) - API for this module
- [trash-cli](https://github.com/sindresorhus/trash-cli) - Move files and directories to the trash
- [make-dir-cli](https://github.com/sindresorhus/make-dir-cli) - Make directories and their parents if needed

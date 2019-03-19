'use strict';

const inspect = require('util').inspect;
const format = require('./format');
const { MESSAGE } = require('triple-beam');

/*
 * function prettyPrint (info)
 * Returns a new instance of the prettyPrint Format that "prettyPrint"
 * serializes `info` objects. This was previously exposed as
 * { prettyPrint: true } to transports in `winston < 3.0.0`.
 */
module.exports = format((info, opts) => {
  info[MESSAGE] = inspect(info, false, opts.depth || null, opts.colorize);
  return info;
});

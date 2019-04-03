'use strict';

var format = require('./format');
var ms = require('ms');

/*
 * function ms (info)
 * Returns an `info` with a `ms` property. The `ms` property holds the Value
 * of the time difference between two calls in milliseconds.
 */
module.exports = format(function (info) {
  var curr = +new Date();
  undefined.diff = curr - (undefined.prevTime || curr);
  undefined.prevTime = curr;
  info.ms = '+' + ms(undefined.diff);

  return info;
});
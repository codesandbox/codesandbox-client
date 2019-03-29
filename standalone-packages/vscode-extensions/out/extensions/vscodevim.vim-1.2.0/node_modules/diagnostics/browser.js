'use strict';

var enabled = require('enabled');

/**
 * Bare minimum browser version of diagnostics. It doesn't need fancy pancy
 * detection algorithms. The code is only enabled when *you* enable it for
 * debugging purposes.
 *
 * @param {String} name Namespace of the diagnostics instance.
 * @returns {Function} The logger.
 * @api public
 */
module.exports = function factory(name) {
  if (!enabled(name)) return function diagnopes() {};

  return function diagnostics() {
    var args = Array.prototype.slice.call(arguments, 0);

    //
    // We cannot push a value as first argument of the argument array as
    // console's formatting %s, %d only works on the first argument it receives.
    // So in order to prepend our namespace we need to override and prefix the
    // first argument.
    //
    args[0] = name +': '+ args[0];

    //
    // So yea. IE8 doesn't have an apply so we need a work around to puke the
    // arguments in place.
    //
    try { Function.prototype.apply.call(console.log, console, args); }
    catch (e) {}
  };
};

'use strict';

var colorspace = require('colorspace')
  , enabled = require('enabled')
  , kuler = require('kuler')
  , util = require('util');

/**
 * Check if the terminal we're using allows the use of colors.
 *
 * @type {Boolean}
 * @private
 */
var tty = require('tty').isatty(1);

/**
 * The default stream instance we should be writing against.
 *
 * @type {Stream}
 * @public
 */
var stream = process.stdout;

/**
 * A simple environment based logger.
 *
 * Options:
 *
 * - colors: Force the use of colors or forcefully disable them. If this option
 *   is not supplied the colors will be based on your terminal.
 * - stream: The Stream instance we should write our logs to, defaults to
 *   process.stdout but can be anything you like.
 *
 * @param {String} name The namespace of your log function.
 * @param {Object} options Logger configuration.
 * @returns {Function} Configured logging method.
 * @api public
 */
function factory(name, options) {
  if (!enabled(name)) return function diagnopes() {};

  options = options || {};
  options.colors = 'colors' in options ? options.colors : tty;
  options.ansi = options.colors ? kuler(name, colorspace(name)) : name;
  options.stream = options.stream || stream;

  //
  // Allow multiple streams, so make sure it's an array which makes iteration
  // easier.
  //
  if (!Array.isArray(options.stream)) {
    options.stream = [options.stream];
  }

  //
  // The actual debug function which does the logging magic.
  //
  return function debug(line) {
    //
    // Better formatting for error instances.
    //
    if (line instanceof Error) line = line.stack || line.message || line;

    line = [
      //
      // Add the colorized namespace.
      //
      options.ansi,

      //
      // The total time we took to execute the next debug statement.
      //
      ' ',
      line
    ].join('');

    //
    // Use util.format so we can follow the same API as console.log.
    //
    line = util.format.apply(this, [line].concat(
        Array.prototype.slice.call(arguments, 1)
    )) + '\n';

    options.stream.forEach(function each(stream) {
      stream.write(line);
    });
  };
}

/**
 * Override the "default" stream that we write to. This allows you to globally
 * configure the steams.
 *
 * @param {Stream} output
 * @returns {function} Factory
 * @api private
 */
factory.to = function to(output) {
  stream = output;
  return factory;
};

//
// Expose the module.
//
module.exports = factory;

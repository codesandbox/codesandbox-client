'use strict';

const TransportStream = require('../../');

module.exports = class SimpleTransport extends TransportStream {
  /**
   * !!! HERE BE DRAGONS !!!
   *
   * Constructor function for the SimpleTransport which we use for testing
   * purposes. It breaks all the established rules and conventions for testing
   * edge cases. You SHOULD NOT use this as an example for how to write a
   * custom `winston` Transport.
   * @param {Object} opts = Configuration for this instance
   */
  constructor(opts = {}) {
    super(opts);

    //
    // Remark: we literally accept levels for TESTING PURPOSES only.
    // In `winston` these levels will always inherit from the Logger
    // we are piped to.
    //
    this.levels = opts.levels;
    this.stream = opts.stream;
    this.streams = opts.streams;
  }

  /**
   * Writes to one of the streams associated with this instance.
   * @param {Info} info - Winston log information.
   * @param {Function} callback - Continuation to respond to when complete.
   * @returns {undefined}
   */
  log(info, callback) {
    const stream = (this.streams && this.streams[info.level]) || this.stream;
    stream.write(JSON.stringify(info));
    this.emit('logged');
    callback();
  }

  /**
   * Emits a custom close event for the purposes of testing
   * @returns {undefined}
   */
  close() {
    setImmediate(() => this.emit('closed:custom'));
  }
};

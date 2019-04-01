'use strict';

const { Transport } = require('winston-compat');

module.exports = class LegacyTransport extends Transport {
  /**
   * !!! HERE BE DRAGONS !!!
   *
   * Constructor function for the LegacyTransport which we use for testing
   * purposes. It breaks all the established rules and conventions for testing
   * edge cases. You SHOULD NOT use this as an example for how to write a
   * custom `winston` Transport.
   * @param {Object} opts - Configuration for this instance
   */
  constructor(opts = {}) {
    super(opts);

    // Define the name of the legacy Transport
    LegacyTransport.prototype.name = 'TestLegacy';

    // Remark: we literally accept levels for TESTING PURPOSES only. In
    // `winston` these levels will always inherit from the Logger we are piped
    // to.
    this.levels = opts.levels;
    this.stream = opts.stream || { write() {} };
    this.streams = opts.streams;
  }

  /**
   * Writes to one of the streams associated with this instance.
   * @param {String} level - Log level that the message and meta are associated
   * with.
   * @param {String} message - Log message used to describe meta.
   * @param {Object} meta - Additional log metadata to persist without
   * { level, message }.
   * @param {Function} callback - Continuation to respond to when complete
   * @returns {undefined}
   */
  log(level, message, meta, callback) {
    const info = Object.assign({}, meta, { level, message });
    const stream = (this.streams && this.streams[info.level]) || this.stream;
    stream.write(JSON.stringify(info));
    this.emit('logged', info);
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

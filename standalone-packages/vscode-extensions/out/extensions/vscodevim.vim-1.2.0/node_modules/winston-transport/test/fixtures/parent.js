'use strict';

const { Transform } = require('stream');

module.exports = class Parent extends Transform {
  /**
   * !!! HERE BE DRAGONS !!!
   *
   * Constructor function for the Parent which we use to represent
   * `winston.Logger` for testing purposes. You SHOULD NOT use this as an
   * example for ANYTHING.
   * @param {Object} opts - Configuration for this instance.
   */
  constructor(opts) {
    super({
      objectMode: true
    });

    this.levels = opts.levels;
    this.level = opts.level;
  }

  /**
   * Basic pass-through write. In `winston` itself this writes to the `_format`
   * which itself is then read back and pushed.
   * @param {Info} info - Winston log information
   * @param {mixed} enc - TODO: add param description.
   * @param {Function} callback - Continuation to respond to when complete.
   * @returns {undefined}
   */
  _transform(info, enc, callback) {
    this.push(info);
    callback();
  }
};

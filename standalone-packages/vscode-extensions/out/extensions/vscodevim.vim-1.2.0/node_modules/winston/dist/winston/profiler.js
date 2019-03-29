/**
 * profiler.js: TODO: add file header description.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */
'use strict';
/**
 * TODO: add class description.
 * @type {Profiler}
 * @private
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  /**
   * Constructor function for the Profiler instance used by
   * `Logger.prototype.startTimer`. When done is called the timer will finish
   * and log the duration.
   * @param {!Logger} logger - TODO: add param description.
   * @private
   */
  function Profiler(logger) {
    _classCallCheck(this, Profiler);

    if (!logger) {
      throw new Error('Logger is required for profiling.');
    }

    this.logger = logger;
    this.start = Date.now();
  }
  /**
   * Ends the current timer (i.e. Profiler) instance and logs the `msg` along
   * with the duration since creation.
   * @returns {mixed} - TODO: add return description.
   * @private
   */


  _createClass(Profiler, [{
    key: "done",
    value: function done() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof args[args.length - 1] === 'function') {
        // eslint-disable-next-line no-console
        console.warn('Callback function no longer supported as of winston@3.0.0');
        args.pop();
      }

      var info = _typeof(args[args.length - 1]) === 'object' ? args.pop() : {};
      info.level = info.level || 'info';
      info.durationMs = Date.now() - this.start;
      return this.logger.write(info);
    }
  }]);

  return Profiler;
}();
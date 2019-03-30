/**
 * create-logger.js: Logger factory for winston logger instances.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('triple-beam'),
    LEVEL = _require.LEVEL;

var config = require('./config');

var Logger = require('./logger');

var debug = require('diagnostics')('winston:create-logger');

function isLevelEnabledFunctionName(level) {
  return 'is' + level.charAt(0).toUpperCase() + level.slice(1) + 'Enabled';
}
/**
 * Create a new instance of a winston Logger. Creates a new
 * prototype for each instance.
 * @param {!Object} opts - Options for the created logger.
 * @returns {Logger} - A newly created logger instance.
 */


module.exports = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  //
  // Default levels: npm
  //
  opts.levels = opts.levels || config.npm.levels;
  /**
   * DerivedLogger to attach the logs level methods.
   * @type {DerivedLogger}
   * @extends {Logger}
   */

  var DerivedLogger =
  /*#__PURE__*/
  function (_Logger) {
    _inherits(DerivedLogger, _Logger);

    /**
     * Create a new class derived logger for which the levels can be attached to
     * the prototype of. This is a V8 optimization that is well know to increase
     * performance of prototype functions.
     * @param {!Object} options - Options for the created logger.
     */
    function DerivedLogger(options) {
      _classCallCheck(this, DerivedLogger);

      return _possibleConstructorReturn(this, _getPrototypeOf(DerivedLogger).call(this, options));
    }

    return DerivedLogger;
  }(Logger);

  var logger = new DerivedLogger(opts); //
  // Create the log level methods for the derived logger.
  //

  Object.keys(opts.levels).forEach(function (level) {
    debug('Define prototype method for "%s"', level);

    if (level === 'log') {
      // eslint-disable-next-line no-console
      console.warn('Level "log" not defined: conflicts with the method "log". Use a different level name.');
      return;
    } //
    // Define prototype methods for each log level e.g.:
    // logger.log('info', msg) implies these methods are defined:
    // - logger.info(msg)
    // - logger.isInfoEnabled()
    //
    // Remark: to support logger.child this **MUST** be a function
    // so it'll always be called on the instance instead of a fixed
    // place in the prototype chain.
    //


    DerivedLogger.prototype[level] = function () {
      // Prefer any instance scope, but default to "root" logger
      var self = this || logger; // Optimize the hot-path which is the single object.

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length === 1) {
        var msg = args[0];
        var info = msg && msg.message && msg || {
          message: msg
        };
        info.level = info[LEVEL] = level;

        self._addDefaultMeta(info);

        self.write(info);
        return this || logger;
      } // When provided nothing assume the empty string


      if (args.length === 0) {
        self.log(level, '');
        return self;
      } // Otherwise build argument list which could potentially conform to
      // either:
      // . v3 API: log(obj)
      // 2. v1/v2 API: log(level, msg, ... [string interpolate], [{metadata}], [callback])


      return self.log.apply(self, [level].concat(args));
    };

    DerivedLogger.prototype[isLevelEnabledFunctionName(level)] = function () {
      return (this || logger).isLevelEnabled(level);
    };
  });
  return logger;
};
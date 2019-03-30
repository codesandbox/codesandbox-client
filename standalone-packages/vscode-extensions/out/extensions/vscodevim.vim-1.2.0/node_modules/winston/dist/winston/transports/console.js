/* eslint-disable no-console */

/*
 * console.js: Transport for outputting to the console.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var os = require('os');

var _require = require('triple-beam'),
    LEVEL = _require.LEVEL,
    MESSAGE = _require.MESSAGE;

var TransportStream = require('winston-transport');
/**
 * Transport for outputting to the console.
 * @type {Console}
 * @extends {TransportStream}
 */


module.exports =
/*#__PURE__*/
function (_TransportStream) {
  _inherits(Console, _TransportStream);

  /**
   * Constructor function for the Console transport object responsible for
   * persisting log messages and metadata to a terminal or TTY.
   * @param {!Object} [options={}] - Options for this instance.
   */
  function Console() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Console);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Console).call(this, options)); // Expose the name of this Transport on the prototype

    _this.name = options.name || 'console';
    _this.stderrLevels = _this._stringArrayToSet(options.stderrLevels);
    _this.consoleWarnLevels = _this._stringArrayToSet(options.consoleWarnLevels);
    _this.eol = options.eol || os.EOL;

    _this.setMaxListeners(30);

    return _this;
  }
  /**
   * Core logging method exposed to Winston.
   * @param {Object} info - TODO: add param description.
   * @param {Function} callback - TODO: add param description.
   * @returns {undefined}
   */


  _createClass(Console, [{
    key: "log",
    value: function log(info, callback) {
      var _this2 = this;

      setImmediate(function () {
        return _this2.emit('logged', info);
      }); // Remark: what if there is no raw...?

      if (this.stderrLevels[info[LEVEL]]) {
        if (console._stderr) {
          // Node.js maps `process.stderr` to `console._stderr`.
          console._stderr.write("".concat(info[MESSAGE]).concat(this.eol));
        } else {
          // console.error adds a newline
          console.error(info[MESSAGE]);
        }

        if (callback) {
          callback(); // eslint-disable-line callback-return
        }

        return;
      } else if (this.consoleWarnLevels[info[LEVEL]]) {
        if (console._stderr) {
          // Node.js maps `process.stderr` to `console._stderr`.
          // in Node.js console.warn is an alias for console.error
          console._stderr.write("".concat(info[MESSAGE]).concat(this.eol));
        } else {
          // console.warn adds a newline
          console.warn(info[MESSAGE]);
        }

        if (callback) {
          callback(); // eslint-disable-line callback-return
        }

        return;
      }

      if (console._stdout) {
        // Node.js maps `process.stdout` to `console._stdout`.
        console._stdout.write("".concat(info[MESSAGE]).concat(this.eol));
      } else {
        // console.log adds a newline.
        console.log(info[MESSAGE]);
      }

      if (callback) {
        callback(); // eslint-disable-line callback-return
      }
    }
    /**
     * Returns a Set-like object with strArray's elements as keys (each with the
     * value true).
     * @param {Array} strArray - Array of Set-elements as strings.
     * @param {?string} [errMsg] - Custom error message thrown on invalid input.
     * @returns {Object} - TODO: add return description.
     * @private
     */

  }, {
    key: "_stringArrayToSet",
    value: function _stringArrayToSet(strArray, errMsg) {
      if (!strArray) return {};
      errMsg = errMsg || 'Cannot make set from type other than Array of string elements';

      if (!Array.isArray(strArray)) {
        throw new Error(errMsg);
      }

      return strArray.reduce(function (set, el) {
        if (typeof el !== 'string') {
          throw new Error(errMsg);
        }

        set[el] = true;
        return set;
      }, {});
    }
  }]);

  return Console;
}(TransportStream);
/**
 * stream.js: Transport for outputting to any arbitrary stream.
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

var isStream = require('is-stream');

var _require = require('triple-beam'),
    MESSAGE = _require.MESSAGE;

var os = require('os');

var TransportStream = require('winston-transport');
/**
 * Transport for outputting to any arbitrary stream.
 * @type {Stream}
 * @extends {TransportStream}
 */


module.exports =
/*#__PURE__*/
function (_TransportStream) {
  _inherits(Stream, _TransportStream);

  /**
   * Constructor function for the Console transport object responsible for
   * persisting log messages and metadata to a terminal or TTY.
   * @param {!Object} [options={}] - Options for this instance.
   */
  function Stream() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Stream);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Stream).call(this, options));

    if (!options.stream || !isStream(options.stream)) {
      throw new Error('options.stream is required.');
    } // We need to listen for drain events when write() returns false. This can
    // make node mad at times.


    _this._stream = options.stream;

    _this._stream.setMaxListeners(Infinity);

    _this.isObjectMode = options.stream._writableState.objectMode;
    _this.eol = options.eol || os.EOL;
    return _this;
  }
  /**
   * Core logging method exposed to Winston.
   * @param {Object} info - TODO: add param description.
   * @param {Function} callback - TODO: add param description.
   * @returns {undefined}
   */


  _createClass(Stream, [{
    key: "log",
    value: function log(info, callback) {
      var _this2 = this;

      setImmediate(function () {
        return _this2.emit('logged', info);
      });

      if (this.isObjectMode) {
        this._stream.write(info);

        if (callback) {
          callback(); // eslint-disable-line callback-return
        }

        return;
      }

      this._stream.write("".concat(info[MESSAGE]).concat(this.eol));

      if (callback) {
        callback(); // eslint-disable-line callback-return
      }

      return;
    }
  }]);

  return Stream;
}(TransportStream);
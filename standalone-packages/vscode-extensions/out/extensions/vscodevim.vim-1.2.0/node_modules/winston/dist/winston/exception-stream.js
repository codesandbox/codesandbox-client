/**
 * exception-stream.js: TODO: add file header handler.
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

var _require = require('readable-stream'),
    Writable = _require.Writable;
/**
 * TODO: add class description.
 * @type {ExceptionStream}
 * @extends {Writable}
 */


module.exports =
/*#__PURE__*/
function (_Writable) {
  _inherits(ExceptionStream, _Writable);

  /**
   * Constructor function for the ExceptionStream responsible for wrapping a
   * TransportStream; only allowing writes of `info` objects with
   * `info.exception` set to true.
   * @param {!TransportStream} transport - Stream to filter to exceptions
   */
  function ExceptionStream(transport) {
    var _this;

    _classCallCheck(this, ExceptionStream);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExceptionStream).call(this, {
      objectMode: true
    }));

    if (!transport) {
      throw new Error('ExceptionStream requires a TransportStream instance.');
    } // Remark (indexzero): we set `handleExceptions` here because it's the
    // predicate checked in ExceptionHandler.prototype.__getExceptionHandlers


    _this.handleExceptions = true;
    _this.transport = transport;
    return _this;
  }
  /**
   * Writes the info object to our transport instance if (and only if) the
   * `exception` property is set on the info.
   * @param {mixed} info - TODO: add param description.
   * @param {mixed} enc - TODO: add param description.
   * @param {mixed} callback - TODO: add param description.
   * @returns {mixed} - TODO: add return description.
   * @private
   */


  _createClass(ExceptionStream, [{
    key: "_write",
    value: function _write(info, enc, callback) {
      if (info.exception) {
        return this.transport.log(info, callback);
      }

      callback();
      return true;
    }
  }]);

  return ExceptionStream;
}(Writable);
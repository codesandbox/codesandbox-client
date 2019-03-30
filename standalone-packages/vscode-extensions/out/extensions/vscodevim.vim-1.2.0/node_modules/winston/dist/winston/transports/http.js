/**
 * http.js: Transport for outputting to a json-rpcserver.
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

var http = require('http');

var https = require('https');

var _require = require('readable-stream'),
    Stream = _require.Stream;

var TransportStream = require('winston-transport');
/**
 * Transport for outputting to a json-rpc server.
 * @type {Stream}
 * @extends {TransportStream}
 */


module.exports =
/*#__PURE__*/
function (_TransportStream) {
  _inherits(Http, _TransportStream);

  /**
   * Constructor function for the Http transport object responsible for
   * persisting log messages and metadata to a terminal or TTY.
   * @param {!Object} [options={}] - Options for this instance.
   */
  function Http() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Http);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Http).call(this, options));
    _this.name = options.name || 'http';
    _this.ssl = !!options.ssl;
    _this.host = options.host || 'localhost';
    _this.port = options.port;
    _this.auth = options.auth;
    _this.path = options.path || '';
    _this.agent = options.agent;
    _this.headers = options.headers || {};
    _this.headers['content-type'] = 'application/json';

    if (!_this.port) {
      _this.port = _this.ssl ? 443 : 80;
    }

    return _this;
  }
  /**
   * Core logging method exposed to Winston.
   * @param {Object} info - TODO: add param description.
   * @param {function} callback - TODO: add param description.
   * @returns {undefined}
   */


  _createClass(Http, [{
    key: "log",
    value: function log(info, callback) {
      var _this2 = this;

      this._request(info, function (err, res) {
        if (res && res.statusCode !== 200) {
          err = new Error("Invalid HTTP Status Code: ".concat(res.statusCode));
        }

        if (err) {
          _this2.emit('warn', err);
        } else {
          _this2.emit('logged', info);
        }
      }); // Remark: (jcrugzz) Fire and forget here so requests dont cause buffering
      // and block more requests from happening?


      if (callback) {
        setImmediate(callback);
      }
    }
    /**
     * Query the transport. Options object is optional.
     * @param {Object} options -  Loggly-like query options for this instance.
     * @param {function} callback - Continuation to respond to when complete.
     * @returns {undefined}
     */

  }, {
    key: "query",
    value: function query(options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options = {
        method: 'query',
        params: this.normalizeQuery(options)
      };

      if (options.params.path) {
        options.path = options.params.path;
        delete options.params.path;
      }

      if (options.params.auth) {
        options.auth = options.params.auth;
        delete options.params.auth;
      }

      this._request(options, function (err, res, body) {
        if (res && res.statusCode !== 200) {
          err = new Error("Invalid HTTP Status Code: ".concat(res.statusCode));
        }

        if (err) {
          return callback(err);
        }

        if (typeof body === 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            return callback(e);
          }
        }

        callback(null, body);
      });
    }
    /**
     * Returns a log stream for this transport. Options object is optional.
     * @param {Object} options - Stream options for this instance.
     * @returns {Stream} - TODO: add return description
     */

  }, {
    key: "stream",
    value: function stream() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var stream = new Stream();
      options = {
        method: 'stream',
        params: options
      };

      if (options.params.path) {
        options.path = options.params.path;
        delete options.params.path;
      }

      if (options.params.auth) {
        options.auth = options.params.auth;
        delete options.params.auth;
      }

      var buff = '';

      var req = this._request(options);

      stream.destroy = function () {
        return req.destroy();
      };

      req.on('data', function (data) {
        data = (buff + data).split(/\n+/);
        var l = data.length - 1;
        var i = 0;

        for (; i < l; i++) {
          try {
            stream.emit('log', JSON.parse(data[i]));
          } catch (e) {
            stream.emit('error', e);
          }
        }

        buff = data[l];
      });
      req.on('error', function (err) {
        return stream.emit('error', err);
      });
      return stream;
    }
    /**
     * Make a request to a winstond server or any http server which can
     * handle json-rpc.
     * @param {function} options - Options to sent the request.
     * @param {function} callback - Continuation to respond to when complete.
     */

  }, {
    key: "_request",
    value: function _request(options, callback) {
      options = options || {};
      var auth = options.auth || this.auth;
      var path = options.path || this.path || '';
      delete options.auth;
      delete options.path; // Prepare options for outgoing HTTP request

      var req = (this.ssl ? https : http).request({
        method: 'POST',
        host: this.host,
        port: this.port,
        path: "/".concat(path.replace(/^\//, '')),
        headers: this.headers,
        auth: auth ? "".concat(auth.username, ":").concat(auth.password) : '',
        agent: this.agent
      });
      req.on('error', callback);
      req.on('response', function (res) {
        return res.on('end', function () {
          return callback(null, res);
        }).resume();
      });
      req.end(Buffer.from(JSON.stringify(options), 'utf8'));
    }
  }]);

  return Http;
}(TransportStream);
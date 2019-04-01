'use strict';

/*
 * Displays a helpful message and the source of
 * the format when it is invalid.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InvalidFormatError = function (_Error) {
  _inherits(InvalidFormatError, _Error);

  function InvalidFormatError(formatFn) {
    _classCallCheck(this, InvalidFormatError);

    var _this = _possibleConstructorReturn(this, (InvalidFormatError.__proto__ || Object.getPrototypeOf(InvalidFormatError)).call(this, 'Format functions must be synchronous taking a two arguments: (info, opts)\nFound: ' + formatFn.toString().split('\n')[0] + '\n'));

    Error.captureStackTrace(_this, InvalidFormatError);
    return _this;
  }

  return InvalidFormatError;
}(Error);

/*
 * function format (formatFn)
 * Returns a create function for the `formatFn`.
 */


module.exports = function (formatFn) {
  if (formatFn.length > 2) {
    throw new InvalidFormatError(formatFn);
  }

  /*
   * function Format (options)
   * Base prototype which calls a `_format`
   * function and pushes the result.
   */
  function Format() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options = options;
  }

  Format.prototype.transform = formatFn;

  //
  // Create a function which returns new instances of
  // FormatWrap for simple syntax like:
  //
  // require('winston').formats.json();
  //
  function createFormatWrap(opts) {
    return new Format(opts);
  }

  //
  // Expose the FormatWrap through the create function
  // for testability.
  //
  createFormatWrap.Format = Format;
  return createFormatWrap;
};
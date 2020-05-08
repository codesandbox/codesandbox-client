"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerlessIconLight = exports.ServerlessIconDark = exports.ServerlessIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ServerlessIcon = function ServerlessIcon(_ref) {
  var props = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M0 23.1502H5.66394L3.90916 28.4497H0V23.1502ZM0 13.0751H9.00012L7.24551 18.3746H0V13.0751ZM0 3H12.3365L10.5815 8.29933H0V3ZM17.9186 3H32V8.29933H16.164L17.9186 3ZM14.5825 13.0751H31.9999V18.3746H12.8278L14.5825 13.0751ZM11.2463 23.1502H31.9999V28.4497H9.49172L11.2463 23.1502Z",
    fill: "#F26D61"
  }));
};

exports.ServerlessIcon = ServerlessIcon;

var ServerlessIconDark = function ServerlessIconDark(_ref2) {
  var props = _extends({}, _ref2);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M3 21.6271H7.6462L6.20673 26H3V21.6271ZM3 13.3135H10.3829L8.94358 17.6865H3V13.3135ZM3 5H13.1198L11.6801 9.37278H3V5ZM17.6989 5H29.25V9.37278H16.2595L17.6989 5ZM14.9622 13.3135H29.25V17.6865H13.5228L14.9622 13.3135ZM12.2255 21.6271H29.2499V26H10.7862L12.2255 21.6271Z",
    fill: "black"
  }));
};

exports.ServerlessIconDark = ServerlessIconDark;

var ServerlessIconLight = function ServerlessIconLight(_ref3) {
  var props = _extends({}, _ref3);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M3 21.6271H7.6462L6.20673 26H3V21.6271ZM3 13.3135H10.3829L8.94358 17.6865H3V13.3135ZM3 5H13.1198L11.6801 9.37278H3V5ZM17.6989 5H29.25V9.37278H16.2595L17.6989 5ZM14.9622 13.3135H29.25V17.6865H13.5228L14.9622 13.3135ZM12.2255 21.6271H29.2499V26H10.7862L12.2255 21.6271Z",
    fill: "white"
  }));
};

exports.ServerlessIconLight = ServerlessIconLight;
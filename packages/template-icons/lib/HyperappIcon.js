"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HyperappIconLight = exports.HyperappIconDark = exports.HyperappIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var HyperappIcon = function HyperappIcon(_ref) {
  var props = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M31 8V24C31 26.21 29.21 28 27 28H5C2.79 28 1 26.21 1 24V8C1 5.79 2.79 4 5 4H27C29.21 4 31 5.79 31 8Z",
    fill: "white"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M27 4H5C2.79 4 1 5.79 1 8V24C1 26.21 2.79 28 5 28H27C29.21 28 31 26.21 31 24V8C31 5.79 29.21 4 27 4ZM13.08 17.06V22.33H11V17.06H5.74V15H11V9.67H13.08V15H17.4L18.41 17.06H13.08ZM23.86 22.33L17.67 9.67H20.1L26.3 22.33H23.86Z",
    fill: "#0080FF"
  }));
};

exports.HyperappIcon = HyperappIcon;

var HyperappIconDark = function HyperappIconDark(_ref2) {
  var props = _extends({}, _ref2);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M31 8V24C31 26.21 29.21 28 27 28H5C2.79 28 1 26.21 1 24V8C1 5.79 2.79 4 5 4H27C29.21 4 31 5.79 31 8Z",
    fill: "white"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M27 4H5C2.79 4 1 5.79 1 8V24C1 26.21 2.79 28 5 28H27C29.21 28 31 26.21 31 24V8C31 5.79 29.21 4 27 4ZM13.08 17.06V22.33H11V17.06H5.74V15H11V9.67H13.08V15H17.4L18.41 17.06H13.08ZM23.86 22.33L17.67 9.67H20.1L26.3 22.33H23.86Z",
    fill: "black"
  }));
};

exports.HyperappIconDark = HyperappIconDark;

var HyperappIconLight = function HyperappIconLight(_ref3) {
  var props = _extends({}, _ref3);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M31 8V24C31 26.21 29.21 28 27 28H5C2.79 28 1 26.21 1 24V8C1 5.79 2.79 4 5 4H27C29.21 4 31 5.79 31 8Z",
    fill: "black"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M27 4H5C2.79 4 1 5.79 1 8V24C1 26.21 2.79 28 5 28H27C29.21 28 31 26.21 31 24V8C31 5.79 29.21 4 27 4ZM13.08 17.06V22.33H11V17.06H5.74V15H11V9.67H13.08V15H17.4L18.41 17.06H13.08ZM23.86 22.33L17.67 9.67H20.1L26.3 22.33H23.86Z",
    fill: "white"
  }));
};

exports.HyperappIconLight = HyperappIconLight;
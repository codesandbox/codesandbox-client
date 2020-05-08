"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrismaIconLight = exports.PrismaIconDark = exports.PrismaIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PrismaIcon = function PrismaIcon(_ref) {
  var props = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M28 32H4C1.7909 32 0 30.2091 0 28V4C0 1.7909 1.7909 0 4 0H28C30.2091 0 32 1.7909 32 4V28C32 30.2091 30.2091 32 28 32Z",
    fill: "#08334A"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M25.8063 22.2846L17.5528 4.7571C17.3439 4.3177 16.9108 4.0281 16.4249 4.003C15.9378 3.9704 15.4731 4.2113 15.219 4.6281L6.2672 19.127C5.9893 19.574 5.9951 20.1414 6.2822 20.5825L10.6588 27.3601C10.9989 27.8827 11.6421 28.1192 12.2397 27.9415L24.9406 24.1847C25.3276 24.0715 25.6464 23.7962 25.8148 23.4299C25.9809 23.0654 25.978 22.6462 25.807 22.284L25.8063 22.2846ZM23.9585 23.0363L13.181 26.2233C12.8522 26.3211 12.5366 26.0361 12.6051 25.7044L16.4556 7.2673C16.5276 6.9223 17.0039 6.8677 17.1545 7.1869L24.2825 22.3237C24.3463 22.4602 24.3471 22.6178 24.2846 22.7549C24.2221 22.892 24.1034 22.9949 23.9585 23.0363Z",
    fill: "white"
  }));
};

exports.PrismaIcon = PrismaIcon;

var PrismaIconDark = function PrismaIconDark(_ref2) {
  var props = _extends({}, _ref2);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M25.8683 22.4L17.5626 4.76186C17.3524 4.31963 16.9166 4.02826 16.4276 4.00296C15.9375 3.97012 15.4698 4.21259 15.2141 4.63205L6.20572 19.2226C5.92606 19.6723 5.93195 20.2433 6.22082 20.6872L10.6251 27.5077C10.9673 28.0335 11.6146 28.2715 12.2159 28.0927L24.9971 24.3121C25.3864 24.1982 25.7073 23.9212 25.8767 23.5526C26.0438 23.1858 26.0409 22.764 25.8689 22.3994L25.8683 22.4ZM24.0087 23.1565L13.1632 26.3636C12.8323 26.462 12.5148 26.1752 12.5836 25.8413L16.4584 7.28789C16.5308 6.94075 17.0102 6.88581 17.1618 7.20699L24.3348 22.4393C24.3989 22.5767 24.3997 22.7353 24.3369 22.8732C24.274 23.0112 24.1545 23.1148 24.0087 23.1565Z",
    fill: "black"
  }));
};

exports.PrismaIconDark = PrismaIconDark;

var PrismaIconLight = function PrismaIconLight(_ref3) {
  var props = _extends({}, _ref3);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M25.8683 22.4L17.5626 4.76186C17.3524 4.31963 16.9166 4.02826 16.4276 4.00296C15.9375 3.97012 15.4698 4.21259 15.2141 4.63205L6.20572 19.2226C5.92606 19.6723 5.93195 20.2433 6.22082 20.6872L10.6251 27.5077C10.9673 28.0335 11.6146 28.2715 12.2159 28.0927L24.9971 24.3121C25.3864 24.1982 25.7073 23.9212 25.8767 23.5526C26.0438 23.1858 26.0409 22.764 25.8689 22.3994L25.8683 22.4ZM24.0087 23.1565L13.1632 26.3636C12.8323 26.462 12.5148 26.1752 12.5836 25.8413L16.4584 7.28789C16.5308 6.94075 17.0102 6.88581 17.1618 7.20699L24.3348 22.4393C24.3989 22.5767 24.3997 22.7353 24.3369 22.8732C24.274 23.0112 24.1545 23.1148 24.0087 23.1565Z",
    fill: "white"
  }));
};

exports.PrismaIconLight = PrismaIconLight;
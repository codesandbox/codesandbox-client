"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueIconLight = exports.VueIconDark = exports.VueIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VueIcon = function VueIcon(_ref) {
  var props = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M25.6 2.1875H32L16 29.7875L0 2.1875H6.32H12.24L16 8.5875L19.68 2.1875H25.6Z",
    fill: "#41B883"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M0 2.1875L16 29.7875L32 2.1875H25.6L16 18.7475L6.32 2.1875H0Z",
    fill: "#41B883"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M6.32 2.1875L16 18.8275L25.6 2.1875H19.68L16 8.5875L12.24 2.1875H6.32Z",
    fill: "#35495E"
  }));
};

exports.VueIcon = VueIcon;

var VueIconDark = function VueIconDark(_ref2) {
  var props = _extends({}, _ref2);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M2 4.91406L16 29.0641L30 4.91406H24.4L16 19.4041L7.53 4.91406H2Z",
    fill: "black"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M7.53 3.91406L16 18.4741L24.4 3.91406H19.22L16 9.5141L12.71 3.91406H7.53Z",
    fill: "black",
    fillOpacity: "0.6"
  }));
};

exports.VueIconDark = VueIconDark;

var VueIconLight = function VueIconLight(_ref3) {
  var props = _extends({}, _ref3);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M2 4.91406L16 29.0641L30 4.91406H24.4L16 19.4041L7.53 4.91406H2Z",
    fill: "white"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M7.53 3.91406L16 18.4741L24.4 3.91406H19.22L16 9.5141L12.71 3.91406H7.53Z",
    fill: "white"
  }));
};

exports.VueIconLight = VueIconLight;
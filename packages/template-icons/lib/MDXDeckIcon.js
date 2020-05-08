"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MDXDeckIconLight = exports.MDXDeckIconDark = exports.MDXDeckIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MDXDeckIcon = function MDXDeckIcon(_ref) {
  var props = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M30.7826 9.56522H1.21739C0.641093 9.56522 0.173912 10.0324 0.173912 10.6087V21.3913C0.173912 21.9676 0.641093 22.4348 1.21739 22.4348H30.7826C31.3589 22.4348 31.8261 21.9676 31.8261 21.3913V10.6087C31.8261 10.0324 31.3589 9.56522 30.7826 9.56522Z",
    fill: "white",
    stroke: "#EAEAEA",
    strokeWidth: "0.347826"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M16.3478 17.7391V12.5997",
    stroke: "black",
    strokeWidth: "1.3913",
    strokeLinecap: "square"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M13.2174 15.7078L16.3733 18.8638L19.4843 15.7533",
    stroke: "black",
    strokeWidth: "1.3913"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M3.81449 19.5775V13.7888L7.02609 17.0006L10.2567 13.7702V19.536",
    stroke: "black",
    strokeWidth: "1.3913"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M21.6953 18.9607L28.4823 12.1739M28.3917 18.9607L21.6046 12.1739L28.3917 18.9607Z",
    stroke: "#F9AC00",
    strokeWidth: "1.3913"
  }));
};

exports.MDXDeckIcon = MDXDeckIcon;

var MDXDeckIconDark = function MDXDeckIconDark(_ref2) {
  var props = _extends({}, _ref2);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.04348 10H30.6087C31.185 10 31.6522 10.4672 31.6522 11.0435V21.8261C31.6522 22.4024 31.185 22.8696 30.6087 22.8696H1.04348C0.467181 22.8696 0 22.4024 0 21.8261V11.0435C0 10.4672 0.467181 10 1.04348 10ZM28.8835 18.4688L26.0273 15.6126L28.9742 12.6658L27.9904 11.682L25.0435 14.6289L22.0965 11.682L21.1127 12.6658L24.0597 15.6126L21.2034 18.4688L22.1872 19.4526L25.0435 16.5964L27.8998 19.4526L28.8835 18.4688ZM10.7784 12.5256V14.205V19.9708H9.38713V15.8844L7.34406 17.9273L6.85214 18.4192L6.36026 17.9272L4.33623 15.9031V20.0123H2.94493V14.2235V12.544L4.1325 13.7317L6.85221 16.4516L9.5909 13.7131L10.7784 12.5256ZM17.0435 11.904V17.21L18.9924 15.2613L19.9762 16.2452L16.3733 19.8475L12.7255 16.1997L13.7093 15.2159L15.6522 17.1588V11.904H17.0435Z",
    fill: "black"
  }));
};

exports.MDXDeckIconDark = MDXDeckIconDark;

var MDXDeckIconLight = function MDXDeckIconLight(_ref3) {
  var props = _extends({}, _ref3);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M1.04348 10H30.6087C31.185 10 31.6522 10.4672 31.6522 11.0435V21.8261C31.6522 22.4024 31.185 22.8696 30.6087 22.8696H1.04348C0.467181 22.8696 0 22.4024 0 21.8261V11.0435C0 10.4672 0.467181 10 1.04348 10ZM28.8835 18.4688L26.0273 15.6126L28.9742 12.6658L27.9904 11.682L25.0435 14.6289L22.0965 11.682L21.1127 12.6658L24.0597 15.6126L21.2034 18.4688L22.1872 19.4526L25.0435 16.5964L27.8998 19.4526L28.8835 18.4688ZM10.7784 12.5256V14.205V19.9708H9.38713V15.8844L7.34406 17.9273L6.85214 18.4192L6.36026 17.9272L4.33623 15.9031V20.0123H2.94493V14.2235V12.544L4.1325 13.7317L6.85221 16.4516L9.5909 13.7131L10.7784 12.5256ZM17.0435 11.904V17.21L18.9924 15.2613L19.9762 16.2452L16.3733 19.8475L12.7255 16.1997L13.7093 15.2159L15.6522 17.1588V11.904H17.0435Z",
    fill: "white"
  }));
};

exports.MDXDeckIconLight = MDXDeckIconLight;
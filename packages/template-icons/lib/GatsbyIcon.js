"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GatsbyIconLight = exports.GatsbyIconDark = exports.GatsbyIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var GatsbyIcon = function GatsbyIcon(_ref) {
  var props = _extends({}, _ref);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M28.5714 16H20.5714V18.2857H26.0571C25.2571 21.7143 22.7429 24.5714 19.4286 25.7143L6.28571 12.5714C7.65714 8.57143 11.5429 5.71429 16 5.71429C19.4286 5.71429 22.5143 7.42857 24.4571 10.0571L26.1714 8.57143C23.8857 5.48572 20.2286 3.42857 16 3.42857C10.0571 3.42857 5.02857 7.65715 3.77143 13.2571L18.8571 28.3429C24.3429 26.9714 28.5714 21.9429 28.5714 16Z",
    fill: "white"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M3.42857 16.1143C3.42857 19.3143 4.68571 22.4 7.08571 24.8C9.48571 27.2 12.6857 28.4571 15.7714 28.4571L3.42857 16.1143Z",
    fill: "white"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M16 0C7.2 0 0 7.2 0 16C0 24.8 7.2 32 16 32C24.8 32 32 24.8 32 16C32 7.2 24.8 0 16 0ZM7.08571 24.9143C4.68571 22.5143 3.42857 19.3143 3.42857 16.2286L15.8857 28.5714C12.6857 28.4571 9.48571 27.3143 7.08571 24.9143ZM18.7429 28.2286L3.77143 13.2571C5.02857 7.65714 10.0571 3.42857 16 3.42857C20.2286 3.42857 23.8857 5.48571 26.1714 8.57143L24.4571 10.0571C22.5143 7.42857 19.4286 5.71429 16 5.71429C11.5429 5.71429 7.77143 8.57143 6.28571 12.5714L19.4286 25.7143C22.7429 24.5714 25.2571 21.7143 26.0571 18.2857H20.5714V16H28.5714C28.5714 21.9429 24.3429 26.9714 18.7429 28.2286Z",
    fill: "#663399"
  }));
};

exports.GatsbyIcon = GatsbyIcon;

var GatsbyIconDark = function GatsbyIconDark(_ref2) {
  var props = _extends({}, _ref2);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M16 1C7.75 1 1 7.75 1 16C1 24.25 7.75 31 16 31C24.25 31 31 24.25 31 16C31 7.75 24.25 1 16 1ZM7.64286 24.3571C5.39286 22.1071 4.21429 19.1071 4.21429 16.2143L15.8929 27.7857C12.8929 27.6786 9.89286 26.6071 7.64286 24.3571ZM18.5714 27.4643L4.53571 13.4286C5.71429 8.17857 10.4286 4.21429 16 4.21429C19.9643 4.21429 23.3929 6.14286 25.5357 9.03571L23.9286 10.4286C22.1071 7.96429 19.2143 6.35714 16 6.35714C11.8214 6.35714 8.28571 9.03571 6.89286 12.7857L19.2143 25.1071C22.3214 24.0357 24.6786 21.3571 25.4286 18.1429H20.2857V16H27.7857C27.7857 21.5714 23.8214 26.2857 18.5714 27.4643Z",
    fill: "black"
  }));
};

exports.GatsbyIconDark = GatsbyIconDark;

var GatsbyIconLight = function GatsbyIconLight(_ref3) {
  var props = _extends({}, _ref3);

  return /*#__PURE__*/_react.default.createElement(_SVGIcon.SVGIcon, props, /*#__PURE__*/_react.default.createElement("path", {
    d: "M16 1C7.75 1 1 7.75 1 16C1 24.25 7.75 31 16 31C24.25 31 31 24.25 31 16C31 7.75 24.25 1 16 1ZM7.64286 24.3571C5.39286 22.1071 4.21429 19.1071 4.21429 16.2143L15.8929 27.7857C12.8929 27.6786 9.89286 26.6071 7.64286 24.3571ZM18.5714 27.4643L4.53571 13.4286C5.71429 8.17857 10.4286 4.21429 16 4.21429C19.9643 4.21429 23.3929 6.14286 25.5357 9.03571L23.9286 10.4286C22.1071 7.96429 19.2143 6.35714 16 6.35714C11.8214 6.35714 8.28571 9.03571 6.89286 12.7857L19.2143 25.1071C22.3214 24.0357 24.6786 21.3571 25.4286 18.1429H20.2857V16H27.7857C27.7857 21.5714 23.8214 26.2857 18.5714 27.4643Z",
    fill: "white"
  }));
};

exports.GatsbyIconLight = GatsbyIconLight;
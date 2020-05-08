

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdonisIconLight = exports.AdonisIconDark = exports.AdonisIcon = void 0;

const _react = _interopRequireDefault(require("react"));

const _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AdonisIcon = function AdonisIcon(_ref) {
  const props = { ..._ref};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    d: "M28 32H4C1.7909 32 0 30.2091 0 28V4C0 1.7909 1.7909 0 4 0H28C30.2091 0 32 1.7909 32 4V28C32 30.2091 30.2091 32 28 32Z",
    fill: "#241651"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M28 26.6663H6.6664L17.333 5.33301L28 26.6663ZM8.8241 25.3333H25.8423L17.333 8.31471L8.8241 25.3333Z",
    fill: "white"
  }), /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 6.6667L20 22.6667H4",
    fill: "white"
  }));
};

exports.AdonisIcon = AdonisIcon;

const AdonisIconDark = function AdonisIconDark(_ref2) {
  const props = { ..._ref2};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M14.8734 10.5077L11.6196 4L2 23.2392H8.50764L6.50359 27.2473H29.5618L18.0327 4.18918L14.8734 10.5077ZM9.50406 23.2392H21.2392L15.3717 11.5041L17.9015 6.44444L27.8029 26.2473H8.00001L9.50406 23.2392Z",
    fill: "black"
  }));
};

exports.AdonisIconDark = AdonisIconDark;

const AdonisIconLight = function AdonisIconLight(_ref3) {
  const props = { ..._ref3};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M14.8734 10.5077L11.6196 4L2 23.2392H8.50764L6.50359 27.2473H29.5618L18.0327 4.18918L14.8734 10.5077ZM9.50406 23.2392H21.2392L15.3717 11.5041L17.9015 6.44444L27.8029 26.2473H8.00001L9.50406 23.2392Z",
    fill: "white"
  }));
};

exports.AdonisIconLight = AdonisIconLight;
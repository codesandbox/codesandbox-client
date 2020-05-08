

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CycleJSIconDark = exports.CycleJSIconLight = exports.CycleJSIcon = void 0;

const _react = _interopRequireDefault(require("react"));

const _SVGIcon = require("./SVGIcon");

const _useUniqueId = require("./useUniqueId");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const CycleJSIcon = function CycleJSIcon(_ref) {
  const props = { ..._ref};

  const id = (0, _useUniqueId.useUniqueId)();
  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    d: "M31.995 24.79C31.98 25.115 31.89 25.435 31.725 25.725L28.695 30.975C28.33 31.61 27.655 32 26.925 32H10.11C9.38 32 8.705 31.61 8.34 30.98L0.275 17.025C0.09 16.705 0 16.355 0 16C0 15.645 0.07 15.275 0.285 14.915L8.345 1.02C8.71 0.39 9.385 0 10.11 0H26.925C27.655 0 28.33 0.39 28.695 1.02C28.695 1.02 31.61 5.795 31.82 6.135C32.03 6.475 31.995 6.905 31.995 7.255C31.995 7.555 31.91 7.965 31.83 8.29C31.75 8.615 29.31 18.505 29.31 18.505L23.985 7.18H13.07L7.96 16L13.07 24.82H23.98L31.995 24.79Z",
    fill: "url(#CycleJS_Paint0_Linear_".concat(id, ")")
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M28.105 15.995L31.805 23.84C32.09 24.445 32.06 25.15 31.725 25.73L23.985 24.825L28.105 15.995Z",
    fill: "url(#CycleJS_Paint1_Linear_".concat(id, ")")
  }), /* #__PURE__ */_react.default.createElement("defs", null, /* #__PURE__ */_react.default.createElement("linearGradient", {
    id: "CycleJS_Paint0_Linear_".concat(id),
    x1: "9.33814",
    y1: "31.8692",
    x2: "27.6747",
    y2: "0.114831",
    gradientUnits: "userSpaceOnUse"
  }, /* #__PURE__ */_react.default.createElement("stop", {
    offset: "0.4147",
    stopColor: "#51D3D9"
  }), /* #__PURE__ */_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#C8FF8C"
  })), /* #__PURE__ */_react.default.createElement("linearGradient", {
    id: "CycleJS_Paint1_Linear_".concat(id),
    x1: "26.7193",
    y1: "26.3984",
    x2: "32.9073",
    y2: "19.1344",
    gradientUnits: "userSpaceOnUse"
  }, /* #__PURE__ */_react.default.createElement("stop", {
    offset: "0.4147",
    stopColor: "#51D3D9"
  }), /* #__PURE__ */_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#5A919B"
  }))));
};

exports.CycleJSIcon = CycleJSIcon;

const CycleJSIconLight = function CycleJSIconLight(_ref2) {
  const props = { ..._ref2};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    d: "M28.9961 22.3672C28.9844 22.6211 28.9141 22.8711 28.7852 23.0977L26.418 27.1992C26.1328 27.6953 25.6055 28 25.0352 28H11.8984C11.3281 28 10.8008 27.6953 10.5156 27.2031L4.21484 16.3008C4.07031 16.0508 4 15.7773 4 15.5C4 15.2227 4.05469 14.9336 4.22266 14.6523L10.5195 3.79688C10.8047 3.30469 11.332 3 11.8984 3H25.0352C25.6055 3 26.1328 3.30469 26.418 3.79688C26.418 3.79688 28.6953 7.52734 28.8594 7.79297C29.0234 8.05859 28.9961 8.39453 28.9961 8.66797C28.9961 8.90234 28.9297 9.22266 28.8672 9.47656C28.8047 9.73047 26.8984 17.457 26.8984 17.457L22.7383 8.60938H14.2109L10.2188 15.5L14.2109 22.3906H22.7344L28.9961 22.3672Z",
    fill: "white"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M25.957 15.4961L28.8477 21.625C29.0703 22.0976 29.0469 22.6484 28.7852 23.1015L22.7383 22.3945L25.957 15.4961Z",
    fill: "white",
    fillOpacity: "0.6"
  }));
};

exports.CycleJSIconLight = CycleJSIconLight;

const CycleJSIconDark = function CycleJSIconDark(_ref3) {
  const props = { ..._ref3};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    d: "M28.9961 22.3672C28.9844 22.6211 28.9141 22.8711 28.7852 23.0977L26.418 27.1992C26.1328 27.6953 25.6055 28 25.0352 28H11.8984C11.3281 28 10.8008 27.6953 10.5156 27.2031L4.21484 16.3008C4.07031 16.0508 4 15.7773 4 15.5C4 15.2227 4.05469 14.9336 4.22266 14.6523L10.5195 3.79688C10.8047 3.30469 11.332 3 11.8984 3H25.0352C25.6055 3 26.1328 3.30469 26.418 3.79688C26.418 3.79688 28.6953 7.52734 28.8594 7.79297C29.0234 8.05859 28.9961 8.39453 28.9961 8.66797C28.9961 8.90234 28.9297 9.22266 28.8672 9.47656C28.8047 9.73047 26.8984 17.457 26.8984 17.457L22.7383 8.60938H14.2109L10.2188 15.5L14.2109 22.3906H22.7344L28.9961 22.3672Z",
    fill: "black"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M25.957 15.4961L28.8477 21.625C29.0703 22.0976 29.0469 22.6484 28.7852 23.1015L22.7383 22.3945L25.957 15.4961Z",
    fill: "black",
    fillOpacity: "0.6"
  }));
};

exports.CycleJSIconDark = CycleJSIconDark;
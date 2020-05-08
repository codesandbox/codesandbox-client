

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridsomeIconLight = exports.GridsomeIconDark = exports.GridsomeIcon = void 0;

const _react = _interopRequireDefault(require("react"));

const _SVGIcon = require("./SVGIcon");

const _useUniqueId = require("./useUniqueId");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const GridsomeIcon = function GridsomeIcon(_ref) {
  const props = { ..._ref};

  const id = (0, _useUniqueId.useUniqueId)();
  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    d: "M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z",
    fill: "url(#Gridsome_Paint0_Linear_".concat(id, ")")
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M20.023 16.1084C20.023 15.0478 20.8906 14.188 21.9609 14.188H24.7852C25.8555 14.188 26.75 15.0478 26.75 16.1084C26.75 17.1691 25.8555 18.0289 24.7852 18.0289H21.9609C20.8906 18.0289 20.023 17.1691 20.023 16.1084Z",
    fill: "white"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M14.0971 16.1112C14.0971 15.0491 14.9593 14.188 16.0216 14.188C17.0839 14.188 17.9461 15.0491 17.9461 16.1112C17.9461 17.1734 17.0839 18.0345 16.0216 18.0345C14.9593 18.0345 14.0971 17.1734 14.0971 16.1112Z",
    fill: "white"
  }), /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M17.8928 7.12549C17.9357 8.16055 17.1314 9.03449 16.0961 9.07749C11.6273 9.26305 8.89907 12.7652 9.03188 16.0906C9.0732 17.1257 8.28426 17.9984 7.24895 18.0397C6.21369 18.081 5.30327 17.2456 5.26193 16.2104C5.04553 10.7915 9.57082 5.43437 15.9404 5.32916C16.9757 5.28617 17.8498 6.09042 17.8928 7.12549Z",
    fill: "white"
  }), /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5.25604 16.0096C5.28146 22.557 10.6552 26.8836 16.0884 26.7499C22.5021 26.521 27.1353 20.9502 26.75 15.9773C26.6606 14.9445 25.7446 14.1439 24.7096 14.1935C23.6747 14.2432 22.876 15.1223 22.9256 16.157C23.0706 19.1793 20.2835 22.8807 15.9961 22.9995C12.5906 23.0833 9.18106 20.4094 9.03175 16.248C8.99187 17.2127 8.23131 18.0005 7.24894 18.0397C6.21365 18.081 5.30324 17.2456 5.2619 16.2104C5.25922 16.1435 5.25727 16.0765 5.25604 16.0096Z",
    fill: "url(#Gridsome_Paint1_Linear_".concat(id, ")")
  }), /* #__PURE__ */_react.default.createElement("defs", null, /* #__PURE__ */_react.default.createElement("linearGradient", {
    id: "Gridsome_Paint0_Linear_".concat(id),
    x1: "7.75",
    y1: "-2.3125",
    x2: "-0.962181",
    y2: "27.8966",
    gradientUnits: "userSpaceOnUse"
  }, /* #__PURE__ */_react.default.createElement("stop", {
    stopColor: "#00A672"
  }), /* #__PURE__ */_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#008B60"
  })), /* #__PURE__ */_react.default.createElement("linearGradient", {
    id: "Gridsome_Paint1_Linear_".concat(id),
    x1: "16.4913",
    y1: "27.8367",
    x2: "16.4913",
    y2: "15.7186",
    gradientUnits: "userSpaceOnUse"
  }, /* #__PURE__ */_react.default.createElement("stop", {
    stopColor: "white",
    stopOpacity: "0.95"
  }), /* #__PURE__ */_react.default.createElement("stop", {
    offset: "1",
    stopColor: "white",
    stopOpacity: "0.5"
  }))));
};

exports.GridsomeIcon = GridsomeIcon;

const GridsomeIconDark = function GridsomeIconDark(_ref2) {
  const props = { ..._ref2};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M16 1C24.2843 1 31 7.71573 31 16C31 24.2843 24.2843 31 16 31C7.71573 31 1 24.2843 1 16C1 7.71573 7.71573 1 16 1ZM17.7745 7.68015C17.8147 8.65052 17.0607 9.46984 16.0901 9.51015C11.9006 9.68411 9.34288 12.9674 9.46739 16.0849C9.49504 16.7778 9.12584 17.3932 8.55904 17.7025C9.08529 17.4153 9.44124 16.8644 9.46736 16.2325C9.60734 20.1338 12.8037 22.6406 15.9965 22.5621C19.2072 22.4731 21.5205 20.2409 22.2521 17.9021H21.5884C20.585 17.9021 19.7716 17.096 19.7716 16.1016C19.7716 15.1073 20.585 14.3012 21.5884 14.3012H24.2361C25.0941 14.3012 25.8315 14.8905 26.0273 15.6829C26.0522 15.7787 26.0695 15.8775 26.0782 15.9787C26.4394 20.6408 22.0958 25.8635 16.083 26.078C10.9906 26.2033 5.95406 22.1493 5.92765 16.0137C5.83263 10.9968 10.0446 6.09353 15.9442 5.99609C16.9147 5.95579 17.7341 6.70977 17.7745 7.68015ZM14.2161 16.1043C14.2161 15.1085 15.0243 14.3012 16.0202 14.3012C17.0161 14.3012 17.8244 15.1085 17.8244 16.1043C17.8244 17.1001 17.0161 17.9073 16.0202 17.9073C15.0243 17.9073 14.2161 17.1001 14.2161 16.1043Z",
    fill: "black"
  }), /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M17.7745 7.68015C17.8147 8.65052 17.0607 9.46984 16.0901 9.51015C11.9006 9.68411 9.34288 12.9674 9.46739 16.0849C9.50612 17.0553 8.76649 17.8735 7.79589 17.9122C6.82533 17.9509 5.97181 17.1678 5.93306 16.1973C5.73018 11.117 9.97264 6.09472 15.9442 5.99609C16.9147 5.95579 17.7341 6.70977 17.7745 7.68015Z",
    fill: "black",
    fillOpacity: "0.6"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M19.7716 16.1016C19.7716 15.1073 20.585 14.3012 21.5884 14.3012H24.2361C25.2395 14.3012 26.0781 15.1073 26.0781 16.1016C26.0781 17.096 25.2395 17.9021 24.2361 17.9021H21.5884C20.585 17.9021 19.7716 17.096 19.7716 16.1016Z",
    fill: "black",
    fillOpacity: "0.6"
  }));
};

exports.GridsomeIconDark = GridsomeIconDark;

const GridsomeIconLight = function GridsomeIconLight(_ref3) {
  const props = { ..._ref3};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M16 1C24.2843 1 31 7.71573 31 16C31 24.2843 24.2843 31 16 31C7.71573 31 1 24.2843 1 16C1 7.71573 7.71573 1 16 1ZM17.7745 7.68015C17.8147 8.65052 17.0607 9.46984 16.0901 9.51015C11.9006 9.68411 9.34288 12.9674 9.46739 16.0849C9.49504 16.7778 9.12584 17.3932 8.55904 17.7025C9.08529 17.4153 9.44124 16.8644 9.46736 16.2325C9.60734 20.1338 12.8037 22.6406 15.9965 22.5621C19.2072 22.4731 21.5205 20.2409 22.2521 17.9021H21.5884C20.585 17.9021 19.7716 17.096 19.7716 16.1016C19.7716 15.1073 20.585 14.3012 21.5884 14.3012H24.2361C25.0941 14.3012 25.8315 14.8905 26.0273 15.6829C26.0522 15.7787 26.0695 15.8775 26.0782 15.9787C26.4394 20.6408 22.0958 25.8635 16.083 26.078C10.9906 26.2033 5.95406 22.1493 5.92765 16.0137C5.83263 10.9968 10.0446 6.09353 15.9442 5.99609C16.9147 5.95579 17.7341 6.70977 17.7745 7.68015ZM14.2161 16.1043C14.2161 15.1085 15.0243 14.3012 16.0202 14.3012C17.0161 14.3012 17.8244 15.1085 17.8244 16.1043C17.8244 17.1001 17.0161 17.9073 16.0202 17.9073C15.0243 17.9073 14.2161 17.1001 14.2161 16.1043Z",
    fill: "white"
  }), /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M17.7745 7.68015C17.8147 8.65052 17.0607 9.46984 16.0901 9.51015C11.9006 9.68411 9.34288 12.9674 9.46739 16.0849C9.50612 17.0553 8.76649 17.8735 7.79589 17.9122C6.82533 17.9509 5.97181 17.1678 5.93306 16.1973C5.73018 11.117 9.97264 6.09472 15.9442 5.99609C16.9147 5.95579 17.7341 6.70977 17.7745 7.68015Z",
    fill: "white",
    fillOpacity: "0.6"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M19.7716 16.1016C19.7716 15.1073 20.585 14.3012 21.5884 14.3012H24.2361C25.2395 14.3012 26.0781 15.1073 26.0781 16.1016C26.0781 17.096 25.2395 17.9021 24.2361 17.9021H21.5884C20.585 17.9021 19.7716 17.096 19.7716 16.1016Z",
    fill: "white",
    fillOpacity: "0.6"
  }));
};

exports.GridsomeIconLight = GridsomeIconLight;
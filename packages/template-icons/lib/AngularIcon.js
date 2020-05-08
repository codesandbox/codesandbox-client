

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AngularIconLight = exports.AngularIconDark = exports.AngularIcon = void 0;

const _react = _interopRequireDefault(require("react"));

const _SVGIcon = require("./SVGIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AngularIcon = function AngularIcon(_ref) {
  const props = { ..._ref};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    d: "M16 3.84003L4.08321 8.08963L5.90081 23.8464L16 29.44L26.0992 23.8464L27.9168 8.08963L16 3.84003Z",
    fill: "#DD0031"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M16 3.84003V6.68163V6.66883V19.6352V29.44L26.0992 23.8464L27.9168 8.08963L16 3.84003Z",
    fill: "#C3002F"
  }), /* #__PURE__ */_react.default.createElement("path", {
    d: "M16 6.66882L8.5504 23.3728H11.328L12.8256 19.6352H19.1488L20.6464 23.3728H23.424L16 6.66882ZM18.176 17.3312H13.824L16 12.096L18.176 17.3312Z",
    fill: "white"
  }));
};

exports.AngularIcon = AngularIcon;

const AngularIconDark = function AngularIconDark(_ref2) {
  const props = { ..._ref2};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M15.9168 6.8288V4L27.8336 8.2496L26.016 24.0064L15.9168 29.6V19.7952H19.0656L20.5632 23.5328H23.3408L15.9168 6.8288ZM15.9168 17.4912V12.256L18.0928 17.4912H15.9168Z",
    fill: "black"
  }), /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M15.9168 6.8288V4L4 8.2496L5.8176 24.0064L15.9168 29.6V19.7952H12.7424L11.2448 23.5328H8.46719L15.9168 6.8288ZM15.9168 12.256V12.256L13.7408 17.4912H15.9168V12.256Z",
    fill: "black",
    fillOpacity: "0.6"
  }));
};

exports.AngularIconDark = AngularIconDark;

const AngularIconLight = function AngularIconLight(_ref3) {
  const props = { ..._ref3};

  return /* #__PURE__ */_react.default.createElement(_SVGIcon.SVGIcon, props, /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M15.9168 6.8288V4L27.8336 8.2496L26.016 24.0064L15.9168 29.6V19.7952H19.0656L20.5632 23.5328H23.3408L15.9168 6.8288ZM15.9168 17.4912V12.256L18.0928 17.4912H15.9168Z",
    fill: "white"
  }), /* #__PURE__ */_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M15.9168 6.8288V4L4 8.2496L5.8176 24.0064L15.9168 29.6V19.7952H12.7424L11.2448 23.5328H8.46719L15.9168 6.8288ZM15.9168 12.256V12.256L13.7408 17.4912H15.9168V12.256Z",
    fill: "white",
    fillOpacity: "0.6"
  }));
};

exports.AngularIconLight = AngularIconLight;
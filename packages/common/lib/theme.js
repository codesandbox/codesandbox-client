'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const memoize_one_1 = require('memoize-one');
const Color = require('color');
const codesandbox = require('./themes/codesandbox.json');
const colorMethods = [
  'negate',
  'lighten',
  'darken',
  'saturate',
  'desaturate',
  'greyscale',
  'whiten',
  'blacken',
  'clearer',
  'opaquer',
  'rotate',
];
/**
 * Takes a selector that returns a color string and returns new decorated selector that calls the
 * original function to get the color and then modifies that color, ultimately returning another
 * color string.
 */
const addModifier = (fn, method, ...modifierArgs) => (...args) =>
  Color(fn(...args))
    [method](...modifierArgs)
    .rgbString();
/**
 * Add useful methods directly to selector function, as well as put an rgbString() call at the end
 * @param selector
 */
exports.decorateSelector = selector => {
  // add member functions to our selector
  colorMethods.forEach(method => {
    selector[method] = memoize_one_1.default((...args) =>
      exports.decorateSelector(addModifier(selector, method, ...args))
    );
  });
  return selector;
};
function createTheme(colors) {
  const transformed = Object.keys(colors)
    .map(c => ({ key: c, value: colors[c] }))
    .map(({ key, value }) => ({
      key,
      value: exports.decorateSelector(() => value),
    }))
    .reduce(
      (prev, { key, value }) => Object.assign({}, prev, { [key]: value }),
      {}
    );
  return transformed;
}
const theme = Object.assign(
  {},
  createTheme({
    background: '#24282A',
    background2: '#1C2022',
    background3: '#374140',
    background4: '#141618',
    background5: '#111518',
    primary: '#FFD399',
    primaryText: '#7F694C',
    secondary: '#40A9F3',
    shySecondary: '#66b9f4',
    white: '#E0E0E0',
    gray: '#C0C0C0',
    black: '#74757D',
    green: '#5da700',
    redBackground: '#400000',
    red: '#F27777',
    dangerBackground: '#DC3545',
  }),
  {
    vscodeTheme: codesandbox,
    new: createTheme({
      title: '#EEEEFF',
      description: '#777788',
      bg: '#2B2E41',
    }),
  }
);
exports.default = theme;

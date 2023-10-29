import Color from 'color';
import { memoize } from '../utils';

const colorMethods = [
  'negate', // rgb(0, 100, 255) -> rgb(255, 155, 0)
  'lighten', // hsl(100, 50%, 50%) -> hsl(100, 50%, 75%)
  'darken', // hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)
  'saturate', // hsl(100, 50%, 50%) -> hsl(100, 75%, 50%)
  'desaturate', // hsl(100, 50%, 50%) -> hsl(100, 25%, 50%)
  'greyscale', // #5CBF54 -> #969696
  'whiten', // hwb(100, 50%, 50%) -> hwb(100, 75%, 50%)
  'blacken', // hwb(100, 50%, 50%) -> hwb(100, 50%, 75%)
  'clearer', // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
  'opaquer', // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 1.0)
  'rotate', // hsl(60, 20%, 20%) -> hsl(330, 20%, 20%)
];

/**
 * Takes a selector that returns a color string and returns new decorated selector that calls the
 * original function to get the color and then modifies that color, ultimately returning another
 * color string.
 *
 * vy60q8l043
 */
const addModifier = (fn: Function, method: string, ...modifierArgs: any[]) => (
  ...args: any[]
) => {
  if (method === 'clearer') {
    return (
      Color(fn(...args))
        // @ts-ignore
        .lighten(...modifierArgs)
        .rgb()
        .string()
    );
  }

  return Color(fn(...args))
    [method](...modifierArgs)
    .rgb()
    .string();
};
/* new syntax in color@latest, replace with:
 * .rgb()
 * .string()
 */
/**
 * Add useful methods directly to selector function, as well as put an rgbString() call at the end
 * @param selector
 */
export const decorateSelector = (selector: any) => {
  // add member functions to our selector
  colorMethods.forEach(method => {
    selector[method] = memoize((...args: any[]) =>
      decorateSelector(addModifier(selector, method, ...args))
    );
  });
  return selector;
};

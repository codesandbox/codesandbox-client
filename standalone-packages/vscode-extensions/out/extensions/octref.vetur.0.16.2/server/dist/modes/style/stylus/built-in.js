"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const builtIn = [
    {
        name: 'red(color[, value])',
        desc: 'Return the red component of the given color, or set the red component to the optional second value argument.',
        insertText: 'red'
    },
    {
        name: 'green(color[, value])',
        desc: 'Return the green component of the given color, or set the green component to the optional second value argument.',
        insertText: 'green'
    },
    {
        name: 'blue(color[, value])',
        desc: 'Return the blue component of the given color, or set the blue component to the optional second value argument.',
        insertText: 'blue'
    },
    {
        name: 'alpha(color[, value])',
        desc: 'Return the alpha component of the given color, or set the alpha component to the optional second value argument.',
        insertText: 'alpha'
    },
    {
        name: 'dark(color)',
        desc: 'Check if color is dark:',
        insertText: 'dark'
    },
    {
        name: 'light(color)',
        desc: 'Check if color is light:',
        insertText: 'light'
    },
    {
        name: 'hue(color[, value])',
        desc: 'Return the hue of the given color, or set the hue component to the optional second value argument.',
        insertText: 'hue'
    },
    {
        name: 'saturation(color[, value])',
        desc: 'Return the saturation of the given color, or set the saturation component to the optional second value argument.',
        insertText: 'saturation'
    },
    {
        name: 'lightness(color[, value])',
        desc: 'Return the lightness of the given color, or set the lightness component to the optional second value argument.',
        insertText: 'lightness'
    },
    {
        name: 'push(expr, args…)',
        desc: 'Push the given args to expr.',
        insertText: 'push'
    },
    {
        name: 'pop(expr)',
        desc: 'Pop a value from expr.',
        insertText: 'pop'
    },
    {
        name: 'shift(expr)',
        desc: 'Shift an element from expr.',
        insertText: 'shift'
    },
    {
        name: 'unshift(expr, args…)',
        desc: 'Unshift the given args to expr.',
        insertText: 'unshift'
    },
    {
        name: 'index(list, value)',
        desc: 'Returns the index (zero-based) of a value within a list.',
        insertText: 'index'
    },
    {
        name: 'keys(pairs)',
        desc: 'Return keys in the given pairs:',
        insertText: 'keys'
    },
    {
        name: 'values(pairs)',
        desc: 'Return values in the given pairs:',
        insertText: 'values'
    },
    {
        name: 'list-separator(list)',
        desc: 'Return the separator of the given list.',
        insertText: 'list-separator'
    },
    {
        name: 'typeof(node)',
        desc: 'Return type of node as a string.',
        insertText: 'typeof'
    },
    {
        name: 'unit(unit[, type])',
        desc: 'Return a string for the type of unit or an empty string, or assign the given type without unit conversion.',
        insertText: 'unit'
    },
    {
        name: 'percentage(num)',
        desc: 'Convert a num to a percentage.',
        insertText: 'percentage'
    },
    {
        name: 'abs(unit)',
        desc: '  abs(-5px)\n  // => 5px\n\n  abs(5px)\n  // => 5px\n',
        insertText: 'abs'
    },
    {
        name: 'ceil(unit)',
        desc: '  ceil(5.5in)\n  // => 6in\n',
        insertText: 'ceil'
    },
    {
        name: 'floor(unit)',
        desc: '  floor(5.6px)\n  // => 5px\n',
        insertText: 'floor'
    },
    {
        name: 'round(unit)',
        desc: '  round(5.5px)\n  // => 6px\n\n  round(5.4px)\n  // => 5px\n',
        insertText: 'round'
    },
    {
        name: 'sin(angle)',
        desc: 'Returns the value of sine for the given angle. If the angle is given as a degree unit, like 45deg, it is treated as a degree, otherwise it is treated as radians.',
        insertText: 'sin'
    },
    {
        name: 'cos(angle)',
        desc: 'Returns the value of cosine for the given angle. If the angle is given as a degree unit, like 45deg, it is treated as a degree, otherwise it is treated as radians.',
        insertText: 'cos'
    },
    {
        name: 'tan(angle)',
        desc: 'Returns the value of tangent for the given angle. If the angle is given as a degree unit, like 45deg, it is treated as a degree, otherwise it is treated as radians.',
        insertText: 'tan'
    },
    {
        name: 'min(a, b)',
        desc: '  min(1, 5)\n  // => 1\n',
        insertText: 'min'
    },
    {
        name: 'max(a, b)',
        desc: '  max(1, 5)\n  // => 5\n',
        insertText: 'max'
    },
    {
        name: 'even(unit)',
        desc: '  even(6px)\n  // => true\n',
        insertText: 'even'
    },
    {
        name: 'odd(unit)',
        desc: '  odd(5mm)\n  // => true\n',
        insertText: 'odd'
    },
    {
        name: 'sum(nums)',
        desc: '  sum(1 2 3)\n  // => 6\n',
        insertText: 'sum'
    },
    {
        name: 'avg(nums)',
        desc: ' avg(1 2 3)\n // => 2\n',
        insertText: 'avg'
    },
    {
        name: 'range(start, stop[, step])',
        desc: 'Returns a list of units from start to stop (included) by given step. If step argument is omitted, it defaults to 1. The step must not be zero.',
        insertText: 'range'
    },
    {
        name: 'base-convert(num, base, width)',
        desc: 'Returns a Literal num converted to the provided base, padded to width with zeroes (default width is 2)',
        insertText: 'base-convert'
    },
    {
        name: 'match(pattern, string[, flags])',
        desc: 'Retrieves the matches when matching a val(string) against a pattern(regular expression).',
        insertText: 'match'
    },
    {
        name: 'replace(pattern, replacement, val)',
        desc: 'Returns string with all matches of pattern replaced by replacement in given val',
        insertText: 'replace'
    },
    {
        name: 'join(delim, vals…)',
        desc: 'Join the given vals with delim.',
        insertText: 'join'
    },
    {
        name: 'split(delim, val)',
        desc: 'The split()` method splits a string/ident into an array of strings by separating the string into substrings.',
        insertText: 'split'
    },
    {
        name: 'substr(val, start, length)',
        desc: 'The substr() method returns the characters in a string beginning at the specified location through the specified number of characters.',
        insertText: 'substr'
    },
    {
        name: 'slice(val, start[, end])',
        desc: 'The slice() method extracts a section of a string/list and returns a new string/list.',
        insertText: 'slice'
    },
    {
        name: 'hsla(color | h,s,l,a)',
        desc: 'Convert the given color to an HSLA node, or h,s,l,a component values.',
        insertText: 'hsla'
    },
    {
        name: 'hsl(color | h,s,l)',
        desc: 'Convert the given color to an HSLA node, or h,s,l,a component values.',
        insertText: 'hsl'
    },
    {
        name: 'rgba(color | r,g,b,a)',
        desc: 'Return RGBA from the r,g,b,a channels or provide a color to tweak the alpha.',
        insertText: 'rgba'
    },
    {
        name: 'rgb(color | r,g,b)',
        desc: 'Return a RGBA from the r,g,b channels or cast to an RGBA node.',
        insertText: 'rgb'
    },
    {
        name: 'blend(top[, bottom])',
        desc: 'Blends the given top color over the bottom one using the normal blending. The bottom argument is optional and is defaulted to #fff.',
        insertText: 'blend'
    },
    {
        name: 'lighten(color, amount)',
        desc: 'Lighten the given color by amount. This function is unit-sensitive, for example supporting percentages as shown below.',
        insertText: 'lighten'
    },
    {
        name: 'darken(color, amount)',
        desc: 'Darken the given color by amount.This function is unit-sensitive, for example supporting percentages as shown below.',
        insertText: 'darken'
    },
    {
        name: 'desaturate(color, amount)',
        desc: 'Desaturate the given color by amount.',
        insertText: 'desaturate'
    },
    {
        name: 'saturate(color, amount)',
        desc: 'Saturate the given color by amount.',
        insertText: 'saturate'
    },
    {
        name: 'complement(color)',
        desc: 'Gives the complementary color. Equals to spinning hue to 180deg.',
        insertText: 'complement'
    },
    {
        name: 'invert(color)',
        desc: 'Inverts the color. The red, green, and blue values are inverted, while the opacity is left alone.',
        insertText: 'invert'
    },
    {
        name: 'spin(color, amount)',
        desc: 'Spins hue of the given color by amount.',
        insertText: 'spin'
    },
    {
        name: 'grayscale(color)',
        desc: 'Gives the grayscale equivalent of the given color. Equals to desaturate by 100%.',
        insertText: 'grayscale'
    },
    {
        name: 'mix(color1, color2[, amount])',
        desc: 'Mix two colors by a given amount. The amount is optional and is defaulted to 50%.',
        insertText: 'mix'
    },
    {
        name: 'tint(color, amount)',
        desc: 'Mix the given color with white.',
        insertText: 'tint'
    },
    {
        name: 'shade(color, amount)',
        desc: 'Mix the given color with black.',
        insertText: 'shade'
    },
    {
        name: 'luminosity(color)',
        desc: 'Returns the relative luminance of the given color.',
        insertText: 'luminosity'
    },
    {
        name: 'contrast(top[, bottom])',
        desc: 'Returns the contrast ratio object between top and bottom colors, based on script underlying “contrast ratio” tool by Lea Verou.',
        insertText: 'contrast'
    },
    {
        name: 'transparentify(top[, bottom, alpha])',
        desc: 'Returns the transparent version of the given top color, as if it was blend over the given bottom color (or the closest to it, if it is possible).',
        insertText: 'transparentify'
    },
    {
        name: 'unquote(str | ident)',
        desc: 'Unquote the given str and returned as a Literal node.',
        insertText: 'unquote'
    },
    {
        name: 'convert(str)',
        desc: 'Like unquote() but tries to convert the given str to a Stylus node.',
        insertText: 'convert'
    },
    {
        name: 's(fmt, …)',
        desc: 'The s() function is similar to unquote(), in that it returns a Literal node, however it accepts a format string much like C’s sprintf(). Currently the only specifier is %s.',
        insertText: 's'
    },
    {
        name: 'basename(path[, ext])',
        desc: 'Returns the basename of path, (optionally) with ext extension removed.',
        insertText: 'basename'
    },
    {
        name: 'dirname(path)',
        desc: 'Returns the dirname of path.',
        insertText: 'dirname'
    },
    {
        name: 'extname(path)',
        desc: 'Returns the filename extension of path including the dot.',
        insertText: 'extname'
    },
    {
        name: 'pathjoin(…)',
        desc: 'Peform a path join.',
        insertText: 'pathjoin'
    },
    {
        name: 'current-media()',
        desc: "current-media() function returns the string of the current block’s @media rule or '' if there is no @media above the block.",
        insertText: 'current-media'
    },
    {
        name: '+cache(keys…)',
        desc: '+cache is a really powerful built-in function that allows you to create your own “cachable” mixins.',
        insertText: '+cache'
    },
    {
        name: '+prefix-classes(prefix)',
        desc: 'Stylus comes with a block mixin prefix-classes that can be used for prefixing the classes inside any given Stylus’ block. For example:',
        insertText: '+prefix-classes'
    },
    {
        name: 'lookup(name)',
        desc: 'Allows to lookup a variable with a given name, passed as a string. Returns null if the variable is undefined.',
        insertText: 'lookup(name)'
    },
    {
        name: 'define(name, expr[, global])',
        desc: 'Allows to create or overwrite a variable with a given name, passed as a string, onto current scope (or global scope if global is true).',
        insertText: 'define'
    },
    {
        name: 'operate(op, left, right)',
        desc: 'Perform the given op on the left and right operands:',
        insertText: 'operate'
    },
    {
        name: 'length([expr])',
        desc: 'Parenthesized expressions may act as tuples, the length() function returns the length of such expressions.',
        insertText: 'length'
    },
    {
        name: 'selector()',
        desc: 'Returns the compiled current selector or & if called at root level.',
        insertText: 'selector'
    },
    {
        name: 'selector-exists(selector)',
        desc: 'Returns true if the given selector exists.',
        insertText: 'selector-exists'
    },
    {
        name: 'warn(msg)',
        desc: 'Warn with the given error msg, does not exit.',
        insertText: 'warn'
    },
    {
        name: 'error(msg)',
        desc: 'Exits with the given error msg.',
        insertText: 'error'
    },
    {
        name: 'last(expr)',
        desc: 'Return the last value in the given expr:',
        insertText: 'last'
    },
    {
        name: 'p(expr)',
        desc: 'Inspect the given expr:',
        insertText: 'p'
    },
    {
        name: 'opposite-position(positions)',
        desc: 'Return the opposites of the given positions.',
        insertText: 'opposite-position'
    },
    {
        name: 'image-size(path)',
        desc: 'Returns the width and height of the image found at path. Lookups are performed in the same manner as @import, altered by the paths setting.',
        insertText: 'image-size'
    },
    {
        name: 'embedurl(path[, encoding])',
        desc: 'Returns an inline image as a url() literal, encoded with encoding (available encodings: base64 (default), and utf8).',
        insertText: 'embedurl'
    },
    {
        name: 'add-property(name, expr)',
        desc: 'Adds property name, with the given expr to the closest block.',
        insertText: 'add-property'
    },
    {
        name: 'json(path[, options])',
        desc: 'Convert a .json file into stylus variables or an object. Nested variable object keys are joined with a dash (-).',
        insertText: 'json'
    },
    {
        name: 'use(path)',
        desc: 'You can use any given js-plugin at given path with use() function right inside your ‘.styl’ files, like this:',
        insertText: 'use'
    }
];
exports.default = builtIn.map(item => {
    const completionItem = vscode_languageserver_types_1.CompletionItem.create(item.insertText);
    completionItem.detail = item.name;
    completionItem.insertText = item.insertText;
    completionItem.documentation = item.desc;
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Function;
    return completionItem;
});
//# sourceMappingURL=built-in.js.map
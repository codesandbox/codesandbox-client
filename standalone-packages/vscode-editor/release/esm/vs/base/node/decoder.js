/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as sd from '../../../string_decoder.js';
/**
 * Convenient way to iterate over output line by line. This helper accommodates for the fact that
 * a buffer might not end with new lines all the way.
 *
 * To use:
 * - call the write method
 * - forEach() over the result to get the lines
 */
var LineDecoder = /** @class */ (function () {
    function LineDecoder(encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        this.stringDecoder = new sd.StringDecoder(encoding);
        this.remaining = null;
    }
    LineDecoder.prototype.write = function (buffer) {
        var result = [];
        var value = this.remaining
            ? this.remaining + this.stringDecoder.write(buffer)
            : this.stringDecoder.write(buffer);
        if (value.length < 1) {
            return result;
        }
        var start = 0;
        var ch;
        var idx = start;
        while (idx < value.length) {
            ch = value.charCodeAt(idx);
            if (ch === 13 /* CarriageReturn */ || ch === 10 /* LineFeed */) {
                result.push(value.substring(start, idx));
                idx++;
                if (idx < value.length) {
                    var lastChar = ch;
                    ch = value.charCodeAt(idx);
                    if ((lastChar === 13 /* CarriageReturn */ && ch === 10 /* LineFeed */) || (lastChar === 10 /* LineFeed */ && ch === 13 /* CarriageReturn */)) {
                        idx++;
                    }
                }
                start = idx;
            }
            else {
                idx++;
            }
        }
        this.remaining = start < value.length ? value.substr(start) : null;
        return result;
    };
    LineDecoder.prototype.end = function () {
        return this.remaining;
    };
    return LineDecoder;
}());
export { LineDecoder };

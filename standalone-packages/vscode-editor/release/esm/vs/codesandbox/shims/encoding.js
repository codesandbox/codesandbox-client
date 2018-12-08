/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as stream from '../../base/node/stream.js';
import { TPromise } from '../../base/common/winjs.base.js';
export var UTF8 = 'utf8';
export var UTF8_with_bom = 'utf8bom';
export var UTF16be = 'utf16be';
export var UTF16le = 'utf16le';
export function bomLength(encoding) {
    switch (encoding) {
        case UTF8:
            return 3;
        case UTF16be:
        case UTF16le:
            return 2;
    }
    return 0;
}
export function detectEncodingByBOMFromBuffer(buffer, bytesRead) {
    if (!buffer || bytesRead < 2) {
        return null;
    }
    var b0 = buffer.readUInt8(0);
    var b1 = buffer.readUInt8(1);
    // UTF-16 BE
    if (b0 === 0xFE && b1 === 0xFF) {
        return UTF16be;
    }
    // UTF-16 LE
    if (b0 === 0xFF && b1 === 0xFE) {
        return UTF16le;
    }
    if (bytesRead < 3) {
        return null;
    }
    var b2 = buffer.readUInt8(2);
    // UTF-8
    if (b0 === 0xEF && b1 === 0xBB && b2 === 0xBF) {
        return UTF8;
    }
    return null;
}
/**
 * Detects the Byte Order Mark in a given file.
 * If no BOM is detected, null will be passed to callback.
 */
export function detectEncodingByBOM(file) {
    return stream.readExactlyByFile(file, 3).then(function (_a) {
        var buffer = _a.buffer, bytesRead = _a.bytesRead;
        return detectEncodingByBOMFromBuffer(buffer, bytesRead);
    });
}
var MINIMUM_THRESHOLD = 0.2;
var IGNORE_ENCODINGS = ['ascii', 'utf-8', 'utf-16', 'utf-32'];
/**
 * Guesses the encoding from buffer.
 */
export function guessEncodingByBuffer(buffer) {
    return TPromise.wrap(import('../../../jschardet.js')).then(function (jschardet) {
        jschardet.Constants.MINIMUM_THRESHOLD = MINIMUM_THRESHOLD;
        var guessed = jschardet.detect(buffer);
        if (!guessed || !guessed.encoding) {
            return null;
        }
        var enc = guessed.encoding.toLowerCase();
        // Ignore encodings that cannot guess correctly
        // (http://chardet.readthedocs.io/en/latest/supported-encodings.html)
        if (0 <= IGNORE_ENCODINGS.indexOf(enc)) {
            return null;
        }
        return toIconvLiteEncoding(guessed.encoding);
    });
}
var JSCHARDET_TO_ICONV_ENCODINGS = {
    'ibm866': 'cp866',
    'big5': 'cp950'
};
function toIconvLiteEncoding(encodingName) {
    var normalizedEncodingName = encodingName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    var mapped = JSCHARDET_TO_ICONV_ENCODINGS[normalizedEncodingName];
    return mapped || normalizedEncodingName;
}
/**
 * The encodings that are allowed in a settings file don't match the canonical encoding labels specified by WHATWG.
 * See https://encoding.spec.whatwg.org/#names-and-labels
 * Iconv-lite strips all non-alphanumeric characters, but ripgrep doesn't. For backcompat, allow these labels.
 */
export function toCanonicalName(enc) {
    switch (enc) {
        case 'shiftjis':
            return 'shift-jis';
        case 'utf16le':
            return 'utf-16le';
        case 'utf16be':
            return 'utf-16be';
        case 'big5hkscs':
            return 'big5-hkscs';
        case 'eucjp':
            return 'euc-jp';
        case 'euckr':
            return 'euc-kr';
        case 'koi8r':
            return 'koi8-r';
        case 'koi8u':
            return 'koi8-u';
        case 'macroman':
            return 'x-mac-roman';
        case 'utf8bom':
            return 'utf8';
        default:
            var m = enc.match(/windows(\d+)/);
            if (m) {
                return 'windows-' + m[1];
            }
            return enc;
    }
}
var ZERO_BYTE_DETECTION_BUFFER_MAX_LEN = 512; // number of bytes to look at to decide about a file being binary or not
export function detectEncodingFromBuffer(_a, autoGuessEncoding) {
    var buffer = _a.buffer, bytesRead = _a.bytesRead;
    // Always first check for BOM to find out about encoding
    var encoding = detectEncodingByBOMFromBuffer(buffer, bytesRead);
    // Detect 0 bytes to see if file is binary or UTF-16 LE/BE
    // unless we already know that this file has a UTF-16 encoding
    var seemsBinary = false;
    if (encoding !== UTF16be && encoding !== UTF16le) {
        var couldBeUTF16LE = true; // e.g. 0xAA 0x00
        var couldBeUTF16BE = true; // e.g. 0x00 0xAA
        var containsZeroByte = false;
        // This is a simplified guess to detect UTF-16 BE or LE by just checking if
        // the first 512 bytes have the 0-byte at a specific location. For UTF-16 LE
        // this would be the odd byte index and for UTF-16 BE the even one.
        // Note: this can produce false positives (a binary file that uses a 2-byte
        // encoding of the same format as UTF-16) and false negatives (a UTF-16 file
        // that is using 4 bytes to encode a character).
        for (var i = 0; i < bytesRead && i < ZERO_BYTE_DETECTION_BUFFER_MAX_LEN; i++) {
            var isEndian = (i % 2 === 1); // assume 2-byte sequences typical for UTF-16
            var isZeroByte = (buffer.readInt8(i) === 0);
            if (isZeroByte) {
                containsZeroByte = true;
            }
            // UTF-16 LE: expect e.g. 0xAA 0x00
            if (couldBeUTF16LE && (isEndian && !isZeroByte || !isEndian && isZeroByte)) {
                couldBeUTF16LE = false;
            }
            // UTF-16 BE: expect e.g. 0x00 0xAA
            if (couldBeUTF16BE && (isEndian && isZeroByte || !isEndian && !isZeroByte)) {
                couldBeUTF16BE = false;
            }
            // Return if this is neither UTF16-LE nor UTF16-BE and thus treat as binary
            if (isZeroByte && !couldBeUTF16LE && !couldBeUTF16BE) {
                break;
            }
        }
        // Handle case of 0-byte included
        if (containsZeroByte) {
            if (couldBeUTF16LE) {
                encoding = UTF16le;
            }
            else if (couldBeUTF16BE) {
                encoding = UTF16be;
            }
            else {
                seemsBinary = true;
            }
        }
    }
    // Auto guess encoding if configured
    if (autoGuessEncoding && !seemsBinary && !encoding) {
        return guessEncodingByBuffer(buffer.slice(0, bytesRead)).then(function (guessedEncoding) {
            return {
                seemsBinary: false,
                encoding: guessedEncoding
            };
        });
    }
    return { seemsBinary: seemsBinary, encoding: encoding };
}

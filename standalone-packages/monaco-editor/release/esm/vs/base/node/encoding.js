/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as stream from './stream.js';
import * as iconv from '../../../iconv-lite.js';
import { TPromise } from '../common/winjs.base.js';
import { isLinux, isMacintosh } from '../common/platform.js';
import { exec } from '../../../child_process.js';
import { Writable } from '../../../stream.js';
export var UTF8 = 'utf8';
export var UTF8_with_bom = 'utf8bom';
export var UTF16be = 'utf16be';
export var UTF16le = 'utf16le';
export function toDecodeStream(readable, options) {
    if (!options.minBytesRequiredForDetection) {
        options.minBytesRequiredForDetection = options.guessEncoding ? AUTO_GUESS_BUFFER_MAX_LEN : NO_GUESS_BUFFER_MAX_LEN;
    }
    if (!options.overwriteEncoding) {
        options.overwriteEncoding = function (detected) { return detected || UTF8; };
    }
    return new TPromise(function (resolve, reject) {
        readable.pipe(new /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1(opts) {
                var _this = _super.call(this, opts) || this;
                _this._buffer = [];
                _this._bytesBuffered = 0;
                _this.once('finish', function () { return _this._finish(); });
                return _this;
            }
            class_1.prototype._write = function (chunk, encoding, callback) {
                if (!Buffer.isBuffer(chunk)) {
                    callback(new Error('data must be a buffer'));
                }
                if (this._decodeStream) {
                    // just a forwarder now
                    this._decodeStream.write(chunk, callback);
                    return;
                }
                this._buffer.push(chunk);
                this._bytesBuffered += chunk.length;
                if (this._decodeStreamConstruction) {
                    // waiting for the decoder to be ready
                    this._decodeStreamConstruction.then(function (_) { return callback(); }, function (err) { return callback(err); });
                }
                else if (this._bytesBuffered >= options.minBytesRequiredForDetection) {
                    // buffered enough data, create stream and forward data
                    this._startDecodeStream(callback);
                }
                else {
                    // only buffering
                    callback();
                }
            };
            class_1.prototype._startDecodeStream = function (callback) {
                var _this = this;
                this._decodeStreamConstruction = TPromise.as(detectEncodingFromBuffer({
                    buffer: Buffer.concat(this._buffer), bytesRead: this._bytesBuffered
                }, options.guessEncoding)).then(function (detected) {
                    detected.encoding = options.overwriteEncoding(detected.encoding);
                    _this._decodeStream = decodeStream(detected.encoding);
                    for (var _i = 0, _a = _this._buffer; _i < _a.length; _i++) {
                        var buffer = _a[_i];
                        _this._decodeStream.write(buffer);
                    }
                    callback();
                    resolve({ detected: detected, stream: _this._decodeStream });
                }, function (err) {
                    _this.emit('error', err);
                    callback(err);
                });
            };
            class_1.prototype._finish = function () {
                var _this = this;
                if (this._decodeStream) {
                    // normal finish
                    this._decodeStream.end();
                }
                else {
                    // we were still waiting for data...
                    this._startDecodeStream(function () { return _this._decodeStream.end(); });
                }
            };
            return class_1;
        }(Writable)));
    });
}
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
export function decode(buffer, encoding) {
    return iconv.decode(buffer, toNodeEncoding(encoding));
}
export function encode(content, encoding, options) {
    return iconv.encode(content, toNodeEncoding(encoding), options);
}
export function encodingExists(encoding) {
    return iconv.encodingExists(toNodeEncoding(encoding));
}
export function decodeStream(encoding) {
    return iconv.decodeStream(toNodeEncoding(encoding));
}
export function encodeStream(encoding, options) {
    return iconv.encodeStream(toNodeEncoding(encoding), options);
}
function toNodeEncoding(enc) {
    if (enc === UTF8_with_bom) {
        return UTF8; // iconv does not distinguish UTF 8 with or without BOM, so we need to help it
    }
    return enc;
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
var NO_GUESS_BUFFER_MAX_LEN = 512; // when not auto guessing the encoding, small number of bytes are enough
var AUTO_GUESS_BUFFER_MAX_LEN = 512 * 8; // with auto guessing we want a lot more content to be read for guessing
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
// https://ss64.com/nt/chcp.html
var windowsTerminalEncodings = {
    '437': 'cp437',
    '850': 'cp850',
    '852': 'cp852',
    '855': 'cp855',
    '857': 'cp857',
    '860': 'cp860',
    '861': 'cp861',
    '863': 'cp863',
    '865': 'cp865',
    '866': 'cp866',
    '869': 'cp869',
    '936': 'cp936',
    '1252': 'cp1252' // West European Latin
};
export function resolveTerminalEncoding(verbose) {
    var rawEncodingPromise;
    // Support a global environment variable to win over other mechanics
    var cliEncodingEnv = process.env['VSCODE_CLI_ENCODING'];
    if (cliEncodingEnv) {
        if (verbose) {
            console.log("Found VSCODE_CLI_ENCODING variable: " + cliEncodingEnv);
        }
        rawEncodingPromise = TPromise.as(cliEncodingEnv);
    }
    // Linux/Mac: use "locale charmap" command
    else if (isLinux || isMacintosh) {
        rawEncodingPromise = new TPromise(function (c) {
            if (verbose) {
                console.log('Running "locale charmap" to detect terminal encoding...');
            }
            exec('locale charmap', function (err, stdout, stderr) { return c(stdout); });
        });
    }
    // Windows: educated guess
    else {
        rawEncodingPromise = new TPromise(function (c) {
            if (verbose) {
                console.log('Running "chcp" to detect terminal encoding...');
            }
            exec('chcp', function (err, stdout, stderr) {
                if (stdout) {
                    var windowsTerminalEncodingKeys = Object.keys(windowsTerminalEncodings);
                    for (var i = 0; i < windowsTerminalEncodingKeys.length; i++) {
                        var key = windowsTerminalEncodingKeys[i];
                        if (stdout.indexOf(key) >= 0) {
                            return c(windowsTerminalEncodings[key]);
                        }
                    }
                }
                return c(void 0);
            });
        });
    }
    return rawEncodingPromise.then(function (rawEncoding) {
        if (verbose) {
            console.log("Detected raw terminal encoding: " + rawEncoding);
        }
        if (!rawEncoding || rawEncoding.toLowerCase() === 'utf-8' || rawEncoding.toLowerCase() === UTF8) {
            return UTF8;
        }
        var iconvEncoding = toIconvLiteEncoding(rawEncoding);
        if (iconv.encodingExists(iconvEncoding)) {
            return iconvEncoding;
        }
        if (verbose) {
            console.log('Unsupported terminal encoding, falling back to UTF-8.');
        }
        return UTF8;
    });
}

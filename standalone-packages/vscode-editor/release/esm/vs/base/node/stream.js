/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as fs from '../../../fs.js';
import { TPromise } from '../common/winjs.base.js';
/**
 * Reads totalBytes from the provided file.
 */
export function readExactlyByFile(file, totalBytes) {
    return new TPromise(function (complete, error) {
        fs.open(file, 'r', null, function (err, fd) {
            if (err) {
                return error(err);
            }
            function end(err, resultBuffer, bytesRead) {
                fs.close(fd, function (closeError) {
                    if (closeError) {
                        return error(closeError);
                    }
                    if (err && err.code === 'EISDIR') {
                        return error(err); // we want to bubble this error up (file is actually a folder)
                    }
                    return complete({ buffer: resultBuffer, bytesRead: bytesRead });
                });
            }
            var buffer = Buffer.allocUnsafe(totalBytes);
            var offset = 0;
            function readChunk() {
                fs.read(fd, buffer, offset, totalBytes - offset, null, function (err, bytesRead) {
                    if (err) {
                        return end(err, null, 0);
                    }
                    if (bytesRead === 0) {
                        return end(null, buffer, offset);
                    }
                    offset += bytesRead;
                    if (offset === totalBytes) {
                        return end(null, buffer, offset);
                    }
                    return readChunk();
                });
            }
            readChunk();
        });
    });
}
/**
 * Reads a file until a matching string is found.
 *
 * @param file The file to read.
 * @param matchingString The string to search for.
 * @param chunkBytes The number of bytes to read each iteration.
 * @param maximumBytesToRead The maximum number of bytes to read before giving up.
 * @param callback The finished callback.
 */
export function readToMatchingString(file, matchingString, chunkBytes, maximumBytesToRead) {
    return new TPromise(function (complete, error) {
        return fs.open(file, 'r', null, function (err, fd) {
            if (err) {
                return error(err);
            }
            function end(err, result) {
                fs.close(fd, function (closeError) {
                    if (closeError) {
                        return error(closeError);
                    }
                    if (err && err.code === 'EISDIR') {
                        return error(err); // we want to bubble this error up (file is actually a folder)
                    }
                    return complete(result);
                });
            }
            var buffer = Buffer.allocUnsafe(maximumBytesToRead);
            var offset = 0;
            function readChunk() {
                fs.read(fd, buffer, offset, chunkBytes, null, function (err, bytesRead) {
                    if (err) {
                        return end(err, null);
                    }
                    if (bytesRead === 0) {
                        return end(null, null);
                    }
                    offset += bytesRead;
                    var newLineIndex = buffer.indexOf(matchingString);
                    if (newLineIndex >= 0) {
                        return end(null, buffer.toString('utf8').substr(0, newLineIndex));
                    }
                    if (offset >= maximumBytesToRead) {
                        return end(new Error("Could not find " + matchingString + " in first " + maximumBytesToRead + " bytes of " + file), null);
                    }
                    return readChunk();
                });
            }
            readChunk();
        });
    });
}

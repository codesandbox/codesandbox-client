"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
var stream_1 = require("stream");
var consolePatchFunction = function (originalConsole) {
    var aiLoggingOutStream = new stream_1.Writable();
    var aiLoggingErrStream = new stream_1.Writable();
    // Default console is roughly equivalent to `new Console(process.stdout, process.stderr)`
    // We create a version which publishes to the channel and also to stdout/stderr
    aiLoggingOutStream.write = function (chunk) {
        if (!chunk) {
            return true;
        }
        var message = chunk.toString();
        diagnostic_channel_1.channel.publish("console", { message: message });
        return true;
    };
    aiLoggingErrStream.write = function (chunk) {
        if (!chunk) {
            return true;
        }
        var message = chunk.toString();
        diagnostic_channel_1.channel.publish("console", { message: message, stderr: true });
        return true;
    };
    var aiLoggingConsole = new originalConsole.Console(aiLoggingOutStream, aiLoggingErrStream);
    var consoleMethods = ["log", "info", "warn", "error", "dir", "time", "timeEnd", "trace", "assert"];
    var _loop_1 = function (method) {
        var originalMethod = originalConsole[method];
        if (originalMethod) {
            originalConsole[method] = function () {
                if (aiLoggingConsole[method]) {
                    try {
                        aiLoggingConsole[method].apply(aiLoggingConsole, arguments);
                    }
                    catch (e) {
                        // Ignore errors; allow the original method to throw if necessary
                    }
                }
                return originalMethod.apply(originalConsole, arguments);
            };
        }
    };
    for (var _i = 0, consoleMethods_1 = consoleMethods; _i < consoleMethods_1.length; _i++) {
        var method = consoleMethods_1[_i];
        _loop_1(method);
    }
    return originalConsole;
};
exports.console = {
    versionSpecifier: ">= 4.0.0",
    patch: consolePatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("console", exports.console);
    // Force patching of console
    /* tslint:disable-next-line:no-var-requires */
    require("console");
}
exports.enable = enable;
//# sourceMappingURL=console.pub.js.map
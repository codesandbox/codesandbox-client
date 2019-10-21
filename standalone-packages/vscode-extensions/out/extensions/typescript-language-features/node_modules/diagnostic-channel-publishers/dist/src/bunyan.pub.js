"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
var bunyanPatchFunction = function (originalBunyan) {
    var originalEmit = originalBunyan.prototype._emit;
    originalBunyan.prototype._emit = function (rec, noemit) {
        var ret = originalEmit.apply(this, arguments);
        if (!noemit) {
            var str = ret;
            if (!str) {
                str = originalEmit.call(this, rec, true);
            }
            diagnostic_channel_1.channel.publish("bunyan", { level: rec.level, result: str });
        }
        return ret;
    };
    return originalBunyan;
};
exports.bunyan = {
    versionSpecifier: ">= 1.0.0 < 2.0.0",
    patch: bunyanPatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("bunyan", exports.bunyan);
}
exports.enable = enable;
//# sourceMappingURL=bunyan.pub.js.map
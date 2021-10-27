"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var diagnostic_channel_1 = require("diagnostic-channel");
var redisPatchFunction = function (originalRedis) {
    var originalSend = originalRedis.RedisClient.prototype.internal_send_command;
    // Note: This is mixing together both context tracking and dependency tracking
    originalRedis.RedisClient.prototype.internal_send_command = function (commandObj) {
        if (commandObj) {
            var cb_1 = commandObj.callback;
            if (!cb_1 || !cb_1.pubsubBound) {
                var address_1 = this.address;
                var startTime_1 = process.hrtime();
                // Note: augmenting the callback on internal_send_command is correct for context
                // tracking, but may be too low-level for dependency tracking. There are some 'errors'
                // which higher levels expect in some cases
                // However, the only other option is to intercept every individual command.
                commandObj.callback = diagnostic_channel_1.channel.bindToContext(function (err, result) {
                    var hrDuration = process.hrtime(startTime_1);
                    /* tslint:disable-next-line:no-bitwise */
                    var duration = (hrDuration[0] * 1e3 + hrDuration[1] / 1e6) | 0;
                    diagnostic_channel_1.channel.publish("redis", { duration: duration, address: address_1, commandObj: commandObj, err: err, result: result });
                    if (typeof cb_1 === "function") {
                        cb_1.apply(this, arguments);
                    }
                });
                commandObj.callback.pubsubBound = true;
            }
        }
        return originalSend.call(this, commandObj);
    };
    return originalRedis;
};
exports.redis = {
    versionSpecifier: ">= 2.0.0 < 3.0.0",
    patch: redisPatchFunction,
};
function enable() {
    diagnostic_channel_1.channel.registerMonkeyPatch("redis", exports.redis);
}
exports.enable = enable;
//# sourceMappingURL=redis.pub.js.map
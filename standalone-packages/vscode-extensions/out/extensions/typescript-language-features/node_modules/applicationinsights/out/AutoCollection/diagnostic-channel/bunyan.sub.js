"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Contracts_1 = require("../../Declarations/Contracts");
var diagnostic_channel_1 = require("diagnostic-channel");
var clients = [];
// Mapping from bunyan levels defined at https://github.com/trentm/node-bunyan/blob/master/lib/bunyan.js#L256
var bunyanToAILevelMap = {
    10: Contracts_1.SeverityLevel.Verbose,
    20: Contracts_1.SeverityLevel.Verbose,
    30: Contracts_1.SeverityLevel.Information,
    40: Contracts_1.SeverityLevel.Warning,
    50: Contracts_1.SeverityLevel.Error,
    60: Contracts_1.SeverityLevel.Critical,
};
var subscriber = function (event) {
    clients.forEach(function (client) {
        var AIlevel = bunyanToAILevelMap[event.data.level];
        client.trackTrace({ message: event.data.result, severity: AIlevel });
    });
};
function enable(enabled, client) {
    if (enabled) {
        if (clients.length === 0) {
            diagnostic_channel_1.channel.subscribe("bunyan", subscriber);
        }
        ;
        clients.push(client);
    }
    else {
        clients = clients.filter(function (c) { return c != client; });
        if (clients.length === 0) {
            diagnostic_channel_1.channel.unsubscribe("bunyan", subscriber);
        }
    }
}
exports.enable = enable;
//# sourceMappingURL=bunyan.sub.js.map
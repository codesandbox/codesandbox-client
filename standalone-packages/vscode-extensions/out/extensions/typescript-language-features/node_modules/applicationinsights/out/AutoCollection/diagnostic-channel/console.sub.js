"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Contracts_1 = require("../../Declarations/Contracts");
var diagnostic_channel_1 = require("diagnostic-channel");
var clients = [];
var subscriber = function (event) {
    clients.forEach(function (client) {
        // Message can have a trailing newline
        var message = event.data.message;
        if (message.lastIndexOf("\n") == message.length - 1) {
            message = message.substring(0, message.length - 1);
        }
        client.trackTrace({ message: message, severity: (event.data.stderr ? Contracts_1.SeverityLevel.Warning : Contracts_1.SeverityLevel.Information) });
    });
};
function enable(enabled, client) {
    if (enabled) {
        if (clients.length === 0) {
            diagnostic_channel_1.channel.subscribe("console", subscriber);
        }
        ;
        clients.push(client);
    }
    else {
        clients = clients.filter(function (c) { return c != client; });
        if (clients.length === 0) {
            diagnostic_channel_1.channel.unsubscribe("console", subscriber);
        }
    }
}
exports.enable = enable;
//# sourceMappingURL=console.sub.js.map
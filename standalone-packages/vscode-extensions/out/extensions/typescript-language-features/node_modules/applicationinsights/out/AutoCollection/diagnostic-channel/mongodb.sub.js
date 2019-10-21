"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var diagnostic_channel_1 = require("diagnostic-channel");
var clients = [];
exports.subscriber = function (event) {
    clients.forEach(function (client) {
        var dbName = (event.data.startedData && event.data.startedData.databaseName) || "Unknown database";
        client.trackDependency({
            target: dbName,
            data: event.data.event.commandName,
            name: event.data.event.commandName,
            duration: event.data.event.duration,
            success: event.data.succeeded,
            /* TODO: transmit result code from mongo */
            resultCode: event.data.succeeded ? "0" : "1",
            dependencyTypeName: 'mongodb'
        });
    });
};
function enable(enabled, client) {
    if (enabled) {
        if (clients.length === 0) {
            diagnostic_channel_1.channel.subscribe("mongodb", exports.subscriber);
        }
        ;
        clients.push(client);
    }
    else {
        clients = clients.filter(function (c) { return c != client; });
        if (clients.length === 0) {
            diagnostic_channel_1.channel.unsubscribe("mongodb", exports.subscriber);
        }
    }
}
exports.enable = enable;
//# sourceMappingURL=mongodb.sub.js.map
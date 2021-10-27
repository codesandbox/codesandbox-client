"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var diagnostic_channel_1 = require("diagnostic-channel");
var clients = [];
exports.subscriber = function (event) {
    clients.forEach(function (client) {
        var queryObj = event.data.query || {};
        var sqlString = queryObj.sql || "Unknown query";
        var success = !event.data.err;
        var connection = queryObj._connection || {};
        var connectionConfig = connection.config || {};
        var dbName = connectionConfig.socketPath ? connectionConfig.socketPath : (connectionConfig.host || "localhost") + ":" + connectionConfig.port;
        client.trackDependency({
            target: dbName,
            data: sqlString,
            name: sqlString,
            duration: event.data.duration,
            success: success,
            /* TODO: transmit result code from mysql */
            resultCode: success ? "0" : "1",
            dependencyTypeName: "mysql"
        });
    });
};
function enable(enabled, client) {
    if (enabled) {
        if (clients.length === 0) {
            diagnostic_channel_1.channel.subscribe("mysql", exports.subscriber);
        }
        ;
        clients.push(client);
    }
    else {
        clients = clients.filter(function (c) { return c != client; });
        if (clients.length === 0) {
            diagnostic_channel_1.channel.unsubscribe("mysql", exports.subscriber);
        }
    }
}
exports.enable = enable;
//# sourceMappingURL=mysql.sub.js.map
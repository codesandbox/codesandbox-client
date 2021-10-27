"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Contracts_1 = require("../../Declarations/Contracts");
var diagnostic_channel_1 = require("diagnostic-channel");
var clients = [];
var winstonToAILevelMap = {
    syslog: function (og) {
        var map = {
            emerg: Contracts_1.SeverityLevel.Critical,
            alert: Contracts_1.SeverityLevel.Critical,
            crit: Contracts_1.SeverityLevel.Critical,
            error: Contracts_1.SeverityLevel.Error,
            warning: Contracts_1.SeverityLevel.Warning,
            notice: Contracts_1.SeverityLevel.Information,
            info: Contracts_1.SeverityLevel.Information,
            debug: Contracts_1.SeverityLevel.Verbose
        };
        return map[og] === undefined ? Contracts_1.SeverityLevel.Information : map[og];
    },
    npm: function (og) {
        var map = {
            error: Contracts_1.SeverityLevel.Error,
            warn: Contracts_1.SeverityLevel.Warning,
            info: Contracts_1.SeverityLevel.Information,
            verbose: Contracts_1.SeverityLevel.Verbose,
            debug: Contracts_1.SeverityLevel.Verbose,
            silly: Contracts_1.SeverityLevel.Verbose
        };
        return map[og] === undefined ? Contracts_1.SeverityLevel.Information : map[og];
    },
    unknown: function (og) {
        return Contracts_1.SeverityLevel.Information;
    }
};
var subscriber = function (event) {
    clients.forEach(function (client) {
        var AIlevel = winstonToAILevelMap[event.data.levelKind](event.data.level);
        client.trackTrace({
            message: event.data.message,
            severity: AIlevel,
            properties: event.data.meta
        });
    });
};
function enable(enabled, client) {
    if (enabled) {
        if (clients.length === 0) {
            diagnostic_channel_1.channel.subscribe("winston", subscriber);
        }
        ;
        clients.push(client);
    }
    else {
        clients = clients.filter(function (c) { return c != client; });
        if (clients.length === 0) {
            diagnostic_channel_1.channel.unsubscribe("winston", subscriber);
        }
    }
}
exports.enable = enable;
//# sourceMappingURL=winston.sub.js.map
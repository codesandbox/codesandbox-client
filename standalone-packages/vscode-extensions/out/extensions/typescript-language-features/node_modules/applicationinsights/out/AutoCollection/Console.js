"use strict";
var DiagChannel = require("./diagnostic-channel/initialization");
var AutoCollectConsole = (function () {
    function AutoCollectConsole(client) {
        if (!!AutoCollectConsole.INSTANCE) {
            throw new Error("Console logging adapter tracking should be configured from the applicationInsights object");
        }
        this._client = client;
        AutoCollectConsole.INSTANCE = this;
    }
    AutoCollectConsole.prototype.enable = function (isEnabled, collectConsoleLog) {
        if (DiagChannel.IsInitialized) {
            require("./diagnostic-channel/console.sub").enable(isEnabled && collectConsoleLog, this._client);
            require("./diagnostic-channel/bunyan.sub").enable(isEnabled, this._client);
            require("./diagnostic-channel/winston.sub").enable(isEnabled, this._client);
        }
    };
    AutoCollectConsole.prototype.isInitialized = function () {
        return this._isInitialized;
    };
    AutoCollectConsole.prototype.dispose = function () {
        AutoCollectConsole.INSTANCE = null;
        this.enable(false, false);
    };
    AutoCollectConsole._methodNames = ["debug", "info", "log", "warn", "error"];
    return AutoCollectConsole;
}());
module.exports = AutoCollectConsole;
//# sourceMappingURL=Console.js.map
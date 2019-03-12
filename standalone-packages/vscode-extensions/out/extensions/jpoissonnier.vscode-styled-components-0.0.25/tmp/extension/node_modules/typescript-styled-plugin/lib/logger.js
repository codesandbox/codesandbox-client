"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var LanguageServiceLogger = /** @class */ (function () {
    function LanguageServiceLogger(info) {
        this.info = info;
    }
    LanguageServiceLogger.prototype.log = function (msg) {
        this.info.project.projectService.logger.info("[" + config_1.pluginName + "] " + msg);
    };
    return LanguageServiceLogger;
}());
exports.LanguageServiceLogger = LanguageServiceLogger;

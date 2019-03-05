"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("../configuration/configuration");
const winston = require("winston");
const winston_console_for_electron_1 = require("winston-console-for-electron");
exports.logger = winston.createLogger({
    level: configuration_1.configuration.debug.loggingLevel,
    format: winston.format.simple(),
    transports: [new winston_console_for_electron_1.ConsoleForElectron()],
});

//# sourceMappingURL=logger.js.map

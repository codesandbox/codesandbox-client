"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransportStream = require("winston-transport");
const vscode = require("vscode");
const winston = require("winston");
const winston_console_for_electron_1 = require("winston-console-for-electron");
const configuration_1 = require("../configuration/configuration");
/**
 * Implementation of Winston transport
 * Displays VS Code message to user
 */
class VsCodeMessage extends TransportStream {
    constructor(options) {
        super(options);
        this.actionMessages = ['Dismiss', 'Suppress Errors'];
        this.prefix = options.prefix;
    }
    log(info, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (configuration_1.configuration.debug.silent) {
                return;
            }
            let showMessage;
            switch (info.level) {
                case 'error':
                    showMessage = vscode.window.showErrorMessage;
                    break;
                case 'warn':
                    showMessage = vscode.window.showWarningMessage;
                    break;
                case 'info':
                case 'verbose':
                case 'debug':
                    showMessage = vscode.window.showInformationMessage;
                    break;
                default:
                    throw 'Unsupported ' + info.level;
            }
            let message = info.message;
            if (this.prefix) {
                message = this.prefix + ': ' + message;
            }
            let selectedAction = yield showMessage(message, ...this.actionMessages);
            if (selectedAction === 'Suppress Errors') {
                vscode.window.showInformationMessage('Ignorance is bliss; temporarily suppressing log messages. For more permanence, please configure `vim.debug.suppress`.');
                configuration_1.configuration.debug.silent = true;
            }
            if (callback) {
                callback();
            }
        });
    }
}
class Logger {
    static get(prefix) {
        return winston.createLogger({
            format: winston.format.simple(),
            transports: [
                new winston_console_for_electron_1.ConsoleForElectron({
                    level: configuration_1.configuration.debug.loggingLevelForConsole,
                    silent: configuration_1.configuration.debug.silent,
                    prefix: prefix,
                }),
                new VsCodeMessage({
                    level: configuration_1.configuration.debug.loggingLevelForAlert,
                    prefix: prefix,
                }),
            ],
        });
    }
}
exports.Logger = Logger;

//# sourceMappingURL=logger.js.map

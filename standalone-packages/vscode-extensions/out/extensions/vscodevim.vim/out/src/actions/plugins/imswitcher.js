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
const mode_1 = require("../../mode/mode");
const fs_1 = require("fs");
const configuration_1 = require("../../configuration/configuration");
const util = require("../../util/util");
const logger_1 = require("../../util/logger");
const message_1 = require("../../util/message");
const globals_1 = require("../../globals");
// InputMethodSwitcher change input method automatically when mode changed
class InputMethodSwitcher {
    constructor(execute = util.executeShell) {
        this.savedIMKey = '';
        this.execute = execute;
    }
    switchInputMethod(prevMode, newMode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (configuration_1.configuration.autoSwitchInputMethod.enable !== true) {
                return;
            }
            if (!this.isConfigurationValid()) {
                this.disableIMSwitch();
                return;
            }
            // when you exit from insert-like mode, save origin input method and set it to default
            let isPrevModeInsertLike = this.isInsertLikeMode(prevMode);
            let isNewModeInsertLike = this.isInsertLikeMode(newMode);
            if (isPrevModeInsertLike !== isNewModeInsertLike) {
                if (isNewModeInsertLike) {
                    this.resumeIM();
                }
                else {
                    this.switchToDefaultIM();
                }
            }
        });
    }
    // save origin input method and set input method to default
    switchToDefaultIM() {
        return __awaiter(this, void 0, void 0, function* () {
            const obtainIMCmd = configuration_1.configuration.autoSwitchInputMethod.obtainIMCmd;
            const rawObtainIMCmd = this.getRawCmd(obtainIMCmd);
            if (fs_1.existsSync(rawObtainIMCmd) || globals_1.Globals.isTesting) {
                try {
                    const insertIMKey = yield this.execute(obtainIMCmd);
                    if (insertIMKey !== undefined) {
                        this.savedIMKey = insertIMKey.trim();
                    }
                }
                catch (e) {
                    logger_1.logger.error(`IMSwitcher: promise is rejected. err=${e}`);
                }
            }
            else {
                this.showCmdNotFoundErrorMessage(rawObtainIMCmd, 'vim.autoSwitchInputMethod.obtainIMCmd');
            }
            const defaultIMKey = configuration_1.configuration.autoSwitchInputMethod.defaultIM;
            if (defaultIMKey !== this.savedIMKey) {
                this.switchToIM(defaultIMKey);
            }
        });
    }
    // resume origin inputmethod
    resumeIM() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.savedIMKey !== configuration_1.configuration.autoSwitchInputMethod.defaultIM) {
                this.switchToIM(this.savedIMKey);
            }
        });
    }
    switchToIM(imKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let switchIMCmd = configuration_1.configuration.autoSwitchInputMethod.switchIMCmd;
            const rawSwitchIMCmd = this.getRawCmd(switchIMCmd);
            if (fs_1.existsSync(rawSwitchIMCmd) || globals_1.Globals.isTesting) {
                if (imKey !== '' && imKey !== undefined) {
                    switchIMCmd = switchIMCmd.replace('{im}', imKey);
                    try {
                        yield this.execute(switchIMCmd);
                    }
                    catch (e) {
                        logger_1.logger.error(`IMSwitcher: promise is rejected. err=${e}`);
                    }
                }
            }
            else {
                this.showCmdNotFoundErrorMessage(rawSwitchIMCmd, 'vim.autoSwitchInputMethod.switchIMCmd');
            }
        });
    }
    isInsertLikeMode(mode) {
        const insertLikeModes = new Set([
            mode_1.ModeName.Insert,
            mode_1.ModeName.Replace,
            mode_1.ModeName.SurroundInputMode,
        ]);
        return insertLikeModes.has(mode);
    }
    getRawCmd(cmd) {
        return cmd.split(' ')[0];
    }
    showCmdNotFoundErrorMessage(cmd, config) {
        message_1.Message.ShowError(`Unable to find ${cmd}. check your ${config} in VSCode setting.`);
        this.disableIMSwitch();
    }
    disableIMSwitch() {
        configuration_1.configuration.autoSwitchInputMethod.enable = false;
    }
    isConfigurationValid() {
        let switchIMCmd = configuration_1.configuration.autoSwitchInputMethod.switchIMCmd;
        if (!switchIMCmd.includes('{im}')) {
            message_1.Message.ShowError('vim.autoSwitchInputMethod.switchIMCmd is incorrect, \
        it should contain the placeholder {im}');
            return false;
        }
        let obtainIMCmd = configuration_1.configuration.autoSwitchInputMethod.obtainIMCmd;
        if (obtainIMCmd === undefined || obtainIMCmd === '') {
            message_1.Message.ShowError('vim.autoSwitchInputMethod.obtainIMCmd is empty, please set it correctly!');
            return false;
        }
        let defaultIMKey = configuration_1.configuration.autoSwitchInputMethod.defaultIM;
        if (defaultIMKey === undefined || defaultIMKey === '') {
            message_1.Message.ShowError('vim.autoSwitchInputMethod.defaultIM is empty, please set it correctly!');
            return false;
        }
        return true;
    }
}
exports.InputMethodSwitcher = InputMethodSwitcher;

//# sourceMappingURL=imswitcher.js.map

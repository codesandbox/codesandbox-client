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
const iconfigurationValidator_1 = require("../iconfigurationValidator");
const util_1 = require("util");
const fs_1 = require("fs");
const globals_1 = require("../../globals");
class InputMethodSwitcherConfigurationValidator {
    validate(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new iconfigurationValidator_1.ValidatorResults();
            const inputMethodConfig = config.autoSwitchInputMethod;
            if (!inputMethodConfig.enable || globals_1.Globals.isTesting) {
                return Promise.resolve(result);
            }
            if (!inputMethodConfig.switchIMCmd.includes('{im}')) {
                result.append({
                    level: 'error',
                    message: 'vim.autoSwitchInputMethod.switchIMCmd is incorrect, it should contain the placeholder {im}.',
                });
            }
            if (inputMethodConfig.obtainIMCmd === undefined || inputMethodConfig.obtainIMCmd === '') {
                result.append({
                    level: 'error',
                    message: 'vim.autoSwitchInputMethod.obtainIMCmd is empty.',
                });
            }
            else if (!(yield util_1.promisify(fs_1.exists)(this.getRawCmd(inputMethodConfig.obtainIMCmd)))) {
                result.append({
                    level: 'error',
                    message: `Unable to find ${inputMethodConfig.obtainIMCmd}. Check your 'vim.autoSwitchInputMethod.obtainIMCmd' in VSCode setting.`,
                });
            }
            if (inputMethodConfig.defaultIM === undefined || inputMethodConfig.defaultIM === '') {
                result.append({
                    level: 'error',
                    message: 'vim.autoSwitchInputMethod.defaultIM is empty.',
                });
            }
            else if (!(yield util_1.promisify(fs_1.exists)(this.getRawCmd(inputMethodConfig.switchIMCmd)))) {
                result.append({
                    level: 'error',
                    message: `Unable to find ${inputMethodConfig.switchIMCmd}. Check your 'vim.autoSwitchInputMethod.switchIMCmd' in VSCode setting.`,
                });
            }
            return Promise.resolve(result);
        });
    }
    disable(config) {
        config.autoSwitchInputMethod.enable = false;
    }
    getRawCmd(cmd) {
        return cmd.split(' ')[0];
    }
}
exports.InputMethodSwitcherConfigurationValidator = InputMethodSwitcherConfigurationValidator;

//# sourceMappingURL=inputMethodSwitcherValidator.js.map

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
const vscode = require("vscode");
const notation_1 = require("../notation");
const iconfigurationValidator_1 = require("../iconfigurationValidator");
class RemappingValidator {
    validate(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new iconfigurationValidator_1.ValidatorResults();
            const modeKeyBindingsKeys = [
                'insertModeKeyBindings',
                'insertModeKeyBindingsNonRecursive',
                'normalModeKeyBindings',
                'normalModeKeyBindingsNonRecursive',
                'visualModeKeyBindings',
                'visualModeKeyBindingsNonRecursive',
            ];
            for (const modeKeyBindingsKey of modeKeyBindingsKeys) {
                let keybindings = config[modeKeyBindingsKey];
                const modeKeyBindingsMap = new Map();
                for (let i = keybindings.length - 1; i >= 0; i--) {
                    let remapping = keybindings[i];
                    // validate
                    let remappingError = yield this.isRemappingValid(remapping);
                    result.concat(remappingError);
                    if (remappingError.hasError) {
                        // errors with remapping, skip
                        keybindings.splice(i, 1);
                        continue;
                    }
                    // normalize
                    if (remapping.before) {
                        remapping.before.forEach((key, idx) => (remapping.before[idx] = notation_1.Notation.NormalizeKey(key, config.leader)));
                    }
                    if (remapping.after) {
                        remapping.after.forEach((key, idx) => (remapping.after[idx] = notation_1.Notation.NormalizeKey(key, config.leader)));
                    }
                    // check for duplicates
                    const beforeKeys = remapping.before.join('');
                    if (modeKeyBindingsMap.has(beforeKeys)) {
                        result.append({
                            level: 'warning',
                            message: `${remapping.before}. Duplicate remapped key for ${beforeKeys}.`,
                        });
                        continue;
                    }
                    // add to map
                    modeKeyBindingsMap.set(beforeKeys, remapping);
                }
                config[modeKeyBindingsKey + 'Map'] = modeKeyBindingsMap;
            }
            return result;
        });
    }
    disable(config) {
        // no-op
    }
    isRemappingValid(remapping) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new iconfigurationValidator_1.ValidatorResults();
            if (!remapping.after && !remapping.commands) {
                result.append({
                    level: 'error',
                    message: `${remapping.before} missing 'after' key or 'command'.`,
                });
            }
            if (!(remapping.before instanceof Array)) {
                result.append({
                    level: 'error',
                    message: `Remapping of '${remapping.before}' should be a string array.`,
                });
            }
            if (remapping.after && !(remapping.after instanceof Array)) {
                result.append({
                    level: 'error',
                    message: `Remapping of '${remapping.after}' should be a string array.`,
                });
            }
            if (remapping.commands) {
                for (const command of remapping.commands) {
                    let cmd;
                    if (typeof command === 'string') {
                        cmd = command;
                    }
                    else {
                        cmd = command.command;
                    }
                    if (!(yield this.isCommandValid(cmd))) {
                        result.append({ level: 'warning', message: `${cmd} does not exist.` });
                    }
                }
            }
            return result;
        });
    }
    isCommandValid(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command.startsWith(':')) {
                return true;
            }
            return (yield this.getCommandMap()).has(command);
        });
    }
    getCommandMap() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._commandMap == null) {
                this._commandMap = new Map((yield vscode.commands.getCommands(true)).map(x => [x, true]));
            }
            return this._commandMap;
        });
    }
}
exports.RemappingValidator = RemappingValidator;

//# sourceMappingURL=remappingValidator.js.map

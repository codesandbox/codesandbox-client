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
const _ = require("lodash");
const vscode = require("vscode");
const commandLine_1 = require("../cmd_line/commandLine");
const configuration_1 = require("../configuration/configuration");
const mode_1 = require("../mode/mode");
const logger_1 = require("../util/logger");
class Remappers {
    constructor() {
        this.remappers = [
            new InsertModeRemapper(true),
            new NormalModeRemapper(true),
            new VisualModeRemapper(true),
            new InsertModeRemapper(false),
            new NormalModeRemapper(false),
            new VisualModeRemapper(false),
        ];
    }
    get isPotentialRemap() {
        return _.some(this.remappers, r => r.isPotentialRemap);
    }
    sendKey(keys, modeHandler, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let handled = false;
            for (let remapper of this.remappers) {
                handled = handled || (yield remapper.sendKey(keys, modeHandler, vimState));
            }
            return handled;
        });
    }
}
exports.Remappers = Remappers;
class Remapper {
    constructor(configKey, remappedModes, recursive) {
        this._isPotentialRemap = false;
        this._configKey = configKey;
        this._recursive = recursive;
        this._remappedModes = remappedModes;
    }
    get isPotentialRemap() {
        return this._isPotentialRemap;
    }
    sendKey(keys, modeHandler, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            this._isPotentialRemap = false;
            if (this._remappedModes.indexOf(vimState.currentMode) === -1) {
                return false;
            }
            const userDefinedRemappings = this._getRemappings();
            let remapping = Remapper._findMatchingRemap(userDefinedRemappings, keys, vimState.currentMode);
            if (remapping) {
                logger_1.logger.debug(`Remapper: ${this._configKey}. match found. before=${remapping.before}. after=${remapping.after}. command=${remapping.commands}.`);
                if (!this._recursive) {
                    vimState.isCurrentlyPerformingRemapping = true;
                }
                const numCharsToRemove = remapping.before.length - 1;
                // Revert previously inserted characters
                // (e.g. jj remapped to esc, we have to revert the inserted "jj")
                if (vimState.currentMode === mode_1.ModeName.Insert) {
                    // Revert every single inserted character.
                    // We subtract 1 because we haven't actually applied the last key.
                    yield vimState.historyTracker.undoAndRemoveChanges(Math.max(0, numCharsToRemove * vimState.allCursors.length));
                    vimState.allCursors = vimState.allCursors.map(x => x.withNewStop(x.stop.getLeft(numCharsToRemove)));
                }
                // We need to remove the keys that were remapped into different keys
                // from the state.
                vimState.recordedState.actionKeys = vimState.recordedState.actionKeys.slice(0, -numCharsToRemove);
                vimState.keyHistory = vimState.keyHistory.slice(0, -numCharsToRemove);
                if (remapping.after) {
                    const count = vimState.recordedState.count || 1;
                    vimState.recordedState.count = 0;
                    for (let i = 0; i < count; i++) {
                        yield modeHandler.handleMultipleKeyEvents(remapping.after);
                    }
                }
                if (remapping.commands) {
                    for (const command of remapping.commands) {
                        // Check if this is a vim command by looking for :
                        let commandString;
                        let commandArgs;
                        if (typeof command === 'string') {
                            commandString = command;
                            commandArgs = [];
                        }
                        else {
                            commandString = command.command;
                            commandArgs = command.args;
                        }
                        if (commandString.slice(0, 1) === ':') {
                            yield commandLine_1.commandLine.Run(commandString.slice(1, commandString.length), modeHandler.vimState);
                            yield modeHandler.updateView(modeHandler.vimState);
                        }
                        else {
                            if (commandArgs) {
                                yield vscode.commands.executeCommand(commandString, commandArgs);
                            }
                            else {
                                yield vscode.commands.executeCommand(commandString);
                            }
                        }
                    }
                }
                vimState.isCurrentlyPerformingRemapping = false;
                return true;
            }
            // Check to see if a remapping could potentially be applied when more keys are received
            for (let remap of Object.keys(userDefinedRemappings)) {
                if (keys.join('') === remap.slice(0, keys.length)) {
                    this._isPotentialRemap = true;
                    break;
                }
            }
            return false;
        });
    }
    _getRemappings() {
        // Create a null object so that there is no __proto__
        let remappings = Object.create(null);
        for (let remapping of configuration_1.configuration[this._configKey]) {
            let debugMsg = `before=${remapping.before}. `;
            if (remapping.after) {
                debugMsg += `after=${remapping.after}. `;
            }
            if (remapping.commands) {
                for (const command of remapping.commands) {
                    if (typeof command === 'string') {
                        debugMsg += `command=${command}. args=.`;
                    }
                    else {
                        debugMsg += `command=${command.command}. args=${command.args}.`;
                    }
                }
            }
            if (!remapping.after && !remapping.commands) {
                logger_1.logger.error(`Remapper: ${this._configKey}. Invalid configuration. Missing 'after' key or 'command'. ${debugMsg}`);
                continue;
            }
            const keys = remapping.before.join('');
            if (keys in remappings) {
                logger_1.logger.error(`Remapper: ${this._configKey}. Duplicate configuration. ${debugMsg}`);
                continue;
            }
            logger_1.logger.debug(`Remapper: ${this._configKey}. ${debugMsg}`);
            remappings[keys] = remapping;
        }
        return remappings;
    }
    static _findMatchingRemap(userDefinedRemappings, inputtedKeys, currentMode) {
        let remapping;
        let range = Remapper._getRemappedKeysLengthRange(userDefinedRemappings);
        const startingSliceLength = Math.max(range[1], inputtedKeys.length);
        for (let sliceLength = startingSliceLength; sliceLength >= range[0]; sliceLength--) {
            const keySlice = inputtedKeys.slice(-sliceLength).join('');
            if (keySlice in userDefinedRemappings) {
                // In Insert mode, we allow users to precede remapped commands
                // with extraneous keystrokes (eg. "hello world jj")
                // In other modes, we have to precisely match the keysequence
                // unless the preceding keys are numbers
                if (currentMode !== mode_1.ModeName.Insert) {
                    const precedingKeys = inputtedKeys
                        .slice(0, inputtedKeys.length - keySlice.length)
                        .join('');
                    if (precedingKeys.length > 0 && !/^[0-9]+$/.test(precedingKeys)) {
                        break;
                    }
                }
                remapping = userDefinedRemappings[keySlice];
                break;
            }
        }
        return remapping;
    }
    /**
     * Given list of remappings, returns the length of the shortest and longest remapped keys
     * @param remappings
     */
    static _getRemappedKeysLengthRange(remappings) {
        const keys = Object.keys(remappings);
        if (keys.length === 0) {
            return [0, 0];
        }
        return [_.minBy(keys, m => m.length).length, _.maxBy(keys, m => m.length).length];
    }
}
exports.Remapper = Remapper;
class InsertModeRemapper extends Remapper {
    constructor(recursive) {
        super('insertModeKeyBindings' + (recursive ? '' : 'NonRecursive'), [mode_1.ModeName.Insert, mode_1.ModeName.Replace], recursive);
    }
}
class NormalModeRemapper extends Remapper {
    constructor(recursive) {
        super('normalModeKeyBindings' + (recursive ? '' : 'NonRecursive'), [mode_1.ModeName.Normal], recursive);
    }
}
class VisualModeRemapper extends Remapper {
    constructor(recursive) {
        super('visualModeKeyBindings' + (recursive ? '' : 'NonRecursive'), [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock], recursive);
    }
}

//# sourceMappingURL=remapper.js.map

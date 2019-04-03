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
const logger_1 = require("../util/logger");
const mode_1 = require("../mode/mode");
const commandLine_1 = require("../cmd_line/commandLine");
const configuration_1 = require("../configuration/configuration");
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
        this._logger = logger_1.Logger.get('Remapper');
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
            const userDefinedRemappings = configuration_1.configuration[this._configKey];
            this._logger.debug(`trying to find matching remap. keys=${keys}. mode=${mode_1.ModeName[vimState.currentMode]}. keybindings=${this._configKey}.`);
            let remapping = this.findMatchingRemap(userDefinedRemappings, keys, vimState.currentMode);
            if (remapping) {
                this._logger.debug(`${this._configKey}. match found. before=${remapping.before}. after=${remapping.after}. command=${remapping.commands}.`);
                if (!this._recursive) {
                    vimState.isCurrentlyPerformingRemapping = true;
                }
                try {
                    yield this.handleRemapping(remapping, vimState, modeHandler);
                }
                finally {
                    vimState.isCurrentlyPerformingRemapping = false;
                }
                return true;
            }
            // Check to see if a remapping could potentially be applied when more keys are received
            for (let remap of userDefinedRemappings.keys()) {
                if (keys.join('') === remap.slice(0, keys.length)) {
                    this._isPotentialRemap = true;
                    break;
                }
            }
            return false;
        });
    }
    handleRemapping(remapping, vimState, modeHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            const numCharsToRemove = remapping.before.length - 1;
            // Revert previously inserted characters
            // (e.g. jj remapped to esc, we have to revert the inserted "jj")
            if (vimState.currentMode === mode_1.ModeName.Insert) {
                // Revert every single inserted character.
                // We subtract 1 because we haven't actually applied the last key.
                yield vimState.historyTracker.undoAndRemoveChanges(Math.max(0, numCharsToRemove * vimState.cursors.length));
                vimState.cursors = vimState.cursors.map(c => c.withNewStop(c.stop.getLeft(numCharsToRemove)));
            }
            // We need to remove the keys that were remapped into different keys from the state.
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
                        // Check if this is a vim command by looking for :
                        yield commandLine_1.commandLine.Run(commandString.slice(1, commandString.length), modeHandler.vimState);
                        yield modeHandler.updateView(modeHandler.vimState);
                    }
                    else if (commandArgs) {
                        yield vscode.commands.executeCommand(commandString, commandArgs);
                    }
                    else {
                        yield vscode.commands.executeCommand(commandString);
                    }
                }
            }
        });
    }
    findMatchingRemap(userDefinedRemappings, inputtedKeys, currentMode) {
        let remapping;
        if (userDefinedRemappings.size === 0) {
            return remapping;
        }
        const range = Remapper.getRemappedKeysLengthRange(userDefinedRemappings);
        const startingSliceLength = Math.max(range[1], inputtedKeys.length);
        for (let sliceLength = startingSliceLength; sliceLength >= range[0]; sliceLength--) {
            const keySlice = inputtedKeys.slice(-sliceLength).join('');
            this._logger.verbose(`key=${inputtedKeys}. keySlice=${keySlice}.`);
            if (userDefinedRemappings.has(keySlice)) {
                // In Insert mode, we allow users to precede remapped commands
                // with extraneous keystrokes (eg. "hello world jj")
                // In other modes, we have to precisely match the keysequence
                // unless the preceding keys are numbers
                if (currentMode !== mode_1.ModeName.Insert) {
                    const precedingKeys = inputtedKeys
                        .slice(0, inputtedKeys.length - keySlice.length)
                        .join('');
                    if (precedingKeys.length > 0 && !/^[0-9]+$/.test(precedingKeys)) {
                        this._logger.verbose(`key sequences need to match precisely. precedingKeys=${precedingKeys}.`);
                        break;
                    }
                }
                remapping = userDefinedRemappings.get(keySlice);
                break;
            }
        }
        return remapping;
    }
    /**
     * Given list of remappings, returns the length of the shortest and longest remapped keys
     * @param remappings
     */
    static getRemappedKeysLengthRange(remappings) {
        if (remappings.size === 0) {
            return [0, 0];
        }
        return [
            _.minBy(Array.from(remappings.keys()), m => m.length).length,
            _.maxBy(Array.from(remappings.keys()), m => m.length).length,
        ];
    }
}
exports.Remapper = Remapper;
class InsertModeRemapper extends Remapper {
    constructor(recursive) {
        super('insertModeKeyBindings' + (recursive ? '' : 'NonRecursive') + 'Map', [mode_1.ModeName.Insert, mode_1.ModeName.Replace], recursive);
    }
}
class NormalModeRemapper extends Remapper {
    constructor(recursive) {
        super('normalModeKeyBindings' + (recursive ? '' : 'NonRecursive') + 'Map', [mode_1.ModeName.Normal], recursive);
    }
}
class VisualModeRemapper extends Remapper {
    constructor(recursive) {
        super('visualModeKeyBindings' + (recursive ? '' : 'NonRecursive') + 'Map', [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock], recursive);
    }
}

//# sourceMappingURL=remapper.js.map

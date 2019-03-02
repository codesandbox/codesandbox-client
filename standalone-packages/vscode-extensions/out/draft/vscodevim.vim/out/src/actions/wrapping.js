"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./../configuration/configuration");
const mode_1 = require("./../mode/mode");
const modes = {};
modes[mode_1.ModeName.Normal] = {
    '<left>': '<',
    '<right>': '>',
};
modes[mode_1.ModeName.Visual] = modes[mode_1.ModeName.Normal];
modes[mode_1.ModeName.Insert] = {
    '<left>': '[',
    '<right>': ']',
};
const translateMovementKey = (mode, key) => {
    return (modes[mode] || {})[key] || key;
};
exports.shouldWrapKey = (vimState, keysPressed) => {
    const key = translateMovementKey(vimState.currentMode, keysPressed[0]);
    return !!configuration_1.configuration.wrapKeys[key];
};

//# sourceMappingURL=wrapping.js.map

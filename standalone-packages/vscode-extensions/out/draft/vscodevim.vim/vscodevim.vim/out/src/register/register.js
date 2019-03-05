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
const actions_1 = require("./../actions/commands/actions");
const operator_1 = require("./../actions/operator");
const recordedState_1 = require("./../state/recordedState");
const clipboard_1 = require("./../util/clipboard");
/**
 * There are two different modes of copy/paste in Vim - copy by character
 * and copy by line. Copy by line typically happens in Visual Line mode, but
 * also shows up in some other actions that work over lines (most noteably dd,
 * yy).
 */
var RegisterMode;
(function (RegisterMode) {
    RegisterMode[RegisterMode["AscertainFromCurrentMode"] = 0] = "AscertainFromCurrentMode";
    RegisterMode[RegisterMode["CharacterWise"] = 1] = "CharacterWise";
    RegisterMode[RegisterMode["LineWise"] = 2] = "LineWise";
    RegisterMode[RegisterMode["BlockWise"] = 3] = "BlockWise";
})(RegisterMode = exports.RegisterMode || (exports.RegisterMode = {}));
class Register {
    static isValidRegister(register) {
        return (register in Register.registers ||
            Register.isValidLowercaseRegister(register) ||
            Register.isValidUppercaseRegister(register));
    }
    static isValidRegisterForMacro(register) {
        return /^[a-zA-Z0-9]+$/.test(register);
    }
    /**
     * Puts content in a register. If none is specified, uses the default
     * register ".
     */
    static put(content, vimState, multicursorIndex) {
        const register = vimState.recordedState.registerName;
        if (!Register.isValidRegister(register)) {
            throw new Error(`Invalid register ${register}`);
        }
        if (Register.isBlackHoleRegister(register)) {
            return;
        }
        if (vimState.isMultiCursor) {
            if (Register.isValidUppercaseRegister(register)) {
                Register.appendMulticursorRegister(content, register, vimState, multicursorIndex);
            }
            else {
                Register.putMulticursorRegister(content, register, vimState, multicursorIndex);
            }
        }
        else {
            if (Register.isValidUppercaseRegister(register)) {
                Register.appendNormalRegister(content, register, vimState);
            }
            else {
                Register.putNormalRegister(content, register, vimState);
            }
        }
    }
    static isBlackHoleRegister(registerName) {
        return registerName === '_';
    }
    static isClipboardRegister(registerName) {
        const register = Register.registers[registerName];
        return register && register.isClipboardRegister;
    }
    static isValidLowercaseRegister(register) {
        return /^[a-z]+$/.test(register);
    }
    static isValidUppercaseRegister(register) {
        return /^[A-Z]+$/.test(register);
    }
    /**
     * Puts the content at the specified index of the multicursor Register.
     *
     * `REMARKS:` This procedure assumes that you pass an valid register.
     */
    static putMulticursorRegister(content, register, vimState, multicursorIndex) {
        if (multicursorIndex === 0) {
            Register.registers[register.toLowerCase()] = {
                text: [],
                registerMode: vimState.effectiveRegisterMode,
                isClipboardRegister: Register.isClipboardRegister(register),
            };
        }
        let registerContent = Register.registers[register.toLowerCase()];
        if (!Array.isArray(registerContent.text)) {
            registerContent.text = [];
        }
        registerContent.text.push(content);
        if (multicursorIndex === vimState.allCursors.length - 1) {
            if (registerContent.isClipboardRegister) {
                let clipboardText = '';
                for (const line of registerContent.text) {
                    clipboardText += line + '\n';
                }
                clipboardText = clipboardText.replace(/\n$/, '');
                clipboard_1.Clipboard.Copy(clipboardText);
            }
            Register.processNumberedRegister(registerContent.text, vimState);
        }
    }
    /**
     * Appends the content at the specified index of the multicursor Register.
     *
     * `REMARKS:` This Procedure assume that you pass an valid uppercase register.
     */
    static appendMulticursorRegister(content, register, vimState, multicursorIndex) {
        let appendToRegister = Register.registers[register.toLowerCase()];
        // Only append if appendToRegister is multicursor register
        // and line count match, otherwise replace register
        if (multicursorIndex === 0) {
            let createEmptyRegister = false;
            if (typeof appendToRegister.text === 'string') {
                createEmptyRegister = true;
            }
            else {
                if (appendToRegister.text.length !== vimState.allCursors.length) {
                    createEmptyRegister = true;
                }
            }
            if (createEmptyRegister) {
                Register.registers[register.toLowerCase()] = {
                    text: Array(vimState.allCursors.length).fill(''),
                    registerMode: vimState.effectiveRegisterMode,
                    isClipboardRegister: Register.isClipboardRegister(register),
                };
                appendToRegister = Register.registers[register.toLowerCase()];
            }
        }
        let currentRegisterMode = vimState.effectiveRegisterMode;
        if (appendToRegister.registerMode === RegisterMode.CharacterWise &&
            currentRegisterMode === RegisterMode.CharacterWise) {
            appendToRegister.text[multicursorIndex] += content;
        }
        else {
            appendToRegister.text[multicursorIndex] += '\n' + content;
            appendToRegister.registerMode = currentRegisterMode;
        }
    }
    /**
     * Puts the content in the specified Register.
     *
     * `REMARKS:` This Procedure assume that you pass an valid register.
     */
    static putNormalRegister(content, register, vimState) {
        if (Register.isClipboardRegister(register)) {
            clipboard_1.Clipboard.Copy(content.toString());
        }
        Register.registers[register.toLowerCase()] = {
            text: content,
            registerMode: vimState.effectiveRegisterMode,
            isClipboardRegister: Register.isClipboardRegister(register),
        };
        Register.processNumberedRegister(content, vimState);
    }
    /**
     * Appends the content at the specified index of the multicursor Register.
     *
     * `REMARKS:` This Procedure assume that you pass an valid uppercase register.
     */
    static appendNormalRegister(content, register, vimState) {
        let appendToRegister = Register.registers[register.toLowerCase()];
        let currentRegisterMode = vimState.effectiveRegisterMode;
        // Check if appending to a multicursor register or normal
        if (appendToRegister.text instanceof Array) {
            if (appendToRegister.registerMode === RegisterMode.CharacterWise &&
                currentRegisterMode === RegisterMode.CharacterWise) {
                for (let i = 0; i < appendToRegister.text.length; i++) {
                    appendToRegister.text[i] += content;
                }
            }
            else {
                for (let i = 0; i < appendToRegister.text.length; i++) {
                    appendToRegister.text[i] += '\n' + content;
                }
                appendToRegister.registerMode = currentRegisterMode;
            }
        }
        else if (typeof appendToRegister.text === 'string') {
            if (appendToRegister.registerMode === RegisterMode.CharacterWise &&
                currentRegisterMode === RegisterMode.CharacterWise) {
                appendToRegister.text = appendToRegister.text + content;
            }
            else {
                appendToRegister.text += '\n' + content;
                appendToRegister.registerMode = currentRegisterMode;
            }
        }
    }
    static putByKey(content, register = '"', registerMode = RegisterMode.AscertainFromCurrentMode) {
        if (!Register.isValidRegister(register)) {
            throw new Error(`Invalid register ${register}`);
        }
        if (Register.isClipboardRegister(register)) {
            clipboard_1.Clipboard.Copy(content.toString());
        }
        if (Register.isBlackHoleRegister(register)) {
            return;
        }
        Register.registers[register] = {
            text: content,
            registerMode: registerMode || RegisterMode.AscertainFromCurrentMode,
            isClipboardRegister: Register.isClipboardRegister(register),
        };
    }
    /**
     * Handles special cases for Yank- and DeleteOperator.
     */
    static processNumberedRegister(content, vimState) {
        // Find the BaseOperator of the current actions
        const baseOperator = vimState.recordedState.operator || vimState.recordedState.command;
        if (baseOperator instanceof operator_1.YankOperator || baseOperator instanceof actions_1.CommandYankFullLine) {
            // 'yank' to 0 only if no register was specified
            const registerCommand = vimState.recordedState.actionsRun.find(value => {
                return value instanceof actions_1.CommandRegister;
            });
            if (!registerCommand) {
                Register.registers['0'].text = content;
                Register.registers['0'].registerMode = vimState.effectiveRegisterMode;
            }
        }
        else if (baseOperator instanceof operator_1.DeleteOperator &&
            !(vimState.isRecordingMacro || vimState.isReplayingMacro)) {
            // shift 'delete-history' register
            for (let index = 9; index > 1; index--) {
                Register.registers[String(index)].text = Register.registers[String(index - 1)].text;
                Register.registers[String(index)].registerMode =
                    Register.registers[String(index - 1)].registerMode;
            }
            // Paste last delete into register '1'
            Register.registers['1'].text = content;
            Register.registers['1'].registerMode = vimState.effectiveRegisterMode;
        }
    }
    /**
     * Gets content from a register. If none is specified, uses the default
     * register ".
     */
    static get(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const register = vimState.recordedState.registerName;
            return Register.getByKey(register, vimState);
        });
    }
    static getByKey(register, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Register.isValidRegister(register)) {
                throw new Error(`Invalid register ${register}`);
            }
            let lowercaseRegister = register.toLowerCase();
            // Clipboard registers are always defined, so if a register doesn't already
            // exist we can be sure it's not a clipboard one
            if (!Register.registers[lowercaseRegister]) {
                Register.registers[lowercaseRegister] = {
                    text: '',
                    registerMode: RegisterMode.CharacterWise,
                    isClipboardRegister: false,
                };
            }
            /* Read from system clipboard */
            if (Register.isClipboardRegister(register)) {
                let text = clipboard_1.Clipboard.Paste();
                // Harmonize newline character
                text = text.replace(/\r\n/g, '\n');
                let registerText;
                if (vimState && vimState.isMultiCursor) {
                    registerText = text.split('\n');
                    if (registerText.length !== vimState.allCursors.length) {
                        registerText = text;
                    }
                }
                else {
                    registerText = text;
                }
                Register.registers[lowercaseRegister].text = registerText;
                return Register.registers[register];
            }
            else {
                let text = Register.registers[lowercaseRegister].text;
                let registerText;
                if (text instanceof recordedState_1.RecordedState) {
                    registerText = text;
                }
                else {
                    if (vimState && vimState.isMultiCursor && typeof text === 'object') {
                        if (text.length === vimState.allCursors.length) {
                            registerText = text;
                        }
                        else {
                            registerText = text.join('\n');
                        }
                    }
                    else {
                        if (typeof text === 'object') {
                            registerText = text.join('\n');
                        }
                        else {
                            registerText = text;
                        }
                    }
                }
                return {
                    text: registerText,
                    registerMode: Register.registers[lowercaseRegister].registerMode,
                    isClipboardRegister: Register.registers[lowercaseRegister].isClipboardRegister,
                };
            }
        });
    }
    static has(register) {
        return Register.registers[register] !== undefined;
    }
    static getKeys() {
        return Object.keys(Register.registers);
    }
}
/**
 * The '"' is the unnamed register.
 * The '*' and '+' are special registers for accessing the system clipboard.
 * TODO: Read-Only registers
 *  '.' register has the last inserted text.
 *  '%' register has the current file path.
 *  ':' is the most recently executed command.
 *  '#' is the name of last edited file. (low priority)
 */
Register.registers = {
    '"': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '.': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '*': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: true },
    '+': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: true },
    _: { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '0': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '1': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '2': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '3': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '4': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '5': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '6': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '7': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '8': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
    '9': { text: '', registerMode: RegisterMode.CharacterWise, isClipboardRegister: false },
};
exports.Register = Register;

//# sourceMappingURL=register.js.map

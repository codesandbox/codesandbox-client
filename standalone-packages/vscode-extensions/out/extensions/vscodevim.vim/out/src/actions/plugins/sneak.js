"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var SneakForward_1, SneakBackward_1;
"use strict";
const vscode = require("vscode");
const vimState_1 = require("../../state/vimState");
const configuration_1 = require("./../../configuration/configuration");
const base_1 = require("./../base");
const position_1 = require("../../common/motion/position");
const motion_1 = require("../motion");
let SneakForward = SneakForward_1 = class SneakForward extends motion_1.BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [['s', '<character>', '<character>'], ['z', '<character>', '<character>']];
    }
    couldActionApply(vimState, keysPressed) {
        const startingLetter = vimState.recordedState.operator === undefined ? 's' : 'z';
        return (configuration_1.configuration.sneak &&
            super.couldActionApply(vimState, keysPressed) &&
            keysPressed[0] === startingLetter);
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRepeat) {
                vimState_1.VimState.lastSemicolonRepeatableMovement = new SneakForward_1(this.keysPressed, true);
                vimState_1.VimState.lastCommaRepeatableMovement = new SneakBackward(this.keysPressed, true);
            }
            const editor = vscode.window.activeTextEditor;
            const document = editor.document;
            const lineCount = document.lineCount;
            const searchString = this.keysPressed[1] + this.keysPressed[2];
            for (let i = position.line; i < lineCount; ++i) {
                const lineText = document.lineAt(i).text;
                // Start searching after the current character so we don't find the same match twice
                const fromIndex = i === position.line ? position.character + 1 : 0;
                let matchIndex = -1;
                const ignorecase = configuration_1.configuration.sneakUseIgnorecaseAndSmartcase &&
                    (configuration_1.configuration.ignorecase && !(configuration_1.configuration.smartcase && /[A-Z]/.test(searchString)));
                // Check for matches
                if (ignorecase) {
                    matchIndex = lineText
                        .toLocaleLowerCase()
                        .indexOf(searchString.toLocaleLowerCase(), fromIndex);
                }
                else {
                    matchIndex = lineText.indexOf(searchString, fromIndex);
                }
                if (matchIndex >= 0) {
                    return new position_1.Position(i, matchIndex);
                }
            }
            return position;
        });
    }
};
SneakForward = SneakForward_1 = __decorate([
    base_1.RegisterAction
], SneakForward);
let SneakBackward = SneakBackward_1 = class SneakBackward extends motion_1.BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [['S', '<character>', '<character>'], ['Z', '<character>', '<character>']];
    }
    couldActionApply(vimState, keysPressed) {
        const startingLetter = vimState.recordedState.operator === undefined ? 'S' : 'Z';
        return (configuration_1.configuration.sneak &&
            super.couldActionApply(vimState, keysPressed) &&
            keysPressed[0] === startingLetter);
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRepeat) {
                vimState_1.VimState.lastSemicolonRepeatableMovement = new SneakBackward_1(this.keysPressed, true);
                vimState_1.VimState.lastCommaRepeatableMovement = new SneakForward(this.keysPressed, true);
            }
            const editor = vscode.window.activeTextEditor;
            const document = editor.document;
            const searchString = this.keysPressed[1] + this.keysPressed[2];
            for (let i = position.line; i >= 0; --i) {
                const lineText = document.lineAt(i).text;
                // Start searching before the current character so we don't find the same match twice
                const fromIndex = i === position.line ? position.character - 1 : +Infinity;
                let matchIndex = -1;
                const ignorecase = configuration_1.configuration.sneakUseIgnorecaseAndSmartcase &&
                    (configuration_1.configuration.ignorecase && !(configuration_1.configuration.smartcase && /[A-Z]/.test(searchString)));
                // Check for matches
                if (ignorecase) {
                    matchIndex = lineText
                        .toLocaleLowerCase()
                        .lastIndexOf(searchString.toLocaleLowerCase(), fromIndex);
                }
                else {
                    matchIndex = lineText.lastIndexOf(searchString, fromIndex);
                }
                if (matchIndex >= 0) {
                    return new position_1.Position(i, matchIndex);
                }
            }
            return position;
        });
    }
};
SneakBackward = SneakBackward_1 = __decorate([
    base_1.RegisterAction
], SneakBackward);

//# sourceMappingURL=sneak.js.map

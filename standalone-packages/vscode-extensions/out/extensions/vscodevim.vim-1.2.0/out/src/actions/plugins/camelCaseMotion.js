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
const textobject_1 = require("../textobject");
const base_1 = require("../base");
const mode_1 = require("../../mode/mode");
const position_1 = require("../../common/motion/position");
const motion_1 = require("../motion");
const textEditor_1 = require("../../textEditor");
const configuration_1 = require("../../configuration/configuration");
const operator_1 = require("../operator");
class CamelCaseBaseMovement extends motion_1.BaseMovement {
    doesActionApply(vimState, keysPressed) {
        return configuration_1.configuration.camelCaseMotion.enable && super.doesActionApply(vimState, keysPressed);
    }
    couldActionApply(vimState, keysPressed) {
        return configuration_1.configuration.camelCaseMotion.enable && super.couldActionApply(vimState, keysPressed);
    }
}
class CamelCaseTextObjectMovement extends textobject_1.TextObjectMovement {
    doesActionApply(vimState, keysPressed) {
        return configuration_1.configuration.camelCaseMotion.enable && super.doesActionApply(vimState, keysPressed);
    }
    couldActionApply(vimState, keysPressed) {
        return configuration_1.configuration.camelCaseMotion.enable && super.couldActionApply(vimState, keysPressed);
    }
}
// based off of `MoveWordBegin`
let MoveCamelCaseWordBegin = class MoveCamelCaseWordBegin extends CamelCaseBaseMovement {
    // based off of `MoveWordBegin`
    constructor() {
        super(...arguments);
        this.keys = ['<leader>', 'w'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!configuration_1.configuration.changeWordIncludesWhitespace &&
                vimState.recordedState.operator instanceof operator_1.ChangeOperator) {
                // TODO use execForOperator? Or maybe dont?
                // See note for w
                return position.getCurrentCamelCaseWordEnd().getRight();
            }
            else {
                return position.getCamelCaseWordRight();
            }
        });
    }
};
MoveCamelCaseWordBegin = __decorate([
    base_1.RegisterAction
], MoveCamelCaseWordBegin);
// based off of `MoveWordEnd`
let MoveCamelCaseWordEnd = class MoveCamelCaseWordEnd extends CamelCaseBaseMovement {
    // based off of `MoveWordEnd`
    constructor() {
        super(...arguments);
        this.keys = ['<leader>', 'e'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getCurrentCamelCaseWordEnd();
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let end = position.getCurrentCamelCaseWordEnd();
            return new position_1.Position(end.line, end.character + 1);
        });
    }
};
MoveCamelCaseWordEnd = __decorate([
    base_1.RegisterAction
], MoveCamelCaseWordEnd);
// based off of `MoveBeginningWord`
let MoveBeginningCamelCaseWord = class MoveBeginningCamelCaseWord extends CamelCaseBaseMovement {
    // based off of `MoveBeginningWord`
    constructor() {
        super(...arguments);
        this.keys = ['<leader>', 'b'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getCamelCaseWordLeft();
        });
    }
};
MoveBeginningCamelCaseWord = __decorate([
    base_1.RegisterAction
], MoveBeginningCamelCaseWord);
// based off of `SelectInnerWord`
let SelectInnerCamelCaseWord = class SelectInnerCamelCaseWord extends CamelCaseTextObjectMovement {
    // based off of `SelectInnerWord`
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = ['i', '<leader>', 'w'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let start;
            let stop;
            const currentChar = textEditor_1.TextEditor.getLineAt(position).text[position.character];
            if (/\s/.test(currentChar)) {
                start = position.getLastCamelCaseWordEnd().getRight();
                stop = position.getCamelCaseWordRight().getLeftThroughLineBreaks();
            }
            else {
                start = position.getCamelCaseWordLeft(true);
                stop = position.getCurrentCamelCaseWordEnd(true);
            }
            if (vimState.currentMode === mode_1.ModeName.Visual &&
                !vimState.cursorStopPosition.isEqual(vimState.cursorStartPosition)) {
                start = vimState.cursorStartPosition;
                if (vimState.cursorStopPosition.isBefore(vimState.cursorStartPosition)) {
                    // If current cursor postion is before cursor start position, we are selecting words in reverser order.
                    if (/\s/.test(currentChar)) {
                        stop = position.getLastCamelCaseWordEnd().getRight();
                    }
                    else {
                        stop = position.getCamelCaseWordLeft(true);
                    }
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectInnerCamelCaseWord = __decorate([
    base_1.RegisterAction
], SelectInnerCamelCaseWord);
exports.SelectInnerCamelCaseWord = SelectInnerCamelCaseWord;

//# sourceMappingURL=camelCaseMotion.js.map

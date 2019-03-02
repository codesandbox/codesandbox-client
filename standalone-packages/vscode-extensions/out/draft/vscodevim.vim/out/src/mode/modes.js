"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const position_1 = require("./../common/motion/position");
const mode_1 = require("./mode");
const mode_2 = require("./mode");
var VisualBlockInsertionType;
(function (VisualBlockInsertionType) {
    /**
     * Triggered with I
     */
    VisualBlockInsertionType[VisualBlockInsertionType["Insert"] = 0] = "Insert";
    /**
     * Triggered with A
     */
    VisualBlockInsertionType[VisualBlockInsertionType["Append"] = 1] = "Append";
})(VisualBlockInsertionType = exports.VisualBlockInsertionType || (exports.VisualBlockInsertionType = {}));
class NormalMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.Normal, '-- Normal --', mode_2.VSCodeVimCursorType.Block);
    }
}
exports.NormalMode = NormalMode;
class InsertMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.Insert, '-- Insert --', mode_2.VSCodeVimCursorType.Native);
    }
    getStatusBarCommandText(vimState) {
        return '';
    }
}
exports.InsertMode = InsertMode;
class VisualMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.Visual, '-- Visual --', mode_2.VSCodeVimCursorType.TextDecoration, true);
    }
}
exports.VisualMode = VisualMode;
class VisualBlockMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.VisualBlock, '-- Visual Block --', mode_2.VSCodeVimCursorType.TextDecoration, true);
    }
    static getTopLeftPosition(start, stop) {
        return new position_1.Position(Math.min(start.line, stop.line), Math.min(start.character, stop.character));
    }
    static getBottomRightPosition(start, stop) {
        return new position_1.Position(Math.max(start.line, stop.line), Math.max(start.character, stop.character));
    }
}
exports.VisualBlockMode = VisualBlockMode;
class VisualLineMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.VisualLine, '-- Visual Line --', mode_2.VSCodeVimCursorType.Block, true);
    }
}
exports.VisualLineMode = VisualLineMode;
class SearchInProgressMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.SearchInProgressMode, '', mode_2.VSCodeVimCursorType.Block);
    }
    getStatusBarText(vimState) {
        return `/${vimState.globalState.searchState.searchString}`;
    }
    getStatusBarCommandText(vimState) {
        return '';
    }
}
exports.SearchInProgressMode = SearchInProgressMode;
class CommandlineInProgress extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.CommandlineInProgress, '', mode_2.VSCodeVimCursorType.Block);
    }
    getStatusBarText(vimState) {
        let stringWithCursor = vimState.currentCommandlineText.split('');
        stringWithCursor.splice(vimState.statusBarCursorCharacterPos, 0, '|');
        return `:${stringWithCursor.join('')}`;
    }
    getStatusBarCommandText(vimState) {
        return '';
    }
}
exports.CommandlineInProgress = CommandlineInProgress;
class ReplaceMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.Replace, '-- Replace --', mode_2.VSCodeVimCursorType.Underline);
    }
}
exports.ReplaceMode = ReplaceMode;
class EasyMotionMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.EasyMotionMode, '-- EasyMotion --', mode_2.VSCodeVimCursorType.Block);
    }
    getStatusBarCommandText(vimState) {
        return `Target key: ${vimState.easyMotion.accumulation}`;
    }
}
exports.EasyMotionMode = EasyMotionMode;
class EasyMotionInputMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.EasyMotionInputMode, '-- EasyMotion Input --', mode_2.VSCodeVimCursorType.Block);
    }
    getStatusBarCommandText(vimState) {
        if (!vimState.easyMotion) {
            return '';
        }
        const searchCharCount = vimState.easyMotion.searchAction.searchCharCount;
        const message = searchCharCount > 0
            ? `Search for ${searchCharCount} character(s): `
            : 'Search for characters: ';
        return message + vimState.easyMotion.searchAction.getSearchString();
    }
}
exports.EasyMotionInputMode = EasyMotionInputMode;
class SurroundInputMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.SurroundInputMode, '-- Surround Input --', mode_2.VSCodeVimCursorType.Block);
    }
    getStatusBarCommandText(vimState) {
        return vimState.surround && vimState.surround.replacement ? vimState.surround.replacement : '';
    }
}
exports.SurroundInputMode = SurroundInputMode;
class DisabledMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.Disabled, '-- VIM: Disabled --', mode_2.VSCodeVimCursorType.Line);
    }
}
exports.DisabledMode = DisabledMode;

//# sourceMappingURL=modes.js.map

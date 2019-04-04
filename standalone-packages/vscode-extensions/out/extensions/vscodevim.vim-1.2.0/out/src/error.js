"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["E20"] = 20] = "E20";
    ErrorCode[ErrorCode["E32"] = 32] = "E32";
    ErrorCode[ErrorCode["E35"] = 35] = "E35";
    ErrorCode[ErrorCode["E37"] = 37] = "E37";
    ErrorCode[ErrorCode["E208"] = 208] = "E208";
    ErrorCode[ErrorCode["E348"] = 348] = "E348";
    ErrorCode[ErrorCode["E444"] = 444] = "E444";
    ErrorCode[ErrorCode["E486"] = 486] = "E486";
    ErrorCode[ErrorCode["E488"] = 488] = "E488";
    ErrorCode[ErrorCode["E492"] = 492] = "E492";
    ErrorCode[ErrorCode["E518"] = 518] = "E518";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
exports.ErrorMessage = {
    20: 'Mark not set',
    32: 'No file name',
    35: 'No previous regular expression',
    37: 'No write since last change (add ! to override)',
    208: 'Error writing to file',
    348: 'No string under cursor',
    444: 'Cannot close last window',
    486: 'Pattern not found',
    488: 'Trailing characters',
    492: 'Not an editor command',
    518: 'Unknown option',
};
class VimError extends Error {
    constructor(code, message) {
        super();
        this._code = code;
        this._message = message;
    }
    static fromCode(code) {
        if (exports.ErrorMessage[code]) {
            return new VimError(code, exports.ErrorMessage[code]);
        }
        throw new Error('unknown error code: ' + code);
    }
    get code() {
        return this._code;
    }
    get message() {
        return this._message;
    }
    toString() {
        return 'E' + this.code.toString() + ': ' + this.message;
    }
}
exports.VimError = VimError;

//# sourceMappingURL=error.js.map

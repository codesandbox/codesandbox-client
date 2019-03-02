"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../error");
const node = require("../commands/close");
const scanner_1 = require("../scanner");
function parseCloseCommandArgs(args) {
    if (!args) {
        return new node.CloseCommand({});
    }
    var scannedArgs = {};
    var scanner = new scanner_1.Scanner(args);
    const c = scanner.next();
    if (c === '!') {
        scannedArgs.bang = true;
        scanner.ignore();
    }
    else if (c !== ' ') {
        throw error_1.VimError.fromCode(error_1.ErrorCode.E488);
    }
    scanner.skipWhiteSpace();
    if (!scanner.isAtEof) {
        throw error_1.VimError.fromCode(error_1.ErrorCode.E488);
    }
    return new node.CloseCommand(scannedArgs);
}
exports.parseCloseCommandArgs = parseCloseCommandArgs;

//# sourceMappingURL=close.js.map

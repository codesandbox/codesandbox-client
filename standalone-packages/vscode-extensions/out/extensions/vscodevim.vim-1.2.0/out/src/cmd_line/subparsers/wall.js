"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../error");
const node = require("../commands/wall");
const scanner_1 = require("../scanner");
function parseWallCommandArgs(args) {
    if (!args) {
        return new node.WallCommand({});
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
    return new node.WallCommand(scannedArgs);
}
exports.parseWallCommandArgs = parseWallCommandArgs;

//# sourceMappingURL=wall.js.map

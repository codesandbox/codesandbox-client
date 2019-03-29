"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read_1 = require("../commands/read");
const scanner_1 = require("../scanner");
function parseReadCommandArgs(args) {
    if (!args) {
        throw Error('Expected arguments.');
    }
    var scannedArgs = {};
    var scanner = new scanner_1.Scanner(args);
    scanner.skipWhiteSpace();
    let c = scanner.next();
    // read command has 2 forms - 'read <file-path>' and 'read! <shell-command>'
    if (c === '!') {
        scanner.ignore();
        scanner.skipWhiteSpace();
        scannedArgs.cmd = scanner.remaining();
        if (!scannedArgs.cmd || scannedArgs.cmd.length === 0) {
            throw Error('Expected shell command.');
        }
    }
    else {
        scannedArgs.file = scanner.remaining();
        if (!scannedArgs.file || scannedArgs.file.length === 0) {
            throw Error('Expected file path.');
        }
    }
    return new read_1.ReadCommand(scannedArgs);
}
exports.parseReadCommandArgs = parseReadCommandArgs;

//# sourceMappingURL=read.js.map

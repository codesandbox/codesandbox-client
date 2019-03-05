"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writequit_1 = require("../commands/writequit");
const scanner_1 = require("../scanner");
function parseWriteQuitCommandArgs(args) {
    if (!args) {
        return new writequit_1.WriteQuitCommand({});
    }
    var scannedArgs = {};
    var scanner = new scanner_1.Scanner(args);
    while (true) {
        scanner.skipWhiteSpace();
        if (scanner.isAtEof) {
            break;
        }
        let c = scanner.next();
        switch (c) {
            case '!':
                // :writequit!
                scannedArgs.bang = true;
                scanner.ignore();
                continue;
            case '+':
                // :writequit ++opt=value
                scanner.expect('+');
                scanner.ignore();
                scanner.expectOneOf(['bin', 'nobin', 'ff', 'enc']);
                scannedArgs.opt = scanner.emit();
                scanner.expect('=');
                scanner.ignore();
                while (!scanner.isAtEof) {
                    c = scanner.next();
                    if (c !== ' ' && c !== '\t') {
                        continue;
                    }
                    scanner.backup();
                    continue;
                }
                let value = scanner.emit();
                if (!value) {
                    throw new Error('Expected value for option.');
                }
                scannedArgs.optValue = value;
                continue;
            default:
                throw new Error('Not implemented');
        }
    }
    // TODO: parse the stuff (it's really not).
    // ++bin ++nobin ++ff ++enc =VALUE
    return new writequit_1.WriteQuitCommand(scannedArgs);
}
exports.parseWriteQuitCommandArgs = parseWriteQuitCommandArgs;

//# sourceMappingURL=writequit.js.map

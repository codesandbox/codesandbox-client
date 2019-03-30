"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const write_1 = require("../commands/write");
const scanner_1 = require("../scanner");
function parseWriteCommandArgs(args) {
    if (!args) {
        return new write_1.WriteCommand({});
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
                if (scanner.start > 0) {
                    // :write !cmd
                    scanner.ignore();
                    while (!scanner.isAtEof) {
                        scanner.next();
                    }
                    // vim ignores silently if no command after :w !
                    scannedArgs.cmd = scanner.emit().trim() || undefined;
                    continue;
                }
                // :write!
                scannedArgs.bang = true;
                scanner.ignore();
                continue;
            case '+':
                // :write ++opt=value
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
                throw new Error('Not implemented.');
        }
    }
    // TODO: actually parse arguments.
    // ++bin ++nobin ++ff ++enc =VALUE
    return new write_1.WriteCommand(scannedArgs);
}
exports.parseWriteCommandArgs = parseWriteCommandArgs;

//# sourceMappingURL=write.js.map

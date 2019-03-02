"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node = require("../commands/register");
const scanner_1 = require("../scanner");
function parseRegisterCommandArgs(args) {
    if (!args) {
        return new node.RegisterCommand({});
    }
    let scanner = new scanner_1.Scanner(args);
    let name = scanner.nextWord();
    return new node.RegisterCommand({
        arg: name,
    });
}
exports.parseRegisterCommandArgs = parseRegisterCommandArgs;

//# sourceMappingURL=register.js.map

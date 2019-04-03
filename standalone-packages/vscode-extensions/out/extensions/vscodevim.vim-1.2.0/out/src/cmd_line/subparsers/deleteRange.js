"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node = require("../commands/deleteRange");
const scanner_1 = require("../scanner");
function parseDeleteRangeLinesCommandArgs(args) {
    if (!args) {
        return new node.DeleteRangeCommand({});
    }
    let scanner = new scanner_1.Scanner(args);
    let register = scanner.nextWord();
    return new node.DeleteRangeCommand({
        register: register,
    });
}
exports.parseDeleteRangeLinesCommandArgs = parseDeleteRangeLinesCommandArgs;

//# sourceMappingURL=deleteRange.js.map

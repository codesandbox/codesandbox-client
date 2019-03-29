"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node = require("../commands/digraph");
const scanner_1 = require("../scanner");
function parseDigraphCommandArgs(args) {
    if (!args) {
        return new node.DigraphsCommand({});
    }
    let scanner = new scanner_1.Scanner(args);
    let name = scanner.nextWord();
    return new node.DigraphsCommand({
        arg: name,
    });
}
exports.parseDigraphCommandArgs = parseDigraphCommandArgs;

//# sourceMappingURL=digraph.js.map

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node = require("../commands/file");
const scanner_1 = require("../scanner");
function parseEditFileCommandArgs(args) {
    if (!args) {
        return new node.FileCommand({ name: '', createFileIfNotExists: true });
    }
    let scanner = new scanner_1.Scanner(args);
    let bang;
    const c = scanner.next();
    bang = c === '!';
    if (scanner.isAtEof) {
        return new node.FileCommand({ name: '', bang: bang, createFileIfNotExists: true });
    }
    let name = scanner.nextWord();
    return new node.FileCommand({
        name: name.trim(),
        bang: bang,
        createFileIfNotExists: true,
    });
}
exports.parseEditFileCommandArgs = parseEditFileCommandArgs;
function parseEditNewFileCommandArgs() {
    return new node.FileCommand({
        name: undefined,
        createFileIfNotExists: true,
    });
}
exports.parseEditNewFileCommandArgs = parseEditNewFileCommandArgs;
function parseEditFileInNewVerticalWindowCommandArgs(args) {
    let name = '';
    if (args) {
        let scanner = new scanner_1.Scanner(args);
        name = scanner.nextWord();
    }
    return new node.FileCommand({
        name: name,
        position: node.FilePosition.NewWindowVerticalSplit,
    });
}
exports.parseEditFileInNewVerticalWindowCommandArgs = parseEditFileInNewVerticalWindowCommandArgs;
function parseEditFileInNewHorizontalWindowCommandArgs(args) {
    let name = '';
    if (args) {
        let scanner = new scanner_1.Scanner(args);
        name = scanner.nextWord();
    }
    return new node.FileCommand({
        name: name,
        position: node.FilePosition.NewWindowHorizontalSplit,
    });
}
exports.parseEditFileInNewHorizontalWindowCommandArgs = parseEditFileInNewHorizontalWindowCommandArgs;
function parseEditNewFileInNewVerticalWindowCommandArgs() {
    return new node.FileCommand({
        name: undefined,
        createFileIfNotExists: true,
        position: node.FilePosition.NewWindowVerticalSplit,
    });
}
exports.parseEditNewFileInNewVerticalWindowCommandArgs = parseEditNewFileInNewVerticalWindowCommandArgs;
function parseEditNewFileInNewHorizontalWindowCommandArgs() {
    return new node.FileCommand({
        name: undefined,
        createFileIfNotExists: true,
        position: node.FilePosition.NewWindowHorizontalSplit,
    });
}
exports.parseEditNewFileInNewHorizontalWindowCommandArgs = parseEditNewFileInNewHorizontalWindowCommandArgs;

//# sourceMappingURL=file.js.map

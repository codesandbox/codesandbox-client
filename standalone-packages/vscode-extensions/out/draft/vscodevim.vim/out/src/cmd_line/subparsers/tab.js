"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node = require("../commands/tab");
const scanner_1 = require("../scanner");
function parseCount(args) {
    if (!args) {
        return undefined;
    }
    let scanner = new scanner_1.Scanner(args);
    scanner.skipWhiteSpace();
    if (scanner.isAtEof) {
        return undefined;
    }
    let c = scanner.next();
    let count = Number.parseInt(c, 10);
    if (Number.isInteger(count) && count >= 0) {
        if (count > 999) {
            count = 999;
        }
        return count;
    }
    else {
        throw new Error(`Invalid tab number (${c}).`);
    }
}
/**
 * :tabn[ext] Go to the next tab page.
 * :tabn[ext] {count} Go to tab page {count}.
 */
function parseTabNCommandArgs(args) {
    return new node.TabCommand({
        tab: node.Tab.Next,
        count: parseCount(args),
    });
}
exports.parseTabNCommandArgs = parseTabNCommandArgs;
/**
 * :tabp[revious] Go to the previous tab page.  Wraps around from the first one  to the last one.
 * :tabp[revious] {count} Go {count} tab pages back.
 */
function parseTabPCommandArgs(args) {
    return new node.TabCommand({
        tab: node.Tab.Previous,
        count: parseCount(args),
    });
}
exports.parseTabPCommandArgs = parseTabPCommandArgs;
/**
 * :tabfir[st]  Go to the first tab page.
 */
function parseTabFirstCommandArgs(args) {
    return new node.TabCommand({
        tab: node.Tab.First,
    });
}
exports.parseTabFirstCommandArgs = parseTabFirstCommandArgs;
/**
 * :tabl[ast]  Go to the last tab page.
 */
function parseTabLastCommandArgs(args) {
    return new node.TabCommand({
        tab: node.Tab.Last,
    });
}
exports.parseTabLastCommandArgs = parseTabLastCommandArgs;
/**
 * :tabe[dit]
 * :tabnew Open a new tab page with an empty window, after the current tab page.
 */
function parseTabNewCommandArgs(args) {
    let name = '';
    if (args) {
        let scanner = new scanner_1.Scanner(args);
        name = scanner.nextWord();
    }
    return new node.TabCommand({
        tab: node.Tab.New,
        file: name,
    });
}
exports.parseTabNewCommandArgs = parseTabNewCommandArgs;
/**
 * :tabc[lose][!]  Close current tab page.
 * :tabc[lose][!] {count}. Close tab page {count}.
 */
function parseTabCloseCommandArgs(args) {
    return new node.TabCommand({
        tab: node.Tab.Close,
        count: parseCount(args),
    });
}
exports.parseTabCloseCommandArgs = parseTabCloseCommandArgs;
function parseTabOnlyCommandArgs(args) {
    return new node.TabCommand({
        tab: node.Tab.Only,
    });
}
exports.parseTabOnlyCommandArgs = parseTabOnlyCommandArgs;
function parseTabMovementCommandArgs(args) {
    return new node.TabCommand({
        tab: node.Tab.Move,
        count: parseCount(args),
    });
}
exports.parseTabMovementCommandArgs = parseTabMovementCommandArgs;

//# sourceMappingURL=tab.js.map

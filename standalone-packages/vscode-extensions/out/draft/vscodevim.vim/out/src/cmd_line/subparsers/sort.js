"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node = require("../commands/sort");
function parseSortCommandArgs(args) {
    const reverse = args !== null && args.indexOf('!') >= 0;
    return new node.SortCommand({ reverse });
}
exports.parseSortCommandArgs = parseSortCommandArgs;

//# sourceMappingURL=sort.js.map

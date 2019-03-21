"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULL_HOVER = {
    contents: []
};
exports.NULL_SIGNATURE = null;
exports.NULL_COMPLETION = {
    isIncomplete: false,
    items: []
};
exports.nullMode = {
    getId: () => '',
    onDocumentRemoved() { },
    dispose() { },
    doHover: () => exports.NULL_HOVER,
    doComplete: () => exports.NULL_COMPLETION,
    doSignatureHelp: () => exports.NULL_SIGNATURE,
    findReferences: () => []
};
//# sourceMappingURL=nullMode.js.map
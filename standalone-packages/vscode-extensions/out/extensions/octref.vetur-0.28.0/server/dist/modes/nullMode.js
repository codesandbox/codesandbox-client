"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullMode = exports.NULL_COMPLETION = exports.NULL_SIGNATURE = exports.NULL_HOVER = void 0;
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
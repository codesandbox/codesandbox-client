"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditorIdentity {
    constructor(textEditor) {
        this._fileName = (textEditor && textEditor.document && textEditor.document.fileName) || '';
    }
    get fileName() {
        return this._fileName;
    }
    isEqual(other) {
        return this.fileName === other.fileName;
    }
    toString() {
        return this.fileName;
    }
}
exports.EditorIdentity = EditorIdentity;

//# sourceMappingURL=editorIdentity.js.map

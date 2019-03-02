"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompositionState {
    constructor() {
        this.isInComposition = false;
        this.composingText = '';
    }
    reset() {
        this.isInComposition = false;
        this.composingText = '';
    }
}
exports.CompositionState = CompositionState;

//# sourceMappingURL=compositionState.js.map

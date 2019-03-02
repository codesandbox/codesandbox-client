"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModifierPair {
    constructor(openingCharacter, closingCharacter, counter) {
        this.counter = 0;
        this.openingCharacter = openingCharacter;
        this.closingCharacter = closingCharacter;
        if (counter !== undefined) {
            this.counter = counter;
        }
    }
    Clone() {
        return new ModifierPair(this.openingCharacter, this.closingCharacter, this.counter);
    }
}
exports.default = ModifierPair;
//# sourceMappingURL=modifierPair.js.map
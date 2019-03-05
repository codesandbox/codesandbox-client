"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textEditor_1 = require("./../textEditor");
/**
 * State involved with entering Replace mode (R).
 */
class ReplaceState {
    constructor(startPosition, timesToRepeat = 1) {
        this.originalChars = [];
        /**
         * The characters the user inserted in replace mode. Useful for when
         * we repeat a replace action with .
         */
        this.newChars = [];
        this.replaceCursorStartPosition = startPosition;
        this.timesToRepeat = timesToRepeat;
        let text = textEditor_1.TextEditor.getLineAt(startPosition).text.substring(startPosition.character);
        for (let [key, value] of text.split('').entries()) {
            this.originalChars[key + startPosition.character] = value;
        }
    }
}
exports.ReplaceState = ReplaceState;

//# sourceMappingURL=replaceState.js.map

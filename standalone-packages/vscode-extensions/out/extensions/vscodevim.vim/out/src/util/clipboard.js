"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const clipboardy = require("clipboardy");
class Clipboard {
    static Copy(text) {
        try {
            clipboardy.writeSync(text);
        }
        catch (e) {
            logger_1.logger.error(e, `Clipboard: Error copying to clipboard. err=${e}`);
        }
    }
    static Paste() {
        return clipboardy.readSync();
    }
}
exports.Clipboard = Clipboard;

//# sourceMappingURL=clipboard.js.map

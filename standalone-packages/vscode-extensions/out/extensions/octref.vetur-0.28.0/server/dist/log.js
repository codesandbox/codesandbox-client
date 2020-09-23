"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    _level: 1 /* INFO */,
    setLevel(level) {
        if (level === 'DEBUG') {
            this._level = 0 /* DEBUG */;
        }
        else {
            this._level = 1 /* INFO */;
        }
    },
    logDebug(msg) {
        if (this._level <= 0 /* DEBUG */) {
            console.log(`[DEBUG] ${msg}`);
        }
    },
    logInfo(msg) {
        console.log(`[INFO ] ${msg}`);
    }
};
//# sourceMappingURL=log.js.map
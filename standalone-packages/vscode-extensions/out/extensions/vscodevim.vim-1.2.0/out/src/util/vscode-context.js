"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/**
 * Wrapper around VS Code's `setContext`.
 * The API call takes several milliseconds to seconds to complete,
 * so let's cache the values and only call the API when necessary.
 */
class VsCodeContextImpl {
    constructor() {
        this.contextMap = {};
    }
    Set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const prev = this.Get(key);
            if (!prev || prev !== value) {
                this.contextMap[key] = value;
                return vscode.commands.executeCommand('setContext', key, value);
            }
        });
    }
    Get(key) {
        return this.contextMap[key];
    }
}
exports.VsCodeContext = new VsCodeContextImpl();

//# sourceMappingURL=vscode-context.js.map

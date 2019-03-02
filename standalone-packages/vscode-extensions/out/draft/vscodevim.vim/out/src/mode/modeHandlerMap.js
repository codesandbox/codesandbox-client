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
const modeHandler_1 = require("./modeHandler");
class ModeHandlerMapImpl {
    constructor() {
        this.modeHandlerMap = {};
    }
    getOrCreate(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let isNew = false;
            let modeHandler = this.modeHandlerMap[key];
            if (!modeHandler) {
                isNew = true;
                modeHandler = yield new modeHandler_1.ModeHandler();
                this.modeHandlerMap[key] = modeHandler;
            }
            return [modeHandler, isNew];
        });
    }
    get(key) {
        return this.modeHandlerMap[key];
    }
    getKeys() {
        return Object.keys(this.modeHandlerMap);
    }
    getAll() {
        return this.getKeys().map(key => this.modeHandlerMap[key]);
    }
    delete(key) {
        if (key in this.modeHandlerMap) {
            this.modeHandlerMap[key].dispose();
        }
        delete this.modeHandlerMap[key];
    }
    clear() {
        for (const key of Object.keys(this.modeHandlerMap)) {
            this.delete(key);
        }
    }
}
exports.ModeHandlerMap = new ModeHandlerMapImpl();

//# sourceMappingURL=modeHandlerMap.js.map

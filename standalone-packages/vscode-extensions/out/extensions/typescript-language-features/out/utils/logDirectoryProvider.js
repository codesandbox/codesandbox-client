"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const memoize_1 = require("./memoize");
class LogDirectoryProvider {
    constructor(context) {
        this.context = context;
    }
    getNewLogDirectory() {
        const root = this.logDirectory();
        if (root) {
            try {
                return fs.mkdtempSync(path.join(root, `tsserver-log-`));
            }
            catch (e) {
                return undefined;
            }
        }
        return undefined;
    }
    logDirectory() {
        try {
            const path = this.context.logPath;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            return this.context.logPath;
        }
        catch (_a) {
            return undefined;
        }
    }
}
__decorate([
    memoize_1.memoize
], LogDirectoryProvider.prototype, "logDirectory", null);
exports.default = LogDirectoryProvider;
//# sourceMappingURL=logDirectoryProvider.js.map
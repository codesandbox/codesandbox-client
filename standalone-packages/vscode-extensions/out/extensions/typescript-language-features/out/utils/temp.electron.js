"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTempFile = exports.getInstanceTempDir = void 0;
const fs = require("fs");
const os = require("os");
const path = require("path");
function makeRandomHexString(length) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let result = '';
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(chars.length * Math.random());
        result += chars[idx];
    }
    return result;
}
const getRootTempDir = (() => {
    let dir;
    return () => {
        if (!dir) {
            const filename = `vscode-typescript${process.platform !== 'win32' && process.getuid ? process.getuid() : ''}`;
            dir = path.join(os.tmpdir(), filename);
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dir;
    };
})();
exports.getInstanceTempDir = (() => {
    let dir;
    return () => {
        if (!dir) {
            dir = path.join(getRootTempDir(), makeRandomHexString(20));
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dir;
    };
})();
function getTempFile(prefix) {
    return path.join((0, exports.getInstanceTempDir)(), `${prefix}-${makeRandomHexString(20)}.tmp`);
}
exports.getTempFile = getTempFile;
//# sourceMappingURL=temp.electron.js.map
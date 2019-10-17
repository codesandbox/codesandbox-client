"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const os = require("os");
function makeRandomHexString(length) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let result = '';
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(chars.length * Math.random());
        result += chars[idx];
    }
    return result;
}
exports.makeRandomHexString = makeRandomHexString;
function getTempFile(name) {
    return path.join(os.tmpdir(), name);
}
exports.getTempFile = getTempFile;
//# sourceMappingURL=temp.js.map
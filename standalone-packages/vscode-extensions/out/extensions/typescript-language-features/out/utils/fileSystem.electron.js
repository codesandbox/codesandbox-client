"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCaseInsensitiveFileSystem = void 0;
const fs = require("fs");
const temp_electron_1 = require("./temp.electron");
exports.onCaseInsensitiveFileSystem = (() => {
    let value;
    return () => {
        if (typeof value === 'undefined') {
            if (process.platform === 'win32') {
                value = true;
            }
            else if (process.platform !== 'darwin') {
                value = false;
            }
            else {
                const temp = (0, temp_electron_1.getTempFile)('typescript-case-check');
                fs.writeFileSync(temp, '');
                value = fs.existsSync(temp.toUpperCase());
            }
        }
        return value;
    };
})();
//# sourceMappingURL=fileSystem.electron.js.map
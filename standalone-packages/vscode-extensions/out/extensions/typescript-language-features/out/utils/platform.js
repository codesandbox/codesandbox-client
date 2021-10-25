"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeb = void 0;
const vscode = require("vscode");
function isWeb() {
    // @ts-expect-error
    return typeof navigator !== 'undefined' && vscode.env.uiKind === vscode.UIKind.Web;
}
exports.isWeb = isWeb;
//# sourceMappingURL=platform.js.map
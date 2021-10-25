"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.nulToken = void 0;
const vscode = require("vscode");
const noopDisposable = vscode.Disposable.from();
exports.nulToken = {
    isCancellationRequested: false,
    onCancellationRequested: () => noopDisposable
};
//# sourceMappingURL=cancellation.js.map
"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nulTokenSource = new vscode.CancellationTokenSource();
exports.nulToken = nulTokenSource.token;
//# sourceMappingURL=cancellation.js.map
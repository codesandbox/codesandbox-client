/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var CodeSandboxHashService = /** @class */ (function () {
    function CodeSandboxHashService() {
    }
    CodeSandboxHashService.prototype.createSHA1 = function (content) {
        // TODO: Implement native node module after moving to ESM build
        return content;
    };
    return CodeSandboxHashService;
}());
export { CodeSandboxHashService };

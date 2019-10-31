"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var ServerResponse;
(function (ServerResponse) {
    class Cancelled {
        constructor(reason) {
            this.reason = reason;
            this.type = 'cancelled';
        }
    }
    ServerResponse.Cancelled = Cancelled;
    ServerResponse.NoContent = new class {
        constructor() {
            this.type = 'noContent';
        }
    };
})(ServerResponse = exports.ServerResponse || (exports.ServerResponse = {}));
//# sourceMappingURL=typescriptService.js.map
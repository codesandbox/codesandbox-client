/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Emitter } from './event';
var Sequence = /** @class */ (function () {
    function Sequence() {
        this.elements = [];
        this._onDidSplice = new Emitter();
        this.onDidSplice = this._onDidSplice.event;
    }
    Sequence.prototype.splice = function (start, deleteCount, toInsert) {
        if (toInsert === void 0) { toInsert = []; }
        var _a;
        (_a = this.elements).splice.apply(_a, [start, deleteCount].concat(toInsert));
        this._onDidSplice.fire({ start: start, deleteCount: deleteCount, toInsert: toInsert });
    };
    return Sequence;
}());
export { Sequence };

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export var DefaultURITransformer = new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.transformIncoming = function (uri) {
        return uri;
    };
    class_1.prototype.transformOutgoing = function (uri) {
        return uri;
    };
    return class_1;
}());

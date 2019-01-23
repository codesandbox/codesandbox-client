/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { startsWith } from '../../../base/common/strings.js';
var CodeActionKind = /** @class */ (function () {
    function CodeActionKind(value) {
        this.value = value;
    }
    CodeActionKind.prototype.contains = function (other) {
        return this.value === other || startsWith(other, this.value + CodeActionKind.sep);
    };
    CodeActionKind.sep = '.';
    CodeActionKind.Empty = new CodeActionKind('');
    CodeActionKind.Refactor = new CodeActionKind('refactor');
    CodeActionKind.Source = new CodeActionKind('source');
    CodeActionKind.SourceOrganizeImports = new CodeActionKind('source.organizeImports');
    return CodeActionKind;
}());
export { CodeActionKind };
export var CodeActionAutoApply;
(function (CodeActionAutoApply) {
    CodeActionAutoApply[CodeActionAutoApply["IfSingle"] = 1] = "IfSingle";
    CodeActionAutoApply[CodeActionAutoApply["First"] = 2] = "First";
    CodeActionAutoApply[CodeActionAutoApply["Never"] = 3] = "Never";
})(CodeActionAutoApply || (CodeActionAutoApply = {}));

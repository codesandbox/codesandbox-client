/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { EditorInput } from '../../../common/editor.js';
var RuntimeExtensionsInput = /** @class */ (function (_super) {
    __extends(RuntimeExtensionsInput, _super);
    function RuntimeExtensionsInput() {
        return _super.call(this) || this;
    }
    RuntimeExtensionsInput.prototype.getTypeId = function () {
        return RuntimeExtensionsInput.ID;
    };
    RuntimeExtensionsInput.prototype.getName = function () {
        return nls.localize('extensionsInputName', "Running Extensions");
    };
    RuntimeExtensionsInput.prototype.matches = function (other) {
        if (!(other instanceof RuntimeExtensionsInput)) {
            return false;
        }
        return true;
    };
    RuntimeExtensionsInput.prototype.resolve = function () {
        return TPromise.as(null);
    };
    RuntimeExtensionsInput.prototype.supportsSplitEditor = function () {
        return false;
    };
    RuntimeExtensionsInput.prototype.getResource = function () {
        return URI.from({
            scheme: 'runtime-extensions',
            path: 'default'
        });
    };
    RuntimeExtensionsInput.ID = 'workbench.runtimeExtensions.input';
    return RuntimeExtensionsInput;
}(EditorInput));
export { RuntimeExtensionsInput };

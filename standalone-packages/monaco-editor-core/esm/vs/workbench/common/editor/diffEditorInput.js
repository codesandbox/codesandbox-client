/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import { TPromise } from '../../../base/common/winjs.base';
import { SideBySideEditorInput, TEXT_DIFF_EDITOR_ID, BINARY_DIFF_EDITOR_ID } from '../editor';
import { BaseTextEditorModel } from './textEditorModel';
import { DiffEditorModel } from './diffEditorModel';
import { TextDiffEditorModel } from './textDiffEditorModel';
/**
 * The base editor input for the diff editor. It is made up of two editor inputs, the original version
 * and the modified version.
 */
var DiffEditorInput = /** @class */ (function (_super) {
    __extends(DiffEditorInput, _super);
    function DiffEditorInput(name, description, original, modified, forceOpenAsBinary) {
        var _this = _super.call(this, name, description, original, modified) || this;
        _this.forceOpenAsBinary = forceOpenAsBinary;
        return _this;
    }
    DiffEditorInput.prototype.getTypeId = function () {
        return DiffEditorInput.ID;
    };
    Object.defineProperty(DiffEditorInput.prototype, "originalInput", {
        get: function () {
            return this.details;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffEditorInput.prototype, "modifiedInput", {
        get: function () {
            return this.master;
        },
        enumerable: true,
        configurable: true
    });
    DiffEditorInput.prototype.resolve = function () {
        var _this = this;
        // Create Model - we never reuse our cached model if refresh is true because we cannot
        // decide for the inputs within if the cached model can be reused or not. There may be
        // inputs that need to be loaded again and thus we always recreate the model and dispose
        // the previous one - if any.
        return this.createModel().then(function (resolvedModel) {
            if (_this.cachedModel) {
                _this.cachedModel.dispose();
            }
            _this.cachedModel = resolvedModel;
            return _this.cachedModel;
        });
    };
    DiffEditorInput.prototype.getPreferredEditorId = function (candidates) {
        return this.forceOpenAsBinary ? BINARY_DIFF_EDITOR_ID : TEXT_DIFF_EDITOR_ID;
    };
    DiffEditorInput.prototype.createModel = function (refresh) {
        // Join resolve call over two inputs and build diff editor model
        return TPromise.join([
            this.originalInput.resolve(),
            this.modifiedInput.resolve()
        ]).then(function (models) {
            var originalEditorModel = models[0];
            var modifiedEditorModel = models[1];
            // If both are text models, return textdiffeditor model
            if (modifiedEditorModel instanceof BaseTextEditorModel && originalEditorModel instanceof BaseTextEditorModel) {
                return new TextDiffEditorModel(originalEditorModel, modifiedEditorModel);
            }
            // Otherwise return normal diff model
            return new DiffEditorModel(originalEditorModel, modifiedEditorModel);
        });
    };
    DiffEditorInput.prototype.dispose = function () {
        // Free the diff editor model but do not propagate the dispose() call to the two inputs
        // We never created the two inputs (original and modified) so we can not dispose
        // them without sideeffects.
        if (this.cachedModel) {
            this.cachedModel.dispose();
            this.cachedModel = null;
        }
        _super.prototype.dispose.call(this);
    };
    DiffEditorInput.ID = 'workbench.editors.diffEditorInput';
    return DiffEditorInput;
}(SideBySideEditorInput));
export { DiffEditorInput };

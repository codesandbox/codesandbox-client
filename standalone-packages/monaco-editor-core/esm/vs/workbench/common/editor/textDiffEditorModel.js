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
import { DiffEditorModel } from './diffEditorModel';
/**
 * The base text editor model for the diff editor. It is made up of two text editor models, the original version
 * and the modified version.
 */
var TextDiffEditorModel = /** @class */ (function (_super) {
    __extends(TextDiffEditorModel, _super);
    function TextDiffEditorModel(originalModel, modifiedModel) {
        var _this = _super.call(this, originalModel, modifiedModel) || this;
        _this.updateTextDiffEditorModel();
        return _this;
    }
    Object.defineProperty(TextDiffEditorModel.prototype, "originalModel", {
        get: function () {
            return this._originalModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextDiffEditorModel.prototype, "modifiedModel", {
        get: function () {
            return this._modifiedModel;
        },
        enumerable: true,
        configurable: true
    });
    TextDiffEditorModel.prototype.load = function () {
        var _this = this;
        return _super.prototype.load.call(this).then(function () {
            _this.updateTextDiffEditorModel();
            return _this;
        });
    };
    TextDiffEditorModel.prototype.updateTextDiffEditorModel = function () {
        if (this.originalModel.isResolved() && this.modifiedModel.isResolved()) {
            // Create new
            if (!this._textDiffEditorModel) {
                this._textDiffEditorModel = {
                    original: this.originalModel.textEditorModel,
                    modified: this.modifiedModel.textEditorModel
                };
            }
            // Update existing
            else {
                this._textDiffEditorModel.original = this.originalModel.textEditorModel;
                this._textDiffEditorModel.modified = this.modifiedModel.textEditorModel;
            }
        }
    };
    Object.defineProperty(TextDiffEditorModel.prototype, "textDiffEditorModel", {
        get: function () {
            return this._textDiffEditorModel;
        },
        enumerable: true,
        configurable: true
    });
    TextDiffEditorModel.prototype.isResolved = function () {
        return !!this._textDiffEditorModel;
    };
    TextDiffEditorModel.prototype.isReadonly = function () {
        return this.modifiedModel.isReadonly();
    };
    TextDiffEditorModel.prototype.dispose = function () {
        // Free the diff editor model but do not propagate the dispose() call to the two models
        // inside. We never created the two models (original and modified) so we can not dispose
        // them without sideeffects. Rather rely on the models getting disposed when their related
        // inputs get disposed from the diffEditorInput.
        this._textDiffEditorModel = null;
        _super.prototype.dispose.call(this);
    };
    return TextDiffEditorModel;
}(DiffEditorModel));
export { TextDiffEditorModel };

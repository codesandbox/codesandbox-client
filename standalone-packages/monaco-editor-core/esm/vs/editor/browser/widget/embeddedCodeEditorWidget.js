/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as objects from '../../../base/common/objects';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation';
import { ICommandService } from '../../../platform/commands/common/commands';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey';
import { ICodeEditorService } from '../services/codeEditorService';
import { CodeEditorWidget } from './codeEditorWidget';
import { IThemeService } from '../../../platform/theme/common/themeService';
import { DiffEditorWidget } from './diffEditorWidget';
import { IEditorWorkerService } from '../../common/services/editorWorkerService';
import { INotificationService } from '../../../platform/notification/common/notification';
var EmbeddedCodeEditorWidget = /** @class */ (function (_super) {
    __extends(EmbeddedCodeEditorWidget, _super);
    function EmbeddedCodeEditorWidget(domElement, options, parentEditor, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService) {
        var _this = _super.call(this, domElement, parentEditor.getRawConfiguration(), {}, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService) || this;
        _this._parentEditor = parentEditor;
        _this._overwriteOptions = options;
        // Overwrite parent's options
        _super.prototype.updateOptions.call(_this, _this._overwriteOptions);
        _this._register(parentEditor.onDidChangeConfiguration(function (e) { return _this._onParentConfigurationChanged(e); }));
        return _this;
    }
    EmbeddedCodeEditorWidget.prototype.getParentEditor = function () {
        return this._parentEditor;
    };
    EmbeddedCodeEditorWidget.prototype._onParentConfigurationChanged = function (e) {
        _super.prototype.updateOptions.call(this, this._parentEditor.getRawConfiguration());
        _super.prototype.updateOptions.call(this, this._overwriteOptions);
    };
    EmbeddedCodeEditorWidget.prototype.updateOptions = function (newOptions) {
        objects.mixin(this._overwriteOptions, newOptions, true);
        _super.prototype.updateOptions.call(this, this._overwriteOptions);
    };
    EmbeddedCodeEditorWidget = __decorate([
        __param(3, IInstantiationService),
        __param(4, ICodeEditorService),
        __param(5, ICommandService),
        __param(6, IContextKeyService),
        __param(7, IThemeService),
        __param(8, INotificationService)
    ], EmbeddedCodeEditorWidget);
    return EmbeddedCodeEditorWidget;
}(CodeEditorWidget));
export { EmbeddedCodeEditorWidget };
var EmbeddedDiffEditorWidget = /** @class */ (function (_super) {
    __extends(EmbeddedDiffEditorWidget, _super);
    function EmbeddedDiffEditorWidget(domElement, options, parentEditor, editorWorkerService, contextKeyService, instantiationService, codeEditorService, themeService, notificationService) {
        var _this = _super.call(this, domElement, parentEditor.getRawConfiguration(), editorWorkerService, contextKeyService, instantiationService, codeEditorService, themeService, notificationService) || this;
        _this._parentEditor = parentEditor;
        _this._overwriteOptions = options;
        // Overwrite parent's options
        _super.prototype.updateOptions.call(_this, _this._overwriteOptions);
        _this._register(parentEditor.onDidChangeConfiguration(function (e) { return _this._onParentConfigurationChanged(e); }));
        return _this;
    }
    EmbeddedDiffEditorWidget.prototype.getParentEditor = function () {
        return this._parentEditor;
    };
    EmbeddedDiffEditorWidget.prototype._onParentConfigurationChanged = function (e) {
        _super.prototype.updateOptions.call(this, this._parentEditor.getRawConfiguration());
        _super.prototype.updateOptions.call(this, this._overwriteOptions);
    };
    EmbeddedDiffEditorWidget.prototype.updateOptions = function (newOptions) {
        objects.mixin(this._overwriteOptions, newOptions, true);
        _super.prototype.updateOptions.call(this, this._overwriteOptions);
    };
    EmbeddedDiffEditorWidget = __decorate([
        __param(3, IEditorWorkerService),
        __param(4, IContextKeyService),
        __param(5, IInstantiationService),
        __param(6, ICodeEditorService),
        __param(7, IThemeService),
        __param(8, INotificationService)
    ], EmbeddedDiffEditorWidget);
    return EmbeddedDiffEditorWidget;
}(DiffEditorWidget));
export { EmbeddedDiffEditorWidget };

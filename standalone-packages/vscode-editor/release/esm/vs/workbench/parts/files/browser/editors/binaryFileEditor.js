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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../../nls.js';
import { BaseBinaryResourceEditor } from '../../../../browser/parts/editor/binaryEditor.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IWindowsService } from '../../../../../platform/windows/common/windows.js';
import { FileEditorInput } from '../../common/editors/fileEditorInput.js';
import { BINARY_FILE_EDITOR_ID } from '../../common/files.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
/**
 * An implementation of editor for binary files like images.
 */
var BinaryFileEditor = /** @class */ (function (_super) {
    __extends(BinaryFileEditor, _super);
    function BinaryFileEditor(telemetryService, themeService, fileService, windowsService, editorService) {
        var _this = _super.call(this, BinaryFileEditor.ID, {
            openInternal: function (input, options) { return _this.openInternal(input, options); },
            openExternal: function (resource) { return _this.openExternal(resource); }
        }, telemetryService, themeService, fileService) || this;
        _this.windowsService = windowsService;
        _this.editorService = editorService;
        return _this;
    }
    BinaryFileEditor.prototype.openInternal = function (input, options) {
        if (input instanceof FileEditorInput) {
            input.setForceOpenAsText();
            this.editorService.openEditor(input, options, this.group);
        }
    };
    BinaryFileEditor.prototype.openExternal = function (resource) {
        var _this = this;
        this.windowsService.openExternal(resource.toString()).then(function (didOpen) {
            if (!didOpen) {
                return _this.windowsService.showItemInFolder(resource.fsPath);
            }
            return void 0;
        });
    };
    BinaryFileEditor.prototype.getTitle = function () {
        return this.input ? this.input.getName() : nls.localize('binaryFileEditor', "Binary File Viewer");
    };
    BinaryFileEditor.ID = BINARY_FILE_EDITOR_ID;
    BinaryFileEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IThemeService),
        __param(2, IFileService),
        __param(3, IWindowsService),
        __param(4, IEditorService)
    ], BinaryFileEditor);
    return BinaryFileEditor;
}(BaseBinaryResourceEditor));
export { BinaryFileEditor };

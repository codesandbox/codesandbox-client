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
import * as nls from '../../../../nls.js';
import { Emitter } from '../../../../base/common/event.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { BaseEditor } from './baseEditor.js';
import { BinaryEditorModel } from '../../../common/editor/binaryEditorModel.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { ResourceViewer } from './resourceViewer.js';
import { size, clearNode } from '../../../../base/browser/dom.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { dispose } from '../../../../base/common/lifecycle.js';
/*
 * This class is only intended to be subclassed and not instantiated.
 */
var BaseBinaryResourceEditor = /** @class */ (function (_super) {
    __extends(BaseBinaryResourceEditor, _super);
    function BaseBinaryResourceEditor(id, callbacks, telemetryService, themeService, _fileService) {
        var _this = _super.call(this, id, telemetryService, themeService) || this;
        _this._fileService = _fileService;
        _this._onMetadataChanged = _this._register(new Emitter());
        _this.callbacks = callbacks;
        return _this;
    }
    Object.defineProperty(BaseBinaryResourceEditor.prototype, "onMetadataChanged", {
        get: function () { return this._onMetadataChanged.event; },
        enumerable: true,
        configurable: true
    });
    BaseBinaryResourceEditor.prototype.getTitle = function () {
        return this.input ? this.input.getName() : nls.localize('binaryEditor', "Binary Viewer");
    };
    BaseBinaryResourceEditor.prototype.createEditor = function (parent) {
        // Container for Binary
        this.binaryContainer = document.createElement('div');
        this.binaryContainer.className = 'binary-container';
        this.binaryContainer.style.outline = 'none';
        this.binaryContainer.tabIndex = 0; // enable focus support from the editor part (do not remove)
        // Custom Scrollbars
        this.scrollbar = this._register(new DomScrollableElement(this.binaryContainer, { horizontal: ScrollbarVisibility.Auto, vertical: ScrollbarVisibility.Auto }));
        parent.appendChild(this.scrollbar.getDomNode());
    };
    BaseBinaryResourceEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        return _super.prototype.setInput.call(this, input, options, token).then(function () {
            return input.resolve().then(function (model) {
                // Check for cancellation
                if (token.isCancellationRequested) {
                    return void 0;
                }
                // Assert Model instance
                if (!(model instanceof BinaryEditorModel)) {
                    return TPromise.wrapError(new Error('Unable to open file as binary'));
                }
                // Render Input
                _this.resourceViewerContext = ResourceViewer.show({ name: model.getName(), resource: model.getResource(), size: model.getSize(), etag: model.getETag(), mime: model.getMime() }, _this._fileService, _this.binaryContainer, _this.scrollbar, function (resource) { return _this.callbacks.openInternal(input, options); }, function (resource) { return _this.callbacks.openExternal(resource); }, function (meta) { return _this.handleMetadataChanged(meta); });
                return void 0;
            });
        });
    };
    BaseBinaryResourceEditor.prototype.handleMetadataChanged = function (meta) {
        this.metadata = meta;
        this._onMetadataChanged.fire();
    };
    BaseBinaryResourceEditor.prototype.getMetadata = function () {
        return this.metadata;
    };
    BaseBinaryResourceEditor.prototype.clearInput = function () {
        // Clear Meta
        this.handleMetadataChanged(null);
        // Clear Resource Viewer
        clearNode(this.binaryContainer);
        this.resourceViewerContext = dispose(this.resourceViewerContext);
        _super.prototype.clearInput.call(this);
    };
    BaseBinaryResourceEditor.prototype.layout = function (dimension) {
        // Pass on to Binary Container
        size(this.binaryContainer, dimension.width, dimension.height);
        this.scrollbar.scanDomNode();
        if (this.resourceViewerContext && this.resourceViewerContext.layout) {
            this.resourceViewerContext.layout(dimension);
        }
    };
    BaseBinaryResourceEditor.prototype.focus = function () {
        this.binaryContainer.focus();
    };
    BaseBinaryResourceEditor.prototype.dispose = function () {
        this.binaryContainer.remove();
        this.resourceViewerContext = dispose(this.resourceViewerContext);
        _super.prototype.dispose.call(this);
    };
    BaseBinaryResourceEditor = __decorate([
        __param(4, IFileService)
    ], BaseBinaryResourceEditor);
    return BaseBinaryResourceEditor;
}(BaseEditor));
export { BaseBinaryResourceEditor };

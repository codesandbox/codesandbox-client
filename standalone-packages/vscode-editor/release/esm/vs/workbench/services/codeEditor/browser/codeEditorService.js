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
import { CodeEditorServiceImpl } from '../../../../editor/browser/services/codeEditorServiceImpl.js';
import { isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorService, SIDE_GROUP, ACTIVE_GROUP } from '../../editor/common/editorService.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { TextEditorOptions } from '../../../common/editor.js';
var CodeEditorService = /** @class */ (function (_super) {
    __extends(CodeEditorService, _super);
    function CodeEditorService(editorService, themeService) {
        var _this = _super.call(this, themeService) || this;
        _this.editorService = editorService;
        return _this;
    }
    CodeEditorService.prototype.getActiveCodeEditor = function () {
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (isCodeEditor(activeTextEditorWidget)) {
            return activeTextEditorWidget;
        }
        if (isDiffEditor(activeTextEditorWidget)) {
            return activeTextEditorWidget.getModifiedEditor();
        }
        return null;
    };
    CodeEditorService.prototype.openCodeEditor = function (input, source, sideBySide) {
        // Special case: If the active editor is a diff editor and the request to open originates and
        // targets the modified side of it, we just apply the request there to prevent opening the modified
        // side as separate editor.
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (!sideBySide && // we need the current active group to be the taret
            isDiffEditor(activeTextEditorWidget) && // we only support this for active text diff editors
            input.options && // we need options to apply
            input.resource && // we need a request resource to compare with
            activeTextEditorWidget.getModel() && // we need a target model to compare with
            source === activeTextEditorWidget.getModifiedEditor() && // we need the source of this request to be the modified side of the diff editor
            input.resource.toString() === activeTextEditorWidget.getModel().modified.uri.toString() // we need the input resources to match with modified side
        ) {
            var targetEditor = activeTextEditorWidget.getModifiedEditor();
            var textOptions = TextEditorOptions.create(input.options);
            textOptions.apply(targetEditor, 0 /* Smooth */);
            return TPromise.as(targetEditor);
        }
        // Open using our normal editor service
        return this.doOpenCodeEditor(input, source, sideBySide);
    };
    CodeEditorService.prototype.doOpenCodeEditor = function (input, source, sideBySide) {
        return this.editorService.openEditor(input, sideBySide ? SIDE_GROUP : ACTIVE_GROUP).then(function (control) {
            if (control) {
                var widget = control.getControl();
                if (isCodeEditor(widget)) {
                    return widget;
                }
            }
            return null;
        });
    };
    CodeEditorService = __decorate([
        __param(0, IEditorService),
        __param(1, IThemeService)
    ], CodeEditorService);
    return CodeEditorService;
}(CodeEditorServiceImpl));
export { CodeEditorService };

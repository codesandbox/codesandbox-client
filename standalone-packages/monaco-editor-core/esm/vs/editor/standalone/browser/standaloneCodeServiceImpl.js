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
import { CodeEditorServiceImpl } from '../../browser/services/codeEditorServiceImpl';
import { windowOpenNoOpener } from '../../../base/browser/dom';
import { Schemas } from '../../../base/common/network';
var StandaloneCodeEditorServiceImpl = /** @class */ (function (_super) {
    __extends(StandaloneCodeEditorServiceImpl, _super);
    function StandaloneCodeEditorServiceImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StandaloneCodeEditorServiceImpl.prototype.getActiveCodeEditor = function () {
        return null; // not supported in the standalone case
    };
    StandaloneCodeEditorServiceImpl.prototype.openCodeEditor = function (input, source, sideBySide) {
        if (!source) {
            return TPromise.as(null);
        }
        return TPromise.as(this.doOpenEditor(source, input));
    };
    StandaloneCodeEditorServiceImpl.prototype.doOpenEditor = function (editor, input) {
        var model = this.findModel(editor, input.resource);
        if (!model) {
            if (input.resource) {
                var schema = input.resource.scheme;
                if (schema === Schemas.http || schema === Schemas.https) {
                    // This is a fully qualified http or https URL
                    windowOpenNoOpener(input.resource.toString());
                    return editor;
                }
            }
            return null;
        }
        if (window.monacoCodeSandbox &&
            window.monacoCodeSandbox.openModel) {
            window.monacoCodeSandbox.openModel(model);
        }
        var selection = input.options.selection;
        if (selection) {
            if (typeof selection.endLineNumber === 'number' && typeof selection.endColumn === 'number') {
                editor.setSelection(selection);
                editor.revealRangeInCenter(selection, 1 /* Immediate */);
            }
            else {
                var pos = {
                    lineNumber: selection.startLineNumber,
                    column: selection.startColumn
                };
                editor.setPosition(pos);
                editor.revealPositionInCenter(pos, 1 /* Immediate */);
            }
        }
        return editor;
    };
    StandaloneCodeEditorServiceImpl.prototype.findModel = function (editor, resource) {
        return window.monaco.editor.getModel(resource);
    };
    return StandaloneCodeEditorServiceImpl;
}(CodeEditorServiceImpl));
export { StandaloneCodeEditorServiceImpl };

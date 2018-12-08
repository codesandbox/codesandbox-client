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
import * as nls from '../../../nls.js';
import { EditorAction, registerEditorAction } from '../../browser/editorExtensions.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
var EditorFontZoomIn = /** @class */ (function (_super) {
    __extends(EditorFontZoomIn, _super);
    function EditorFontZoomIn() {
        return _super.call(this, {
            id: 'editor.action.fontZoomIn',
            label: nls.localize('EditorFontZoomIn.label', "Editor Font Zoom In"),
            alias: 'Editor Font Zoom In',
            precondition: null
        }) || this;
    }
    EditorFontZoomIn.prototype.run = function (accessor, editor) {
        EditorZoom.setZoomLevel(EditorZoom.getZoomLevel() + 1);
    };
    return EditorFontZoomIn;
}(EditorAction));
var EditorFontZoomOut = /** @class */ (function (_super) {
    __extends(EditorFontZoomOut, _super);
    function EditorFontZoomOut() {
        return _super.call(this, {
            id: 'editor.action.fontZoomOut',
            label: nls.localize('EditorFontZoomOut.label', "Editor Font Zoom Out"),
            alias: 'Editor Font Zoom Out',
            precondition: null
        }) || this;
    }
    EditorFontZoomOut.prototype.run = function (accessor, editor) {
        EditorZoom.setZoomLevel(EditorZoom.getZoomLevel() - 1);
    };
    return EditorFontZoomOut;
}(EditorAction));
var EditorFontZoomReset = /** @class */ (function (_super) {
    __extends(EditorFontZoomReset, _super);
    function EditorFontZoomReset() {
        return _super.call(this, {
            id: 'editor.action.fontZoomReset',
            label: nls.localize('EditorFontZoomReset.label', "Editor Font Zoom Reset"),
            alias: 'Editor Font Zoom Reset',
            precondition: null
        }) || this;
    }
    EditorFontZoomReset.prototype.run = function (accessor, editor) {
        EditorZoom.setZoomLevel(0);
    };
    return EditorFontZoomReset;
}(EditorAction));
registerEditorAction(EditorFontZoomIn);
registerEditorAction(EditorFontZoomOut);
registerEditorAction(EditorFontZoomReset);

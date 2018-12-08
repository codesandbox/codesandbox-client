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
import './goToDefinitionMouse.css';
import * as browser from '../../../base/browser/browser.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Emitter } from '../../../base/common/event.js';
import * as platform from '../../../base/common/platform.js';
function hasModifier(e, modifier) {
    return !!e[modifier];
}
/**
 * An event that encapsulates the various trigger modifiers logic needed for go to definition.
 */
var ClickLinkMouseEvent = /** @class */ (function () {
    function ClickLinkMouseEvent(source, opts) {
        this.target = source.target;
        this.hasTriggerModifier = hasModifier(source.event, opts.triggerModifier);
        this.hasSideBySideModifier = hasModifier(source.event, opts.triggerSideBySideModifier);
        this.isNoneOrSingleMouseDown = (browser.isIE || source.event.detail <= 1); // IE does not support event.detail properly
    }
    return ClickLinkMouseEvent;
}());
export { ClickLinkMouseEvent };
/**
 * An event that encapsulates the various trigger modifiers logic needed for go to definition.
 */
var ClickLinkKeyboardEvent = /** @class */ (function () {
    function ClickLinkKeyboardEvent(source, opts) {
        this.keyCodeIsTriggerKey = (source.keyCode === opts.triggerKey);
        this.keyCodeIsSideBySideKey = (source.keyCode === opts.triggerSideBySideKey);
        this.hasTriggerModifier = hasModifier(source, opts.triggerModifier);
    }
    return ClickLinkKeyboardEvent;
}());
export { ClickLinkKeyboardEvent };
var ClickLinkOptions = /** @class */ (function () {
    function ClickLinkOptions(triggerKey, triggerModifier, triggerSideBySideKey, triggerSideBySideModifier) {
        this.triggerKey = triggerKey;
        this.triggerModifier = triggerModifier;
        this.triggerSideBySideKey = triggerSideBySideKey;
        this.triggerSideBySideModifier = triggerSideBySideModifier;
    }
    ClickLinkOptions.prototype.equals = function (other) {
        return (this.triggerKey === other.triggerKey
            && this.triggerModifier === other.triggerModifier
            && this.triggerSideBySideKey === other.triggerSideBySideKey
            && this.triggerSideBySideModifier === other.triggerSideBySideModifier);
    };
    return ClickLinkOptions;
}());
export { ClickLinkOptions };
function createOptions(multiCursorModifier) {
    if (multiCursorModifier === 'altKey') {
        if (platform.isMacintosh) {
            return new ClickLinkOptions(57 /* Meta */, 'metaKey', 6 /* Alt */, 'altKey');
        }
        return new ClickLinkOptions(5 /* Ctrl */, 'ctrlKey', 6 /* Alt */, 'altKey');
    }
    if (platform.isMacintosh) {
        return new ClickLinkOptions(6 /* Alt */, 'altKey', 57 /* Meta */, 'metaKey');
    }
    return new ClickLinkOptions(6 /* Alt */, 'altKey', 5 /* Ctrl */, 'ctrlKey');
}
var ClickLinkGesture = /** @class */ (function (_super) {
    __extends(ClickLinkGesture, _super);
    function ClickLinkGesture(editor) {
        var _this = _super.call(this) || this;
        _this._onMouseMoveOrRelevantKeyDown = _this._register(new Emitter());
        _this.onMouseMoveOrRelevantKeyDown = _this._onMouseMoveOrRelevantKeyDown.event;
        _this._onExecute = _this._register(new Emitter());
        _this.onExecute = _this._onExecute.event;
        _this._onCancel = _this._register(new Emitter());
        _this.onCancel = _this._onCancel.event;
        _this._editor = editor;
        _this._opts = createOptions(_this._editor.getConfiguration().multiCursorModifier);
        _this.lastMouseMoveEvent = null;
        _this.hasTriggerKeyOnMouseDown = false;
        _this._register(_this._editor.onDidChangeConfiguration(function (e) {
            if (e.multiCursorModifier) {
                var newOpts = createOptions(_this._editor.getConfiguration().multiCursorModifier);
                if (_this._opts.equals(newOpts)) {
                    return;
                }
                _this._opts = newOpts;
                _this.lastMouseMoveEvent = null;
                _this.hasTriggerKeyOnMouseDown = false;
                _this._onCancel.fire();
            }
        }));
        _this._register(_this._editor.onMouseMove(function (e) { return _this.onEditorMouseMove(new ClickLinkMouseEvent(e, _this._opts)); }));
        _this._register(_this._editor.onMouseDown(function (e) { return _this.onEditorMouseDown(new ClickLinkMouseEvent(e, _this._opts)); }));
        _this._register(_this._editor.onMouseUp(function (e) { return _this.onEditorMouseUp(new ClickLinkMouseEvent(e, _this._opts)); }));
        _this._register(_this._editor.onKeyDown(function (e) { return _this.onEditorKeyDown(new ClickLinkKeyboardEvent(e, _this._opts)); }));
        _this._register(_this._editor.onKeyUp(function (e) { return _this.onEditorKeyUp(new ClickLinkKeyboardEvent(e, _this._opts)); }));
        _this._register(_this._editor.onMouseDrag(function () { return _this.resetHandler(); }));
        _this._register(_this._editor.onDidChangeCursorSelection(function (e) { return _this.onDidChangeCursorSelection(e); }));
        _this._register(_this._editor.onDidChangeModel(function (e) { return _this.resetHandler(); }));
        _this._register(_this._editor.onDidChangeModelContent(function () { return _this.resetHandler(); }));
        _this._register(_this._editor.onDidScrollChange(function (e) {
            if (e.scrollTopChanged || e.scrollLeftChanged) {
                _this.resetHandler();
            }
        }));
        return _this;
    }
    ClickLinkGesture.prototype.onDidChangeCursorSelection = function (e) {
        if (e.selection && e.selection.startColumn !== e.selection.endColumn) {
            this.resetHandler(); // immediately stop this feature if the user starts to select (https://github.com/Microsoft/vscode/issues/7827)
        }
    };
    ClickLinkGesture.prototype.onEditorMouseMove = function (mouseEvent) {
        this.lastMouseMoveEvent = mouseEvent;
        this._onMouseMoveOrRelevantKeyDown.fire([mouseEvent, null]);
    };
    ClickLinkGesture.prototype.onEditorMouseDown = function (mouseEvent) {
        // We need to record if we had the trigger key on mouse down because someone might select something in the editor
        // holding the mouse down and then while mouse is down start to press Ctrl/Cmd to start a copy operation and then
        // release the mouse button without wanting to do the navigation.
        // With this flag we prevent goto definition if the mouse was down before the trigger key was pressed.
        this.hasTriggerKeyOnMouseDown = mouseEvent.hasTriggerModifier;
    };
    ClickLinkGesture.prototype.onEditorMouseUp = function (mouseEvent) {
        if (this.hasTriggerKeyOnMouseDown) {
            this._onExecute.fire(mouseEvent);
        }
    };
    ClickLinkGesture.prototype.onEditorKeyDown = function (e) {
        if (this.lastMouseMoveEvent
            && (e.keyCodeIsTriggerKey // User just pressed Ctrl/Cmd (normal goto definition)
                || (e.keyCodeIsSideBySideKey && e.hasTriggerModifier) // User pressed Ctrl/Cmd+Alt (goto definition to the side)
            )) {
            this._onMouseMoveOrRelevantKeyDown.fire([this.lastMouseMoveEvent, e]);
        }
        else if (e.hasTriggerModifier) {
            this._onCancel.fire(); // remove decorations if user holds another key with ctrl/cmd to prevent accident goto declaration
        }
    };
    ClickLinkGesture.prototype.onEditorKeyUp = function (e) {
        if (e.keyCodeIsTriggerKey) {
            this._onCancel.fire();
        }
    };
    ClickLinkGesture.prototype.resetHandler = function () {
        this.lastMouseMoveEvent = null;
        this.hasTriggerKeyOnMouseDown = false;
        this._onCancel.fire();
    };
    return ClickLinkGesture;
}(Disposable));
export { ClickLinkGesture };

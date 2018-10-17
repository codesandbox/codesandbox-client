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
import { dispose, Disposable } from '../../../../base/common/lifecycle.js';
import { show, hide, addClass } from '../../../../base/browser/dom.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as EditorExtensions } from '../../editor.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { IPartService } from '../../../services/part/common/partService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgressService, LongRunningOperation } from '../../../../platform/progress/common/progress.js';
import { DEFAULT_EDITOR_MIN_DIMENSIONS, DEFAULT_EDITOR_MAX_DIMENSIONS } from './editor.js';
import { Emitter } from '../../../../base/common/event.js';
var EditorControl = /** @class */ (function (_super) {
    __extends(EditorControl, _super);
    function EditorControl(parent, groupView, partService, instantiationService, progressService) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.groupView = groupView;
        _this.partService = partService;
        _this.instantiationService = instantiationService;
        _this._onDidFocus = _this._register(new Emitter());
        _this._onDidSizeConstraintsChange = _this._register(new Emitter());
        _this.controls = [];
        _this.activeControlDisposeables = [];
        _this.editorOperation = _this._register(new LongRunningOperation(progressService));
        return _this;
    }
    Object.defineProperty(EditorControl.prototype, "minimumWidth", {
        get: function () { return this._activeControl ? this._activeControl.minimumWidth : DEFAULT_EDITOR_MIN_DIMENSIONS.width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorControl.prototype, "minimumHeight", {
        get: function () { return this._activeControl ? this._activeControl.minimumHeight : DEFAULT_EDITOR_MIN_DIMENSIONS.height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorControl.prototype, "maximumWidth", {
        get: function () { return this._activeControl ? this._activeControl.maximumWidth : DEFAULT_EDITOR_MAX_DIMENSIONS.width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorControl.prototype, "maximumHeight", {
        get: function () { return this._activeControl ? this._activeControl.maximumHeight : DEFAULT_EDITOR_MAX_DIMENSIONS.height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorControl.prototype, "onDidFocus", {
        get: function () { return this._onDidFocus.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorControl.prototype, "onDidSizeConstraintsChange", {
        get: function () { return this._onDidSizeConstraintsChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorControl.prototype, "activeControl", {
        get: function () {
            return this._activeControl;
        },
        enumerable: true,
        configurable: true
    });
    EditorControl.prototype.openEditor = function (editor, options) {
        // Editor control
        var descriptor = Registry.as(EditorExtensions.Editors).getEditor(editor);
        var control = this.doShowEditorControl(descriptor, options);
        // Set input
        return this.doSetInput(control, editor, options).then((function (editorChanged) { return ({ control: control, editorChanged: editorChanged }); }));
    };
    EditorControl.prototype.doShowEditorControl = function (descriptor, options) {
        // Return early if the currently active editor control can handle the input
        if (this._activeControl && descriptor.describes(this._activeControl)) {
            return this._activeControl;
        }
        // Hide active one first
        this.doHideActiveEditorControl();
        // Create editor
        var control = this.doCreateEditorControl(descriptor);
        // Set editor as active
        this.doSetActiveControl(control);
        // Show editor
        this.parent.appendChild(control.getContainer());
        show(control.getContainer());
        // Indicate to editor that it is now visible
        control.setVisible(true, this.groupView);
        // Layout
        if (this.dimension) {
            control.layout(this.dimension);
        }
        return control;
    };
    EditorControl.prototype.doCreateEditorControl = function (descriptor) {
        // Instantiate editor
        var control = this.doInstantiateEditorControl(descriptor);
        // Create editor container as needed
        if (!control.getContainer()) {
            var controlInstanceContainer = document.createElement('div');
            addClass(controlInstanceContainer, 'editor-instance');
            controlInstanceContainer.id = descriptor.getId();
            control.create(controlInstanceContainer);
        }
        return control;
    };
    EditorControl.prototype.doInstantiateEditorControl = function (descriptor) {
        // Return early if already instantiated
        var existingControl = this.controls.filter(function (control) { return descriptor.describes(control); })[0];
        if (existingControl) {
            return existingControl;
        }
        // Otherwise instantiate new
        var control = this._register(descriptor.instantiate(this.instantiationService));
        this.controls.push(control);
        return control;
    };
    EditorControl.prototype.doSetActiveControl = function (control) {
        var _this = this;
        this._activeControl = control;
        // Clear out previous active control listeners
        this.activeControlDisposeables = dispose(this.activeControlDisposeables);
        // Listen to control changes
        if (control) {
            this.activeControlDisposeables.push(control.onDidSizeConstraintsChange(function (e) { return _this._onDidSizeConstraintsChange.fire(e); }));
            this.activeControlDisposeables.push(control.onDidFocus(function () { return _this._onDidFocus.fire(); }));
        }
        // Indicate that size constraints could have changed due to new editor
        this._onDidSizeConstraintsChange.fire();
    };
    EditorControl.prototype.doSetInput = function (control, editor, options) {
        // If the input did not change, return early and only apply the options
        // unless the options instruct us to force open it even if it is the same
        var forceReload = options && options.forceReload;
        var inputMatches = control.input && control.input.matches(editor);
        if (inputMatches && !forceReload) {
            // Forward options
            control.setOptions(options);
            // Still focus as needed
            var focus_1 = !options || !options.preserveFocus;
            if (focus_1) {
                control.focus();
            }
            return TPromise.as(false);
        }
        // Show progress while setting input after a certain timeout. If the workbench is opening
        // be more relaxed about progress showing by increasing the delay a little bit to reduce flicker.
        var operation = this.editorOperation.start(this.partService.isCreated() ? 800 : 3200);
        // Call into editor control
        var editorWillChange = !inputMatches;
        return TPromise.wrap(control.setInput(editor, options, operation.token)).then(function () {
            // Focus (unless prevented or another operation is running)
            if (operation.isCurrent()) {
                var focus_2 = !options || !options.preserveFocus;
                if (focus_2) {
                    control.focus();
                }
            }
            // Operation done
            operation.stop();
            return editorWillChange;
        }, function (e) {
            // Operation done
            operation.stop();
            return TPromise.wrapError(e);
        });
    };
    EditorControl.prototype.doHideActiveEditorControl = function () {
        if (!this._activeControl) {
            return;
        }
        // Stop any running operation
        this.editorOperation.stop();
        // Remove control from parent and hide
        var controlInstanceContainer = this._activeControl.getContainer();
        this.parent.removeChild(controlInstanceContainer);
        hide(controlInstanceContainer);
        // Indicate to editor control
        this._activeControl.clearInput();
        this._activeControl.setVisible(false, this.groupView);
        // Clear active control
        this.doSetActiveControl(null);
    };
    EditorControl.prototype.closeEditor = function (editor) {
        if (this._activeControl && editor.matches(this._activeControl.input)) {
            this.doHideActiveEditorControl();
        }
    };
    EditorControl.prototype.layout = function (dimension) {
        this.dimension = dimension;
        if (this._activeControl && this.dimension) {
            this._activeControl.layout(this.dimension);
        }
    };
    EditorControl.prototype.shutdown = function () {
        // Forward to all editor controls
        this.controls.forEach(function (editor) { return editor.shutdown(); });
    };
    EditorControl.prototype.dispose = function () {
        this.activeControlDisposeables = dispose(this.activeControlDisposeables);
        _super.prototype.dispose.call(this);
    };
    EditorControl = __decorate([
        __param(2, IPartService),
        __param(3, IInstantiationService),
        __param(4, IProgressService)
    ], EditorControl);
    return EditorControl;
}(Disposable));
export { EditorControl };

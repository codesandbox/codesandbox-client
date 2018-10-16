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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as DOM from '../../../../base/browser/dom';
import { Registry } from '../../../../platform/registry/common/platform';
import { BaseEditor } from './baseEditor';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { scrollbarShadow } from '../../../../platform/theme/common/colorRegistry';
import { Extensions as EditorExtensions } from '../../editor';
import { SplitView, Sizing } from '../../../../base/browser/ui/splitview/splitview';
import { Event, Relay, anyEvent, mapEvent, Emitter } from '../../../../base/common/event';
var SideBySideEditor = /** @class */ (function (_super) {
    __extends(SideBySideEditor, _super);
    function SideBySideEditor(telemetryService, instantiationService, themeService) {
        var _this = _super.call(this, SideBySideEditor.ID, telemetryService, themeService) || this;
        _this.instantiationService = instantiationService;
        _this.dimension = new DOM.Dimension(0, 0);
        _this.onDidCreateEditors = _this._register(new Emitter());
        _this._onDidSizeConstraintsChange = _this._register(new Relay());
        _this.onDidSizeConstraintsChange = anyEvent(_this.onDidCreateEditors.event, _this._onDidSizeConstraintsChange.event);
        return _this;
    }
    Object.defineProperty(SideBySideEditor.prototype, "minimumMasterWidth", {
        get: function () { return this.masterEditor ? this.masterEditor.minimumWidth : 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "maximumMasterWidth", {
        get: function () { return this.masterEditor ? this.masterEditor.maximumWidth : Number.POSITIVE_INFINITY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "minimumMasterHeight", {
        get: function () { return this.masterEditor ? this.masterEditor.minimumHeight : 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "maximumMasterHeight", {
        get: function () { return this.masterEditor ? this.masterEditor.maximumHeight : Number.POSITIVE_INFINITY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "minimumDetailsWidth", {
        get: function () { return this.detailsEditor ? this.detailsEditor.minimumWidth : 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "maximumDetailsWidth", {
        get: function () { return this.detailsEditor ? this.detailsEditor.maximumWidth : Number.POSITIVE_INFINITY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "minimumDetailsHeight", {
        get: function () { return this.detailsEditor ? this.detailsEditor.minimumHeight : 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "maximumDetailsHeight", {
        get: function () { return this.detailsEditor ? this.detailsEditor.maximumHeight : Number.POSITIVE_INFINITY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "minimumWidth", {
        get: function () { return this.minimumMasterWidth + this.minimumDetailsWidth; },
        // these setters need to exist because this extends from BaseEditor
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "maximumWidth", {
        get: function () { return this.maximumMasterWidth + this.maximumDetailsWidth; },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "minimumHeight", {
        get: function () { return this.minimumMasterHeight + this.minimumDetailsHeight; },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySideEditor.prototype, "maximumHeight", {
        get: function () { return this.maximumMasterHeight + this.maximumDetailsHeight; },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    SideBySideEditor.prototype.createEditor = function (parent) {
        var _this = this;
        DOM.addClass(parent, 'side-by-side-editor');
        this.splitview = this._register(new SplitView(parent, { orientation: 1 /* HORIZONTAL */ }));
        this._register(this.splitview.onDidSashReset(function () { return _this.splitview.distributeViewSizes(); }));
        this.detailsEditorContainer = DOM.$('.details-editor-container');
        this.splitview.addView({
            element: this.detailsEditorContainer,
            layout: function (size) { return _this.detailsEditor && _this.detailsEditor.layout(new DOM.Dimension(size, _this.dimension.height)); },
            minimumSize: 220,
            maximumSize: Number.POSITIVE_INFINITY,
            onDidChange: Event.None
        }, Sizing.Distribute);
        this.masterEditorContainer = DOM.$('.master-editor-container');
        this.splitview.addView({
            element: this.masterEditorContainer,
            layout: function (size) { return _this.masterEditor && _this.masterEditor.layout(new DOM.Dimension(size, _this.dimension.height)); },
            minimumSize: 220,
            maximumSize: Number.POSITIVE_INFINITY,
            onDidChange: Event.None
        }, Sizing.Distribute);
        this.updateStyles();
    };
    SideBySideEditor.prototype.setInput = function (newInput, options, token) {
        var _this = this;
        var oldInput = this.input;
        return _super.prototype.setInput.call(this, newInput, options, token)
            .then(function () { return _this.updateInput(oldInput, newInput, options, token); });
    };
    SideBySideEditor.prototype.setOptions = function (options) {
        if (this.masterEditor) {
            this.masterEditor.setOptions(options);
        }
    };
    SideBySideEditor.prototype.setEditorVisible = function (visible, group) {
        if (this.masterEditor) {
            this.masterEditor.setVisible(visible, group);
        }
        if (this.detailsEditor) {
            this.detailsEditor.setVisible(visible, group);
        }
        _super.prototype.setEditorVisible.call(this, visible, group);
    };
    SideBySideEditor.prototype.clearInput = function () {
        if (this.masterEditor) {
            this.masterEditor.clearInput();
        }
        if (this.detailsEditor) {
            this.detailsEditor.clearInput();
        }
        this.disposeEditors();
        _super.prototype.clearInput.call(this);
    };
    SideBySideEditor.prototype.focus = function () {
        if (this.masterEditor) {
            this.masterEditor.focus();
        }
    };
    SideBySideEditor.prototype.layout = function (dimension) {
        this.dimension = dimension;
        this.splitview.layout(dimension.width);
    };
    SideBySideEditor.prototype.getControl = function () {
        if (this.masterEditor) {
            return this.masterEditor.getControl();
        }
        return null;
    };
    SideBySideEditor.prototype.getMasterEditor = function () {
        return this.masterEditor;
    };
    SideBySideEditor.prototype.getDetailsEditor = function () {
        return this.detailsEditor;
    };
    SideBySideEditor.prototype.updateInput = function (oldInput, newInput, options, token) {
        if (!newInput.matches(oldInput)) {
            if (oldInput) {
                this.disposeEditors();
            }
            return this.setNewInput(newInput, options, token);
        }
        return Promise.all([this.detailsEditor.setInput(newInput.details, null, token), this.masterEditor.setInput(newInput.master, options, token)]).then(function () { return void 0; });
    };
    SideBySideEditor.prototype.setNewInput = function (newInput, options, token) {
        var detailsEditor = this._createEditor(newInput.details, this.detailsEditorContainer);
        var masterEditor = this._createEditor(newInput.master, this.masterEditorContainer);
        return this.onEditorsCreated(detailsEditor, masterEditor, newInput.details, newInput.master, options, token);
    };
    SideBySideEditor.prototype._createEditor = function (editorInput, container) {
        var descriptor = Registry.as(EditorExtensions.Editors).getEditor(editorInput);
        var editor = descriptor.instantiate(this.instantiationService);
        editor.create(container);
        editor.setVisible(this.isVisible(), this.group);
        return editor;
    };
    SideBySideEditor.prototype.onEditorsCreated = function (details, master, detailsInput, masterInput, options, token) {
        var _this = this;
        this.detailsEditor = details;
        this.masterEditor = master;
        this._onDidSizeConstraintsChange.input = anyEvent(mapEvent(details.onDidSizeConstraintsChange, function () { return undefined; }), mapEvent(master.onDidSizeConstraintsChange, function () { return undefined; }));
        this.onDidCreateEditors.fire();
        return Promise.all([this.detailsEditor.setInput(detailsInput, null, token), this.masterEditor.setInput(masterInput, options, token)]).then(function () { return _this.focus(); });
    };
    SideBySideEditor.prototype.updateStyles = function () {
        _super.prototype.updateStyles.call(this);
        if (this.masterEditorContainer) {
            this.masterEditorContainer.style.boxShadow = "-6px 0 5px -5px " + this.getColor(scrollbarShadow);
        }
    };
    SideBySideEditor.prototype.disposeEditors = function () {
        if (this.detailsEditor) {
            this.detailsEditor.dispose();
            this.detailsEditor = null;
        }
        if (this.masterEditor) {
            this.masterEditor.dispose();
            this.masterEditor = null;
        }
        this.detailsEditorContainer.innerHTML = '';
        this.masterEditorContainer.innerHTML = '';
    };
    SideBySideEditor.prototype.dispose = function () {
        this.disposeEditors();
        _super.prototype.dispose.call(this);
    };
    SideBySideEditor.ID = 'workbench.editor.sidebysideEditor';
    SideBySideEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IInstantiationService),
        __param(2, IThemeService)
    ], SideBySideEditor);
    return SideBySideEditor;
}(BaseEditor));
export { SideBySideEditor };

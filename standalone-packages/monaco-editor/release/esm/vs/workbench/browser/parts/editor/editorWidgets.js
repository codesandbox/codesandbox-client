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
import { Widget } from '../../../../base/browser/ui/widget.js';
import { OverlayWidgetPositionPreference } from '../../../../editor/browser/editorBrowser.js';
import { Emitter } from '../../../../base/common/event.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { $, append } from '../../../../base/browser/dom.js';
import { attachStylerCallback } from '../../../../platform/theme/common/styler.js';
import { buttonBackground, buttonForeground, editorBackground, editorForeground, contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWindowService } from '../../../../platform/windows/common/windows.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { Schemas } from '../../../../base/common/network.js';
import { WORKSPACE_EXTENSION } from '../../../../platform/workspaces/common/workspaces.js';
import { extname } from '../../../../base/common/paths.js';
import { Disposable, dispose } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { isEqual } from '../../../../base/common/resources.js';
var FloatingClickWidget = /** @class */ (function (_super) {
    __extends(FloatingClickWidget, _super);
    function FloatingClickWidget(editor, label, keyBindingAction, keybindingService, themeService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.label = label;
        _this.themeService = themeService;
        _this._onClick = _this._register(new Emitter());
        if (keyBindingAction) {
            var keybinding = keybindingService.lookupKeybinding(keyBindingAction);
            if (keybinding) {
                _this.label += " (" + keybinding.getLabel() + ")";
            }
        }
        return _this;
    }
    Object.defineProperty(FloatingClickWidget.prototype, "onClick", {
        get: function () { return this._onClick.event; },
        enumerable: true,
        configurable: true
    });
    FloatingClickWidget.prototype.getId = function () {
        return 'editor.overlayWidget.floatingClickWidget';
    };
    FloatingClickWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    FloatingClickWidget.prototype.getPosition = function () {
        return {
            preference: OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
        };
    };
    FloatingClickWidget.prototype.render = function () {
        var _this = this;
        this._domNode = $('.floating-click-widget');
        this._register(attachStylerCallback(this.themeService, { buttonBackground: buttonBackground, buttonForeground: buttonForeground, editorBackground: editorBackground, editorForeground: editorForeground, contrastBorder: contrastBorder }, function (colors) {
            _this._domNode.style.backgroundColor = colors.buttonBackground ? colors.buttonBackground.toString() : colors.editorBackground.toString();
            _this._domNode.style.color = colors.buttonForeground ? colors.buttonForeground.toString() : colors.editorForeground.toString();
            var borderColor = colors.contrastBorder ? colors.contrastBorder.toString() : null;
            _this._domNode.style.borderWidth = borderColor ? '1px' : null;
            _this._domNode.style.borderStyle = borderColor ? 'solid' : null;
            _this._domNode.style.borderColor = borderColor;
        }));
        append(this._domNode, $('')).textContent = this.label;
        this.onclick(this._domNode, function (e) { return _this._onClick.fire(); });
        this.editor.addOverlayWidget(this);
    };
    FloatingClickWidget.prototype.dispose = function () {
        this.editor.removeOverlayWidget(this);
        _super.prototype.dispose.call(this);
    };
    FloatingClickWidget = __decorate([
        __param(3, IKeybindingService),
        __param(4, IThemeService)
    ], FloatingClickWidget);
    return FloatingClickWidget;
}(Widget));
export { FloatingClickWidget };
var OpenWorkspaceButtonContribution = /** @class */ (function (_super) {
    __extends(OpenWorkspaceButtonContribution, _super);
    function OpenWorkspaceButtonContribution(editor, instantiationService, windowService, contextService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.instantiationService = instantiationService;
        _this.windowService = windowService;
        _this.contextService = contextService;
        _this.update();
        _this.registerListeners();
        return _this;
    }
    OpenWorkspaceButtonContribution.get = function (editor) {
        return editor.getContribution(OpenWorkspaceButtonContribution.ID);
    };
    OpenWorkspaceButtonContribution.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.editor.onDidChangeModel(function (e) { return _this.update(); }));
    };
    OpenWorkspaceButtonContribution.prototype.getId = function () {
        return OpenWorkspaceButtonContribution.ID;
    };
    OpenWorkspaceButtonContribution.prototype.update = function () {
        if (!this.shouldShowButton(this.editor)) {
            this.disposeOpenWorkspaceWidgetRenderer();
            return;
        }
        this.createOpenWorkspaceWidgetRenderer();
    };
    OpenWorkspaceButtonContribution.prototype.shouldShowButton = function (editor) {
        var model = editor.getModel();
        if (!model) {
            return false; // we need a model
        }
        if (model.uri.scheme !== Schemas.file || extname(model.uri.fsPath) !== "." + WORKSPACE_EXTENSION) {
            return false; // we need a local workspace file
        }
        if (this.contextService.getWorkbenchState() === 3 /* WORKSPACE */) {
            var workspaceConfiguration = this.contextService.getWorkspace().configuration;
            if (workspaceConfiguration && isEqual(workspaceConfiguration, model.uri)) {
                return false; // already inside workspace
            }
        }
        return true;
    };
    OpenWorkspaceButtonContribution.prototype.createOpenWorkspaceWidgetRenderer = function () {
        var _this = this;
        if (!this.openWorkspaceButton) {
            this.openWorkspaceButton = this.instantiationService.createInstance(FloatingClickWidget, this.editor, localize('openWorkspace', "Open Workspace"), null);
            this._register(this.openWorkspaceButton.onClick(function () { return _this.windowService.openWindow([_this.editor.getModel().uri]); }));
            this.openWorkspaceButton.render();
        }
    };
    OpenWorkspaceButtonContribution.prototype.disposeOpenWorkspaceWidgetRenderer = function () {
        this.openWorkspaceButton = dispose(this.openWorkspaceButton);
    };
    OpenWorkspaceButtonContribution.prototype.dispose = function () {
        this.disposeOpenWorkspaceWidgetRenderer();
        _super.prototype.dispose.call(this);
    };
    OpenWorkspaceButtonContribution.ID = 'editor.contrib.openWorkspaceButton';
    OpenWorkspaceButtonContribution = __decorate([
        __param(1, IInstantiationService),
        __param(2, IWindowService),
        __param(3, IWorkspaceContextService)
    ], OpenWorkspaceButtonContribution);
    return OpenWorkspaceButtonContribution;
}(Disposable));
export { OpenWorkspaceButtonContribution };

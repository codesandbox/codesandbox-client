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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import * as dom from '../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { BreadcrumbsItem, BreadcrumbsWidget } from '../../../../base/browser/ui/breadcrumbs/breadcrumbsWidget.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { tail } from '../../../../base/common/arrays.js';
import { timeout } from '../../../../base/common/async.js';
import { combinedDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import './media/breadcrumbscontrol.css';
import { isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { Range } from '../../../../editor/common/core/range.js';
import { symbolKindToCssClass } from '../../../../editor/common/modes.js';
import { OutlineElement, OutlineGroup, OutlineModel, TreeElement } from '../../../../editor/contrib/documentSymbols/outlineModel.js';
import { localize } from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { FileKind, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IListService, WorkbenchListFocusContextKey } from '../../../../platform/list/browser/listService.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { attachBreadcrumbsStyler } from '../../../../platform/theme/common/styler.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { FileLabel } from '../../labels.js';
import { BreadcrumbsConfig, IBreadcrumbsService } from './breadcrumbs.js';
import { EditorBreadcrumbsModel, FileElement } from './breadcrumbsModel.js';
import { createBreadcrumbsPicker } from './breadcrumbsPicker.js';
import { SideBySideEditorInput } from '../../../common/editor.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(element, options, _instantiationService) {
        var _this = _super.call(this) || this;
        _this.element = element;
        _this.options = options;
        _this._instantiationService = _instantiationService;
        _this._disposables = [];
        return _this;
    }
    Item.prototype.dispose = function () {
        dispose(this._disposables);
    };
    Item.prototype.equals = function (other) {
        if (!(other instanceof Item)) {
            return false;
        }
        if (this.element instanceof FileElement && other.element instanceof FileElement) {
            return isEqual(this.element.uri, other.element.uri);
        }
        if (this.element instanceof TreeElement && other.element instanceof TreeElement) {
            return this.element.id === other.element.id;
        }
        return false;
    };
    Item.prototype.render = function (container) {
        if (this.element instanceof FileElement) {
            // file/folder
            var label = this._instantiationService.createInstance(FileLabel, container, {});
            label.setFile(this.element.uri, {
                hidePath: true,
                hideIcon: this.element.kind === FileKind.FOLDER || !this.options.showFileIcons,
                fileKind: this.element.kind,
                fileDecorations: { colors: this.options.showDecorationColors, badges: false },
            });
            dom.addClass(container, FileKind[this.element.kind].toLowerCase());
            this._disposables.push(label);
        }
        else if (this.element instanceof OutlineModel) {
            // has outline element but not in one
            var label = document.createElement('div');
            label.innerHTML = '&hellip;';
            label.className = 'hint-more';
            container.appendChild(label);
        }
        else if (this.element instanceof OutlineGroup) {
            // provider
            var label = new IconLabel(container);
            label.setValue(this.element.provider.displayName);
            this._disposables.push(label);
        }
        else if (this.element instanceof OutlineElement) {
            // symbol
            if (this.options.showSymbolIcons) {
                var icon = document.createElement('div');
                icon.className = symbolKindToCssClass(this.element.symbol.kind);
                container.appendChild(icon);
                dom.addClass(container, 'shows-symbol-icon');
            }
            var label = new IconLabel(container);
            var title = this.element.symbol.name.replace(/\r|\n|\r\n/g, '\u23CE');
            label.setValue(title);
            this._disposables.push(label);
        }
    };
    Item = __decorate([
        __param(2, IInstantiationService)
    ], Item);
    return Item;
}(BreadcrumbsItem));
var BreadcrumbsControl = /** @class */ (function () {
    function BreadcrumbsControl(container, _options, _editorGroup, _contextKeyService, _contextViewService, _editorService, _codeEditorService, _workspaceService, _instantiationService, _themeService, _quickOpenService, _configurationService, _fileService, _telemetryService, breadcrumbsService) {
        this._options = _options;
        this._editorGroup = _editorGroup;
        this._contextKeyService = _contextKeyService;
        this._contextViewService = _contextViewService;
        this._editorService = _editorService;
        this._codeEditorService = _codeEditorService;
        this._workspaceService = _workspaceService;
        this._instantiationService = _instantiationService;
        this._themeService = _themeService;
        this._quickOpenService = _quickOpenService;
        this._configurationService = _configurationService;
        this._fileService = _fileService;
        this._telemetryService = _telemetryService;
        this._disposables = new Array();
        this._breadcrumbsDisposables = new Array();
        this._breadcrumbsPickerShowing = false;
        this.domNode = document.createElement('div');
        dom.addClass(this.domNode, 'breadcrumbs-control');
        dom.append(container, this.domNode);
        this._widget = new BreadcrumbsWidget(this.domNode);
        this._widget.onDidSelectItem(this._onSelectEvent, this, this._disposables);
        this._widget.onDidFocusItem(this._onFocusEvent, this, this._disposables);
        this._widget.onDidChangeFocus(this._updateCkBreadcrumbsActive, this, this._disposables);
        this._disposables.push(attachBreadcrumbsStyler(this._widget, this._themeService, { breadcrumbsBackground: _options.breadcrumbsBackground }));
        this._ckBreadcrumbsPossible = BreadcrumbsControl.CK_BreadcrumbsPossible.bindTo(this._contextKeyService);
        this._ckBreadcrumbsVisible = BreadcrumbsControl.CK_BreadcrumbsVisible.bindTo(this._contextKeyService);
        this._ckBreadcrumbsActive = BreadcrumbsControl.CK_BreadcrumbsActive.bindTo(this._contextKeyService);
        this._cfUseQuickPick = BreadcrumbsConfig.UseQuickPick.bindTo(_configurationService);
        this._disposables.push(breadcrumbsService.register(this._editorGroup.id, this._widget));
    }
    BreadcrumbsControl.prototype.dispose = function () {
        this._disposables = dispose(this._disposables);
        this._breadcrumbsDisposables = dispose(this._breadcrumbsDisposables);
        this._ckBreadcrumbsPossible.reset();
        this._ckBreadcrumbsVisible.reset();
        this._ckBreadcrumbsActive.reset();
        this._cfUseQuickPick.dispose();
        this._widget.dispose();
        this.domNode.remove();
    };
    BreadcrumbsControl.prototype.layout = function (dim) {
        this._widget.layout(dim);
    };
    BreadcrumbsControl.prototype.isHidden = function () {
        return dom.hasClass(this.domNode, 'hidden');
    };
    BreadcrumbsControl.prototype.hide = function () {
        this._breadcrumbsDisposables = dispose(this._breadcrumbsDisposables);
        this._ckBreadcrumbsVisible.set(false);
        dom.toggleClass(this.domNode, 'hidden', true);
    };
    BreadcrumbsControl.prototype.update = function () {
        var _this = this;
        this._breadcrumbsDisposables = dispose(this._breadcrumbsDisposables);
        // honor diff editors and such
        var input = this._editorGroup.activeEditor;
        if (input instanceof SideBySideEditorInput) {
            input = input.master;
        }
        if (!input || !input.getResource() || (input.getResource().scheme !== Schemas.untitled && !this._fileService.canHandleResource(input.getResource()))) {
            // cleanup and return when there is no input or when
            // we cannot handle this input
            this._ckBreadcrumbsPossible.set(false);
            if (!this.isHidden()) {
                this.hide();
                return true;
            }
            else {
                return false;
            }
        }
        dom.toggleClass(this.domNode, 'hidden', false);
        this._ckBreadcrumbsVisible.set(true);
        this._ckBreadcrumbsPossible.set(true);
        var editor = this._getActiveCodeEditor();
        var model = new EditorBreadcrumbsModel(input.getResource(), editor, this._workspaceService, this._configurationService);
        dom.toggleClass(this.domNode, 'relative-path', model.isRelative());
        var updateBreadcrumbs = function () {
            var items = model.getElements().map(function (element) { return new Item(element, _this._options, _this._instantiationService); });
            _this._widget.setItems(items);
            _this._widget.reveal(items[items.length - 1]);
        };
        var listener = model.onDidUpdate(updateBreadcrumbs);
        updateBreadcrumbs();
        this._breadcrumbsDisposables = [model, listener];
        // close picker on hide/update
        this._breadcrumbsDisposables.push({
            dispose: function () {
                if (_this._breadcrumbsPickerShowing) {
                    _this._contextViewService.hideContextView(_this);
                }
            }
        });
        return true;
    };
    BreadcrumbsControl.prototype._getActiveCodeEditor = function () {
        var control = this._editorGroup.activeControl.getControl();
        var editor;
        if (isCodeEditor(control)) {
            editor = control;
        }
        else if (isDiffEditor(control)) {
            editor = control.getModifiedEditor();
        }
        return editor;
    };
    BreadcrumbsControl.prototype._onFocusEvent = function (event) {
        if (event.item && this._breadcrumbsPickerShowing) {
            return this._widget.setSelection(event.item);
        }
    };
    BreadcrumbsControl.prototype._onSelectEvent = function (event) {
        var _this = this;
        if (!event.item) {
            return;
        }
        var element = event.item.element;
        this._editorGroup.focus();
        /* __GDPR__
            "breadcrumbs/select" : {
                "type": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this._telemetryService.publicLog('breadcrumbs/select', { type: element instanceof TreeElement ? 'symbol' : 'file' });
        var group = this._getEditorGroup(event.payload);
        if (group !== undefined) {
            // reveal the item
            this._widget.setFocused(undefined);
            this._widget.setSelection(undefined);
            this._revealInEditor(event, element, group);
            return;
        }
        if (this._cfUseQuickPick.getValue()) {
            // using quick pick
            this._widget.setFocused(undefined);
            this._widget.setSelection(undefined);
            this._quickOpenService.show(element instanceof TreeElement ? '@' : '');
            return;
        }
        // show picker
        var picker;
        var editor = this._getActiveCodeEditor();
        var editorDecorations = [];
        var editorViewState;
        this._contextViewService.showContextView({
            render: function (parent) {
                picker = createBreadcrumbsPicker(_this._instantiationService, parent, element);
                var selectListener = picker.onDidPickElement(function (data) {
                    if (data.target) {
                        editorViewState = undefined;
                    }
                    _this._contextViewService.hideContextView(_this);
                    _this._revealInEditor(event, data.target, _this._getEditorGroup(data.payload && data.payload.originalEvent));
                    /* __GDPR__
                        "breadcrumbs/open" : {
                            "type": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                        }
                    */
                    _this._telemetryService.publicLog('breadcrumbs/open', { type: !data ? 'nothing' : data.target instanceof TreeElement ? 'symbol' : 'file' });
                });
                var focusListener = picker.onDidFocusElement(function (data) {
                    if (!editor || !(data.target instanceof OutlineElement)) {
                        return;
                    }
                    if (!editorViewState) {
                        editorViewState = editor.saveViewState();
                    }
                    var symbol = data.target.symbol;
                    editor.revealRangeInCenter(symbol.range, 0 /* Smooth */);
                    editorDecorations = editor.deltaDecorations(editorDecorations, [{
                            range: symbol.range,
                            options: {
                                className: 'rangeHighlight',
                                isWholeLine: true
                            }
                        }]);
                });
                _this._breadcrumbsPickerShowing = true;
                _this._updateCkBreadcrumbsActive();
                return combinedDisposable([selectListener, focusListener, picker]);
            },
            getAnchor: function () {
                var maxInnerWidth = window.innerWidth - 8 /*a little less the full widget*/;
                var maxHeight = Math.min(window.innerHeight * .7, 300);
                var pickerWidth = Math.min(maxInnerWidth, Math.max(240, maxInnerWidth / 4.17));
                var pickerArrowSize = 8;
                var pickerArrowOffset;
                var data = dom.getDomNodePagePosition(event.node.firstChild);
                var y = data.top + data.height + pickerArrowSize;
                if (y + maxHeight >= window.innerHeight) {
                    maxHeight = window.innerHeight - y - 30 /* room for shadow and status bar*/;
                }
                var x = data.left;
                if (x + pickerWidth >= maxInnerWidth) {
                    x = maxInnerWidth - pickerWidth;
                }
                if (event.payload instanceof StandardMouseEvent) {
                    var maxPickerArrowOffset = pickerWidth - 2 * pickerArrowSize;
                    pickerArrowOffset = event.payload.posx - x;
                    if (pickerArrowOffset > maxPickerArrowOffset) {
                        x = Math.min(maxInnerWidth - pickerWidth, x + pickerArrowOffset - maxPickerArrowOffset);
                        pickerArrowOffset = maxPickerArrowOffset;
                    }
                }
                else {
                    pickerArrowOffset = (data.left + (data.width * .3)) - x;
                }
                picker.setInput(element, maxHeight, pickerWidth, pickerArrowSize, Math.max(0, pickerArrowOffset));
                return { x: x, y: y };
            },
            onHide: function (data) {
                if (editor) {
                    editor.deltaDecorations(editorDecorations, []);
                    if (editorViewState) {
                        editor.restoreViewState(editorViewState);
                    }
                }
                _this._breadcrumbsPickerShowing = false;
                _this._updateCkBreadcrumbsActive();
                if (data === _this) {
                    _this._widget.setFocused(undefined);
                    _this._widget.setSelection(undefined);
                }
            }
        });
    };
    BreadcrumbsControl.prototype._updateCkBreadcrumbsActive = function () {
        var value = this._widget.isDOMFocused() || this._breadcrumbsPickerShowing;
        this._ckBreadcrumbsActive.set(value);
    };
    BreadcrumbsControl.prototype._revealInEditor = function (event, element, group) {
        if (element instanceof FileElement) {
            if (element.kind === FileKind.FILE) {
                // open file in any editor
                this._editorService.openEditor({ resource: element.uri }, group);
            }
            else {
                // show next picker
                var items = this._widget.getItems();
                var idx = items.indexOf(event.item);
                this._widget.setFocused(items[idx + 1]);
                this._widget.setSelection(items[idx + 1], BreadcrumbsControl.Payload_Pick);
            }
        }
        else if (element instanceof OutlineElement) {
            // open symbol in code editor
            var model = OutlineModel.get(element);
            this._codeEditorService.openCodeEditor({
                resource: model.textModel.uri,
                options: {
                    selection: Range.collapseToStart(element.symbol.selectionRange),
                    revealInCenterIfOutsideViewport: true
                }
            }, this._getActiveCodeEditor(), group === SIDE_GROUP);
        }
    };
    BreadcrumbsControl.prototype._getEditorGroup = function (data) {
        if (data === BreadcrumbsControl.Payload_RevealAside || (data instanceof StandardMouseEvent && data.altKey)) {
            return SIDE_GROUP;
        }
        else if (data === BreadcrumbsControl.Payload_Reveal || (data instanceof StandardMouseEvent && data.metaKey)) {
            return ACTIVE_GROUP;
        }
        else {
            return undefined;
        }
    };
    BreadcrumbsControl.HEIGHT = 22;
    BreadcrumbsControl.Payload_Reveal = {};
    BreadcrumbsControl.Payload_RevealAside = {};
    BreadcrumbsControl.Payload_Pick = {};
    BreadcrumbsControl.CK_BreadcrumbsPossible = new RawContextKey('breadcrumbsPossible', false);
    BreadcrumbsControl.CK_BreadcrumbsVisible = new RawContextKey('breadcrumbsVisible', false);
    BreadcrumbsControl.CK_BreadcrumbsActive = new RawContextKey('breadcrumbsActive', false);
    BreadcrumbsControl = __decorate([
        __param(3, IContextKeyService),
        __param(4, IContextViewService),
        __param(5, IEditorService),
        __param(6, ICodeEditorService),
        __param(7, IWorkspaceContextService),
        __param(8, IInstantiationService),
        __param(9, IThemeService),
        __param(10, IQuickOpenService),
        __param(11, IConfigurationService),
        __param(12, IFileService),
        __param(13, ITelemetryService),
        __param(14, IBreadcrumbsService)
    ], BreadcrumbsControl);
    return BreadcrumbsControl;
}());
export { BreadcrumbsControl };
//#region commands
// toggle command
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
    command: {
        id: 'breadcrumbs.toggle',
        title: { value: localize('cmd.toggle', "Toggle Breadcrumbs"), original: 'Toggle Breadcrumbs' },
        category: localize('cmd.category', "View")
    }
});
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '5_editor',
    order: 99,
    command: {
        id: 'breadcrumbs.toggle',
        title: localize('miToggleBreadcrumbs', "Toggle &&Breadcrumbs")
    }
});
CommandsRegistry.registerCommand('breadcrumbs.toggle', function (accessor) {
    var config = accessor.get(IConfigurationService);
    var value = BreadcrumbsConfig.IsEnabled.bindTo(config).getValue();
    BreadcrumbsConfig.IsEnabled.bindTo(config).updateValue(!value);
});
// focus/focus-and-select
function focusAndSelectHandler(accessor, select) {
    // find widget and focus/select
    var groups = accessor.get(IEditorGroupsService);
    var breadcrumbs = accessor.get(IBreadcrumbsService);
    var widget = breadcrumbs.getWidget(groups.activeGroup.id);
    if (widget) {
        var item = tail(widget.getItems());
        widget.setFocused(item);
        if (select) {
            widget.setSelection(item, BreadcrumbsControl.Payload_Pick);
        }
    }
}
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
    command: {
        id: 'breadcrumbs.focusAndSelect',
        title: { value: localize('cmd.focus', "Focus Breadcrumbs"), original: 'Focus Breadcrumbs' },
        precondition: BreadcrumbsControl.CK_BreadcrumbsVisible
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.focusAndSelect',
    weight: 200 /* WorkbenchContrib */,
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 84 /* US_DOT */,
    when: BreadcrumbsControl.CK_BreadcrumbsPossible,
    handler: function (accessor) { return focusAndSelectHandler(accessor, true); }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.focus',
    weight: 200 /* WorkbenchContrib */,
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 80 /* US_SEMICOLON */,
    when: BreadcrumbsControl.CK_BreadcrumbsPossible,
    handler: function (accessor) { return focusAndSelectHandler(accessor, false); }
});
// this commands is only enabled when breadcrumbs are
// disabled which it then enables and focuses
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.toggleToOn',
    weight: 200 /* WorkbenchContrib */,
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 84 /* US_DOT */,
    when: ContextKeyExpr.not('config.breadcrumbs.enabled'),
    handler: function (accessor) { return __awaiter(_this, void 0, void 0, function () {
        var instant, config, isEnabled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instant = accessor.get(IInstantiationService);
                    config = accessor.get(IConfigurationService);
                    isEnabled = BreadcrumbsConfig.IsEnabled.bindTo(config);
                    if (!!isEnabled.getValue()) return [3 /*break*/, 3];
                    return [4 /*yield*/, isEnabled.updateValue(true)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, timeout(50)];
                case 2:
                    _a.sent(); // hacky - the widget might not be ready yet...
                    _a.label = 3;
                case 3: return [2 /*return*/, instant.invokeFunction(focusAndSelectHandler, true)];
            }
        });
    }); }
});
// navigation
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.focusNext',
    weight: 200 /* WorkbenchContrib */,
    primary: 17 /* RightArrow */,
    secondary: [2048 /* CtrlCmd */ | 17 /* RightArrow */],
    mac: {
        primary: 17 /* RightArrow */,
        secondary: [512 /* Alt */ | 17 /* RightArrow */],
    },
    when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
    handler: function (accessor) {
        var groups = accessor.get(IEditorGroupsService);
        var breadcrumbs = accessor.get(IBreadcrumbsService);
        breadcrumbs.getWidget(groups.activeGroup.id).focusNext();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.focusPrevious',
    weight: 200 /* WorkbenchContrib */,
    primary: 15 /* LeftArrow */,
    secondary: [2048 /* CtrlCmd */ | 15 /* LeftArrow */],
    mac: {
        primary: 15 /* LeftArrow */,
        secondary: [512 /* Alt */ | 15 /* LeftArrow */],
    },
    when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
    handler: function (accessor) {
        var groups = accessor.get(IEditorGroupsService);
        var breadcrumbs = accessor.get(IBreadcrumbsService);
        breadcrumbs.getWidget(groups.activeGroup.id).focusPrev();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.selectFocused',
    weight: 200 /* WorkbenchContrib */,
    primary: 3 /* Enter */,
    secondary: [18 /* DownArrow */],
    when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
    handler: function (accessor) {
        var groups = accessor.get(IEditorGroupsService);
        var breadcrumbs = accessor.get(IBreadcrumbsService);
        var widget = breadcrumbs.getWidget(groups.activeGroup.id);
        widget.setSelection(widget.getFocused(), BreadcrumbsControl.Payload_Pick);
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.revealFocused',
    weight: 200 /* WorkbenchContrib */,
    primary: 10 /* Space */,
    secondary: [2048 /* CtrlCmd */ | 3 /* Enter */],
    when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
    handler: function (accessor) {
        var groups = accessor.get(IEditorGroupsService);
        var breadcrumbs = accessor.get(IBreadcrumbsService);
        var widget = breadcrumbs.getWidget(groups.activeGroup.id);
        widget.setSelection(widget.getFocused(), BreadcrumbsControl.Payload_Reveal);
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.selectEditor',
    weight: 200 /* WorkbenchContrib */ + 1,
    primary: 9 /* Escape */,
    when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
    handler: function (accessor) {
        var groups = accessor.get(IEditorGroupsService);
        var breadcrumbs = accessor.get(IBreadcrumbsService);
        breadcrumbs.getWidget(groups.activeGroup.id).setFocused(undefined);
        breadcrumbs.getWidget(groups.activeGroup.id).setSelection(undefined);
        groups.activeGroup.activeControl.focus();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'breadcrumbs.revealFocusedFromTreeAside',
    weight: 200 /* WorkbenchContrib */,
    primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
    when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive, WorkbenchListFocusContextKey),
    handler: function (accessor) {
        var editors = accessor.get(IEditorService);
        var lists = accessor.get(IListService);
        var element = lists.lastFocusedList.getFocus();
        if (element instanceof OutlineElement) {
            // open symbol in editor
            return editors.openEditor({
                resource: OutlineModel.get(element).textModel.uri,
                options: { selection: Range.collapseToStart(element.symbol.selectionRange) }
            }, SIDE_GROUP);
        }
        else if (URI.isUri(element.resource)) {
            // open file in editor
            return editors.openEditor({
                resource: element.resource,
            }, SIDE_GROUP);
        }
        else {
            // ignore
            return undefined;
        }
    }
});

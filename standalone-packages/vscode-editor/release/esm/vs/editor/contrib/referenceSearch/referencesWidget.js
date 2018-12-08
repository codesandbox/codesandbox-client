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
import * as dom from '../../../base/browser/dom.js';
import { CountBadge } from '../../../base/browser/ui/countBadge/countBadge.js';
import { IconLabel } from '../../../base/browser/ui/iconLabel/iconLabel.js';
import { Sash } from '../../../base/browser/ui/sash/sash.js';
import { Color } from '../../../base/common/color.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { getBaseLabel } from '../../../base/common/labels.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { basenameOrAuthority, dirname } from '../../../base/common/resources.js';
import * as strings from '../../../base/common/strings.js';
import './media/referencesWidget.css';
import { EmbeddedCodeEditorWidget } from '../../browser/widget/embeddedCodeEditorWidget.js';
import { Range } from '../../common/core/range.js';
import { ModelDecorationOptions, TextModel } from '../../common/model/textModel.js';
import { ITextModelService } from '../../common/services/resolverService.js';
import * as nls from '../../../nls.js';
import { RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { WorkbenchTree, WorkbenchTreeController } from '../../../platform/list/browser/listService.js';
import { activeContrastBorder, contrastBorder, registerColor } from '../../../platform/theme/common/colorRegistry.js';
import { attachBadgeStyler } from '../../../platform/theme/common/styler.js';
import { IThemeService, registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { PeekViewWidget } from './peekViewWidget.js';
import { FileReferences, OneReference, ReferencesModel } from './referencesModel.js';
var DecorationsManager = /** @class */ (function () {
    function DecorationsManager(_editor, _model) {
        var _this = this;
        this._editor = _editor;
        this._model = _model;
        this._decorations = new Map();
        this._decorationIgnoreSet = new Set();
        this._callOnDispose = [];
        this._callOnModelChange = [];
        this._callOnDispose.push(this._editor.onDidChangeModel(function () { return _this._onModelChanged(); }));
        this._onModelChanged();
    }
    DecorationsManager.prototype.dispose = function () {
        this._callOnModelChange = dispose(this._callOnModelChange);
        this._callOnDispose = dispose(this._callOnDispose);
        this.removeDecorations();
    };
    DecorationsManager.prototype._onModelChanged = function () {
        this._callOnModelChange = dispose(this._callOnModelChange);
        var model = this._editor.getModel();
        if (model) {
            for (var _i = 0, _a = this._model.groups; _i < _a.length; _i++) {
                var ref = _a[_i];
                if (ref.uri.toString() === model.uri.toString()) {
                    this._addDecorations(ref);
                    return;
                }
            }
        }
    };
    DecorationsManager.prototype._addDecorations = function (reference) {
        var _this = this;
        this._callOnModelChange.push(this._editor.getModel().onDidChangeDecorations(function (event) { return _this._onDecorationChanged(); }));
        var newDecorations = [];
        var newDecorationsActualIndex = [];
        for (var i = 0, len = reference.children.length; i < len; i++) {
            var oneReference = reference.children[i];
            if (this._decorationIgnoreSet.has(oneReference.id)) {
                continue;
            }
            newDecorations.push({
                range: oneReference.range,
                options: DecorationsManager.DecorationOptions
            });
            newDecorationsActualIndex.push(i);
        }
        var decorations = this._editor.deltaDecorations([], newDecorations);
        for (var i = 0; i < decorations.length; i++) {
            this._decorations.set(decorations[i], reference.children[newDecorationsActualIndex[i]]);
        }
    };
    DecorationsManager.prototype._onDecorationChanged = function () {
        var _this = this;
        var toRemove = [];
        this._decorations.forEach(function (reference, decorationId) {
            var newRange = _this._editor.getModel().getDecorationRange(decorationId);
            if (!newRange) {
                return;
            }
            var ignore = false;
            if (Range.equalsRange(newRange, reference.range)) {
                return;
            }
            else if (Range.spansMultipleLines(newRange)) {
                ignore = true;
            }
            else {
                var lineLength = reference.range.endColumn - reference.range.startColumn;
                var newLineLength = newRange.endColumn - newRange.startColumn;
                if (lineLength !== newLineLength) {
                    ignore = true;
                }
            }
            if (ignore) {
                _this._decorationIgnoreSet.add(reference.id);
                toRemove.push(decorationId);
            }
            else {
                reference.range = newRange;
            }
        });
        for (var i = 0, len = toRemove.length; i < len; i++) {
            this._decorations.delete(toRemove[i]);
        }
        this._editor.deltaDecorations(toRemove, []);
    };
    DecorationsManager.prototype.removeDecorations = function () {
        var toRemove = [];
        this._decorations.forEach(function (value, key) {
            toRemove.push(key);
        });
        this._editor.deltaDecorations(toRemove, []);
        this._decorations.clear();
    };
    DecorationsManager.DecorationOptions = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'reference-decoration'
    });
    return DecorationsManager;
}());
var DataSource = /** @class */ (function () {
    function DataSource(_textModelResolverService) {
        this._textModelResolverService = _textModelResolverService;
        //
    }
    DataSource.prototype.getId = function (tree, element) {
        if (element instanceof ReferencesModel) {
            return 'root';
        }
        else if (element instanceof FileReferences) {
            return element.id;
        }
        else if (element instanceof OneReference) {
            return element.id;
        }
        return undefined;
    };
    DataSource.prototype.hasChildren = function (tree, element) {
        if (element instanceof ReferencesModel) {
            return true;
        }
        if (element instanceof FileReferences && !element.failure) {
            return true;
        }
        return false;
    };
    DataSource.prototype.getChildren = function (tree, element) {
        if (element instanceof ReferencesModel) {
            return Promise.resolve(element.groups);
        }
        else if (element instanceof FileReferences) {
            return element.resolve(this._textModelResolverService).then(function (val) {
                if (element.failure) {
                    // refresh the element on failure so that
                    // we can update its rendering
                    return tree.refresh(element).then(function () { return val.children; });
                }
                return val.children;
            });
        }
        else {
            return Promise.resolve([]);
        }
    };
    DataSource.prototype.getParent = function (tree, element) {
        var result = null;
        if (element instanceof FileReferences) {
            result = element.parent;
        }
        else if (element instanceof OneReference) {
            result = element.parent;
        }
        return Promise.resolve(result);
    };
    DataSource = __decorate([
        __param(0, ITextModelService)
    ], DataSource);
    return DataSource;
}());
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onDidFocus = new Emitter();
        _this.onDidFocus = _this._onDidFocus.event;
        _this._onDidSelect = new Emitter();
        _this.onDidSelect = _this._onDidSelect.event;
        _this._onDidOpenToSide = new Emitter();
        _this.onDidOpenToSide = _this._onDidOpenToSide.event;
        return _this;
    }
    Controller.prototype.onTap = function (tree, element, event) {
        if (element instanceof FileReferences) {
            event.preventDefault();
            event.stopPropagation();
            return this._expandCollapse(tree, element);
        }
        var result = _super.prototype.onTap.call(this, tree, element, event);
        this._onDidFocus.fire(element);
        return result;
    };
    Controller.prototype.onMouseDown = function (tree, element, event) {
        var isDoubleClick = event.detail === 2;
        if (event.leftButton) {
            if (element instanceof FileReferences) {
                if (this.openOnSingleClick || isDoubleClick || this.isClickOnTwistie(event)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return this._expandCollapse(tree, element);
                }
            }
            var result = _super.prototype.onClick.call(this, tree, element, event);
            var openToSide = event.ctrlKey || event.metaKey || event.altKey;
            if (openToSide && (isDoubleClick || this.openOnSingleClick)) {
                this._onDidOpenToSide.fire(element);
            }
            else if (isDoubleClick) {
                this._onDidSelect.fire(element);
            }
            else if (this.openOnSingleClick) {
                this._onDidFocus.fire(element);
            }
            return result;
        }
        return false;
    };
    Controller.prototype.onClick = function (tree, element, event) {
        if (event.leftButton) {
            return false; // Already handled by onMouseDown
        }
        return _super.prototype.onClick.call(this, tree, element, event);
    };
    Controller.prototype._expandCollapse = function (tree, element) {
        if (tree.isExpanded(element)) {
            tree.collapse(element).then(null, onUnexpectedError);
        }
        else {
            tree.expand(element).then(null, onUnexpectedError);
        }
        return true;
    };
    Controller.prototype.onEscape = function (tree, event) {
        return false;
    };
    Controller.prototype.dispose = function () {
        this._onDidFocus.dispose();
        this._onDidSelect.dispose();
        this._onDidOpenToSide.dispose();
    };
    return Controller;
}(WorkbenchTreeController));
var FileReferencesTemplate = /** @class */ (function () {
    function FileReferencesTemplate(container, _uriLabel, themeService) {
        var _this = this;
        this._uriLabel = _uriLabel;
        var parent = document.createElement('div');
        dom.addClass(parent, 'reference-file');
        container.appendChild(parent);
        this.file = new IconLabel(parent);
        this.badge = new CountBadge(dom.append(parent, dom.$('.count')));
        var styler = attachBadgeStyler(this.badge, themeService);
        this.dispose = function () {
            _this.file.dispose();
            styler.dispose();
        };
    }
    FileReferencesTemplate.prototype.set = function (element) {
        var parent = dirname(element.uri);
        this.file.setValue(getBaseLabel(element.uri), parent ? this._uriLabel.getUriLabel(parent, { relative: true }) : undefined, { title: this._uriLabel.getUriLabel(element.uri) });
        var len = element.children.length;
        this.badge.setCount(len);
        if (element.failure) {
            this.badge.setTitleFormat(nls.localize('referencesFailre', "Failed to resolve file."));
        }
        else if (len > 1) {
            this.badge.setTitleFormat(nls.localize('referencesCount', "{0} references", len));
        }
        else {
            this.badge.setTitleFormat(nls.localize('referenceCount', "{0} reference", len));
        }
    };
    FileReferencesTemplate = __decorate([
        __param(1, ILabelService),
        __param(2, IThemeService)
    ], FileReferencesTemplate);
    return FileReferencesTemplate;
}());
var OneReferenceTemplate = /** @class */ (function () {
    function OneReferenceTemplate(container) {
        var parent = document.createElement('div');
        this.before = document.createElement('span');
        this.inside = document.createElement('span');
        this.after = document.createElement('span');
        dom.addClass(this.inside, 'referenceMatch');
        dom.addClass(parent, 'reference');
        parent.appendChild(this.before);
        parent.appendChild(this.inside);
        parent.appendChild(this.after);
        container.appendChild(parent);
    }
    OneReferenceTemplate.prototype.set = function (element) {
        var _a = element.parent.preview.preview(element.range), before = _a.before, inside = _a.inside, after = _a.after;
        this.before.innerHTML = strings.escape(before);
        this.inside.innerHTML = strings.escape(inside);
        this.after.innerHTML = strings.escape(after);
    };
    return OneReferenceTemplate;
}());
var Renderer = /** @class */ (function () {
    function Renderer(_themeService, _uriLabel) {
        this._themeService = _themeService;
        this._uriLabel = _uriLabel;
        //
    }
    Renderer.prototype.getHeight = function (tree, element) {
        return 23;
    };
    Renderer.prototype.getTemplateId = function (tree, element) {
        if (element instanceof FileReferences) {
            return Renderer._ids.FileReferences;
        }
        else if (element instanceof OneReference) {
            return Renderer._ids.OneReference;
        }
        throw element;
    };
    Renderer.prototype.renderTemplate = function (tree, templateId, container) {
        if (templateId === Renderer._ids.FileReferences) {
            return new FileReferencesTemplate(container, this._uriLabel, this._themeService);
        }
        else if (templateId === Renderer._ids.OneReference) {
            return new OneReferenceTemplate(container);
        }
        throw templateId;
    };
    Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
        if (element instanceof FileReferences) {
            templateData.set(element);
        }
        else if (element instanceof OneReference) {
            templateData.set(element);
        }
        else {
            throw templateId;
        }
    };
    Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
        if (templateData instanceof FileReferencesTemplate) {
            templateData.dispose();
        }
    };
    Renderer._ids = {
        FileReferences: 'FileReferences',
        OneReference: 'OneReference'
    };
    Renderer = __decorate([
        __param(0, IThemeService),
        __param(1, ILabelService)
    ], Renderer);
    return Renderer;
}());
var AriaProvider = /** @class */ (function () {
    function AriaProvider() {
    }
    AriaProvider.prototype.getAriaLabel = function (tree, element) {
        if (element instanceof FileReferences) {
            return element.getAriaMessage();
        }
        else if (element instanceof OneReference) {
            return element.getAriaMessage();
        }
        else {
            return undefined;
        }
    };
    return AriaProvider;
}());
var VSash = /** @class */ (function () {
    function VSash(container, ratio) {
        var _this = this;
        this._disposables = [];
        this._onDidChangePercentages = new Emitter();
        this._ratio = ratio;
        this._sash = new Sash(container, {
            getVerticalSashLeft: function () { return _this._width * _this._ratio; },
            getVerticalSashHeight: function () { return _this._height; }
        });
        // compute the current widget clientX postion since
        // the sash works with clientX when dragging
        var clientX;
        this._disposables.push(this._sash.onDidStart(function (e) {
            clientX = e.startX - (_this._width * _this.ratio);
        }));
        this._disposables.push(this._sash.onDidChange(function (e) {
            // compute the new position of the sash and from that
            // compute the new ratio that we are using
            var newLeft = e.currentX - clientX;
            if (newLeft > 20 && newLeft + 20 < _this._width) {
                _this._ratio = newLeft / _this._width;
                _this._sash.layout();
                _this._onDidChangePercentages.fire(_this);
            }
        }));
    }
    VSash.prototype.dispose = function () {
        this._sash.dispose();
        this._onDidChangePercentages.dispose();
        dispose(this._disposables);
    };
    Object.defineProperty(VSash.prototype, "onDidChangePercentages", {
        get: function () {
            return this._onDidChangePercentages.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSash.prototype, "width", {
        set: function (value) {
            this._width = value;
            this._sash.layout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSash.prototype, "height", {
        set: function (value) {
            this._height = value;
            this._sash.layout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSash.prototype, "percentages", {
        get: function () {
            var left = 100 * this._ratio;
            var right = 100 - left;
            return [left + "%", right + "%"];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSash.prototype, "ratio", {
        get: function () {
            return this._ratio;
        },
        enumerable: true,
        configurable: true
    });
    return VSash;
}());
export var ctxReferenceWidgetSearchTreeFocused = new RawContextKey('referenceSearchTreeFocused', true);
/**
 * ZoneWidget that is shown inside the editor
 */
var ReferenceWidget = /** @class */ (function (_super) {
    __extends(ReferenceWidget, _super);
    function ReferenceWidget(editor, _defaultTreeKeyboardSupport, layoutData, themeService, _textModelResolverService, _instantiationService, _uriLabel) {
        var _this = _super.call(this, editor, { showFrame: false, showArrow: true, isResizeable: true, isAccessible: true }) || this;
        _this._defaultTreeKeyboardSupport = _defaultTreeKeyboardSupport;
        _this.layoutData = layoutData;
        _this._textModelResolverService = _textModelResolverService;
        _this._instantiationService = _instantiationService;
        _this._uriLabel = _uriLabel;
        _this._disposeOnNewModel = [];
        _this._callOnDispose = [];
        _this._onDidSelectReference = new Emitter();
        _this._applyTheme(themeService.getTheme());
        _this._callOnDispose.push(themeService.onThemeChange(_this._applyTheme.bind(_this)));
        _this.create();
        return _this;
    }
    ReferenceWidget.prototype._applyTheme = function (theme) {
        var borderColor = theme.getColor(peekViewBorder) || Color.transparent;
        this.style({
            arrowColor: borderColor,
            frameColor: borderColor,
            headerBackgroundColor: theme.getColor(peekViewTitleBackground) || Color.transparent,
            primaryHeadingColor: theme.getColor(peekViewTitleForeground),
            secondaryHeadingColor: theme.getColor(peekViewTitleInfoForeground)
        });
    };
    ReferenceWidget.prototype.dispose = function () {
        this.setModel(null);
        this._callOnDispose = dispose(this._callOnDispose);
        dispose(this._preview, this._previewNotAvailableMessage, this._tree, this._sash, this._previewModelReference);
        _super.prototype.dispose.call(this);
    };
    Object.defineProperty(ReferenceWidget.prototype, "onDidSelectReference", {
        get: function () {
            return this._onDidSelectReference.event;
        },
        enumerable: true,
        configurable: true
    });
    ReferenceWidget.prototype.show = function (where) {
        this.editor.revealRangeInCenterIfOutsideViewport(where, 0 /* Smooth */);
        _super.prototype.show.call(this, where, this.layoutData.heightInLines || 18);
    };
    ReferenceWidget.prototype.focus = function () {
        this._tree.domFocus();
    };
    ReferenceWidget.prototype._onTitleClick = function (e) {
        if (this._preview && this._preview.getModel()) {
            this._onDidSelectReference.fire({
                element: this._getFocusedReference(),
                kind: e.ctrlKey || e.metaKey || e.altKey ? 'side' : 'open',
                source: 'title'
            });
        }
    };
    ReferenceWidget.prototype._fillBody = function (containerElement) {
        var _this = this;
        this.setCssClass('reference-zone-widget');
        // message pane
        this._messageContainer = dom.append(containerElement, dom.$('div.messages'));
        dom.hide(this._messageContainer);
        // editor
        this._previewContainer = dom.append(containerElement, dom.$('div.preview.inline'));
        var options = {
            scrollBeyondLastLine: false,
            scrollbar: {
                verticalScrollbarSize: 14,
                horizontal: 'auto',
                useShadows: true,
                verticalHasArrows: false,
                horizontalHasArrows: false
            },
            overviewRulerLanes: 2,
            fixedOverflowWidgets: true,
            minimap: {
                enabled: false
            }
        };
        this._preview = this._instantiationService.createInstance(EmbeddedCodeEditorWidget, this._previewContainer, options, this.editor);
        dom.hide(this._previewContainer);
        this._previewNotAvailableMessage = TextModel.createFromString(nls.localize('missingPreviewMessage', "no preview available"));
        // sash
        this._sash = new VSash(containerElement, this.layoutData.ratio || .8);
        this._sash.onDidChangePercentages(function () {
            var _a = _this._sash.percentages, left = _a[0], right = _a[1];
            _this._previewContainer.style.width = left;
            _this._treeContainer.style.width = right;
            _this._preview.layout();
            _this._tree.layout();
            _this.layoutData.ratio = _this._sash.ratio;
        });
        // tree
        this._treeContainer = dom.append(containerElement, dom.$('div.ref-tree.inline'));
        var controller = this._instantiationService.createInstance(Controller, { keyboardSupport: this._defaultTreeKeyboardSupport, clickBehavior: 1 /* ON_MOUSE_UP */ /* our controller already deals with this */ });
        this._callOnDispose.push(controller);
        var config = {
            dataSource: this._instantiationService.createInstance(DataSource),
            renderer: this._instantiationService.createInstance(Renderer),
            controller: controller,
            accessibilityProvider: new AriaProvider()
        };
        var treeOptions = {
            twistiePixels: 20,
            ariaLabel: nls.localize('treeAriaLabel', "References")
        };
        this._tree = this._instantiationService.createInstance(WorkbenchTree, this._treeContainer, config, treeOptions);
        ctxReferenceWidgetSearchTreeFocused.bindTo(this._tree.contextKeyService);
        // listen on selection and focus
        var onEvent = function (element, kind) {
            if (element instanceof OneReference) {
                if (kind === 'show') {
                    _this._revealReference(element, false);
                }
                _this._onDidSelectReference.fire({ element: element, kind: kind, source: 'tree' });
            }
        };
        this._disposables.push(this._tree.onDidChangeFocus(function (event) {
            if (event && event.payload && event.payload.origin === 'keyboard') {
                onEvent(event.focus, 'show'); // only handle events from keyboard, mouse/touch is handled by other listeners below
            }
        }));
        this._disposables.push(this._tree.onDidChangeSelection(function (event) {
            if (event && event.payload && event.payload.origin === 'keyboard') {
                onEvent(event.selection[0], 'goto'); // only handle events from keyboard, mouse/touch is handled by other listeners below
            }
        }));
        this._disposables.push(controller.onDidFocus(function (element) { return onEvent(element, 'show'); }));
        this._disposables.push(controller.onDidSelect(function (element) { return onEvent(element, 'goto'); }));
        this._disposables.push(controller.onDidOpenToSide(function (element) { return onEvent(element, 'side'); }));
        dom.hide(this._treeContainer);
    };
    ReferenceWidget.prototype._doLayoutBody = function (heightInPixel, widthInPixel) {
        _super.prototype._doLayoutBody.call(this, heightInPixel, widthInPixel);
        var height = heightInPixel + 'px';
        this._sash.height = heightInPixel;
        this._sash.width = widthInPixel;
        // set height/width
        var _a = this._sash.percentages, left = _a[0], right = _a[1];
        this._previewContainer.style.height = height;
        this._previewContainer.style.width = left;
        this._treeContainer.style.height = height;
        this._treeContainer.style.width = right;
        // forward
        this._tree.layout(heightInPixel);
        this._preview.layout();
        // store layout data
        this.layoutData = {
            heightInLines: this._viewZone.heightInLines,
            ratio: this._sash.ratio
        };
    };
    ReferenceWidget.prototype._onWidth = function (widthInPixel) {
        this._sash.width = widthInPixel;
        this._preview.layout();
    };
    ReferenceWidget.prototype.setSelection = function (selection) {
        var _this = this;
        return this._revealReference(selection, true).then(function () {
            if (!_this._model) {
                // disposed
                return;
            }
            // show in tree
            _this._tree.setSelection([selection]);
            _this._tree.setFocus(selection);
        });
    };
    ReferenceWidget.prototype.setModel = function (newModel) {
        // clean up
        this._disposeOnNewModel = dispose(this._disposeOnNewModel);
        this._model = newModel;
        if (this._model) {
            return this._onNewModel();
        }
        return undefined;
    };
    ReferenceWidget.prototype._onNewModel = function () {
        var _this = this;
        if (this._model.empty) {
            this.setTitle('');
            this._messageContainer.innerHTML = nls.localize('noResults', "No results");
            dom.show(this._messageContainer);
            return Promise.resolve(void 0);
        }
        dom.hide(this._messageContainer);
        this._decorationsManager = new DecorationsManager(this._preview, this._model);
        this._disposeOnNewModel.push(this._decorationsManager);
        // listen on model changes
        this._disposeOnNewModel.push(this._model.onDidChangeReferenceRange(function (reference) { return _this._tree.refresh(reference); }));
        // listen on editor
        this._disposeOnNewModel.push(this._preview.onMouseDown(function (e) {
            var event = e.event, target = e.target;
            if (event.detail === 2) {
                _this._onDidSelectReference.fire({
                    element: { uri: _this._getFocusedReference().uri, range: target.range },
                    kind: (event.ctrlKey || event.metaKey || event.altKey) ? 'side' : 'open',
                    source: 'editor'
                });
            }
        }));
        // make sure things are rendered
        dom.addClass(this.container, 'results-loaded');
        dom.show(this._treeContainer);
        dom.show(this._previewContainer);
        this._preview.layout();
        this._tree.layout();
        this.focus();
        // pick input and a reference to begin with
        var input = this._model.groups.length === 1 ? this._model.groups[0] : this._model;
        return this._tree.setInput(input);
    };
    ReferenceWidget.prototype._getFocusedReference = function () {
        var element = this._tree.getFocus();
        if (element instanceof OneReference) {
            return element;
        }
        else if (element instanceof FileReferences) {
            if (element.children.length > 0) {
                return element.children[0];
            }
        }
        return undefined;
    };
    ReferenceWidget.prototype._revealReference = function (reference, revealParent) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Update widget header
                        if (reference.uri.scheme !== Schemas.inMemory) {
                            this.setTitle(basenameOrAuthority(reference.uri), this._uriLabel.getUriLabel(dirname(reference.uri)));
                        }
                        else {
                            this.setTitle(nls.localize('peekView.alternateTitle', "References"));
                        }
                        promise = this._textModelResolverService.createModelReference(reference.uri);
                        if (!revealParent) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._tree.reveal(reference.parent)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, Promise.all([promise, this._tree.reveal(reference)]).then(function (values) {
                            var ref = values[0];
                            if (!_this._model) {
                                ref.dispose();
                                // disposed
                                return;
                            }
                            dispose(_this._previewModelReference);
                            // show in editor
                            var model = ref.object;
                            if (model) {
                                _this._previewModelReference = ref;
                                var isSameModel = (_this._preview.getModel() === model.textEditorModel);
                                _this._preview.setModel(model.textEditorModel);
                                var sel = Range.lift(reference.range).collapseToStart();
                                _this._preview.setSelection(sel);
                                _this._preview.revealRangeInCenter(sel, isSameModel ? 0 /* Smooth */ : 1 /* Immediate */);
                            }
                            else {
                                _this._preview.setModel(_this._previewNotAvailableMessage);
                                ref.dispose();
                            }
                        }, onUnexpectedError)];
                }
            });
        });
    };
    ReferenceWidget = __decorate([
        __param(3, IThemeService),
        __param(4, ITextModelService),
        __param(5, IInstantiationService),
        __param(6, ILabelService)
    ], ReferenceWidget);
    return ReferenceWidget;
}(PeekViewWidget));
export { ReferenceWidget };
// theming
export var peekViewTitleBackground = registerColor('peekViewTitle.background', { dark: '#1E1E1E', light: '#FFFFFF', hc: '#0C141F' }, nls.localize('peekViewTitleBackground', 'Background color of the peek view title area.'));
export var peekViewTitleForeground = registerColor('peekViewTitleLabel.foreground', { dark: '#FFFFFF', light: '#333333', hc: '#FFFFFF' }, nls.localize('peekViewTitleForeground', 'Color of the peek view title.'));
export var peekViewTitleInfoForeground = registerColor('peekViewTitleDescription.foreground', { dark: '#ccccccb3', light: '#6c6c6cb3', hc: '#FFFFFF99' }, nls.localize('peekViewTitleInfoForeground', 'Color of the peek view title info.'));
export var peekViewBorder = registerColor('peekView.border', { dark: '#007acc', light: '#007acc', hc: contrastBorder }, nls.localize('peekViewBorder', 'Color of the peek view borders and arrow.'));
export var peekViewResultsBackground = registerColor('peekViewResult.background', { dark: '#252526', light: '#F3F3F3', hc: Color.black }, nls.localize('peekViewResultsBackground', 'Background color of the peek view result list.'));
export var peekViewResultsMatchForeground = registerColor('peekViewResult.lineForeground', { dark: '#bbbbbb', light: '#646465', hc: Color.white }, nls.localize('peekViewResultsMatchForeground', 'Foreground color for line nodes in the peek view result list.'));
export var peekViewResultsFileForeground = registerColor('peekViewResult.fileForeground', { dark: Color.white, light: '#1E1E1E', hc: Color.white }, nls.localize('peekViewResultsFileForeground', 'Foreground color for file nodes in the peek view result list.'));
export var peekViewResultsSelectionBackground = registerColor('peekViewResult.selectionBackground', { dark: '#3399ff33', light: '#3399ff33', hc: null }, nls.localize('peekViewResultsSelectionBackground', 'Background color of the selected entry in the peek view result list.'));
export var peekViewResultsSelectionForeground = registerColor('peekViewResult.selectionForeground', { dark: Color.white, light: '#6C6C6C', hc: Color.white }, nls.localize('peekViewResultsSelectionForeground', 'Foreground color of the selected entry in the peek view result list.'));
export var peekViewEditorBackground = registerColor('peekViewEditor.background', { dark: '#001F33', light: '#F2F8FC', hc: Color.black }, nls.localize('peekViewEditorBackground', 'Background color of the peek view editor.'));
export var peekViewEditorGutterBackground = registerColor('peekViewEditorGutter.background', { dark: peekViewEditorBackground, light: peekViewEditorBackground, hc: peekViewEditorBackground }, nls.localize('peekViewEditorGutterBackground', 'Background color of the gutter in the peek view editor.'));
export var peekViewResultsMatchHighlight = registerColor('peekViewResult.matchHighlightBackground', { dark: '#ea5c004d', light: '#ea5c004d', hc: null }, nls.localize('peekViewResultsMatchHighlight', 'Match highlight color in the peek view result list.'));
export var peekViewEditorMatchHighlight = registerColor('peekViewEditor.matchHighlightBackground', { dark: '#ff8f0099', light: '#f5d802de', hc: null }, nls.localize('peekViewEditorMatchHighlight', 'Match highlight color in the peek view editor.'));
export var peekViewEditorMatchHighlightBorder = registerColor('peekViewEditor.matchHighlightBorder', { dark: null, light: null, hc: activeContrastBorder }, nls.localize('peekViewEditorMatchHighlightBorder', 'Match highlight border in the peek view editor.'));
registerThemingParticipant(function (theme, collector) {
    var findMatchHighlightColor = theme.getColor(peekViewResultsMatchHighlight);
    if (findMatchHighlightColor) {
        collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .referenceMatch { background-color: " + findMatchHighlightColor + "; }");
    }
    var referenceHighlightColor = theme.getColor(peekViewEditorMatchHighlight);
    if (referenceHighlightColor) {
        collector.addRule(".monaco-editor .reference-zone-widget .preview .reference-decoration { background-color: " + referenceHighlightColor + "; }");
    }
    var referenceHighlightBorder = theme.getColor(peekViewEditorMatchHighlightBorder);
    if (referenceHighlightBorder) {
        collector.addRule(".monaco-editor .reference-zone-widget .preview .reference-decoration { border: 2px solid " + referenceHighlightBorder + "; box-sizing: border-box; }");
    }
    var hcOutline = theme.getColor(activeContrastBorder);
    if (hcOutline) {
        collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .referenceMatch { border: 1px dotted " + hcOutline + "; box-sizing: border-box; }");
    }
    var resultsBackground = theme.getColor(peekViewResultsBackground);
    if (resultsBackground) {
        collector.addRule(".monaco-editor .reference-zone-widget .ref-tree { background-color: " + resultsBackground + "; }");
    }
    var resultsMatchForeground = theme.getColor(peekViewResultsMatchForeground);
    if (resultsMatchForeground) {
        collector.addRule(".monaco-editor .reference-zone-widget .ref-tree { color: " + resultsMatchForeground + "; }");
    }
    var resultsFileForeground = theme.getColor(peekViewResultsFileForeground);
    if (resultsFileForeground) {
        collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .reference-file { color: " + resultsFileForeground + "; }");
    }
    var resultsSelectedBackground = theme.getColor(peekViewResultsSelectionBackground);
    if (resultsSelectedBackground) {
        collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .monaco-tree.focused .monaco-tree-rows > .monaco-tree-row.selected:not(.highlighted) { background-color: " + resultsSelectedBackground + "; }");
    }
    var resultsSelectedForeground = theme.getColor(peekViewResultsSelectionForeground);
    if (resultsSelectedForeground) {
        collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .monaco-tree.focused .monaco-tree-rows > .monaco-tree-row.selected:not(.highlighted) { color: " + resultsSelectedForeground + " !important; }");
    }
    var editorBackground = theme.getColor(peekViewEditorBackground);
    if (editorBackground) {
        collector.addRule(".monaco-editor .reference-zone-widget .preview .monaco-editor .monaco-editor-background," +
            ".monaco-editor .reference-zone-widget .preview .monaco-editor .inputarea.ime-input {" +
            ("\tbackground-color: " + editorBackground + ";") +
            "}");
    }
    var editorGutterBackground = theme.getColor(peekViewEditorGutterBackground);
    if (editorGutterBackground) {
        collector.addRule(".monaco-editor .reference-zone-widget .preview .monaco-editor .margin {" +
            ("\tbackground-color: " + editorGutterBackground + ";") +
            "}");
    }
});

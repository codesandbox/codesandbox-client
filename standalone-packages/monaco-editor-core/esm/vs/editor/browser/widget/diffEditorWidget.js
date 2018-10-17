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
import './media/diffEditor.css';
import * as nls from '../../../nls';
import { RunOnceScheduler } from '../../../base/common/async';
import { Disposable } from '../../../base/common/lifecycle';
import * as objects from '../../../base/common/objects';
import * as dom from '../../../base/browser/dom';
import { createFastDomNode } from '../../../base/browser/fastDomNode';
import { Sash } from '../../../base/browser/ui/sash/sash';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey';
import { ICodeEditorService } from '../services/codeEditorService';
import { Range } from '../../common/core/range';
import * as editorCommon from '../../common/editorCommon';
import { IEditorWorkerService } from '../../common/services/editorWorkerService';
import { LineDecoration } from '../../common/viewLayout/lineDecorations';
import { renderViewLine, RenderLineInput } from '../../common/viewLayout/viewLineRenderer';
import { CodeEditorWidget } from './codeEditorWidget';
import { Configuration } from '../config/configuration';
import { InlineDecoration, ViewLineRenderingData } from '../../common/viewModel/viewModel';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection';
import { Emitter } from '../../../base/common/event';
import * as editorOptions from '../../common/config/editorOptions';
import { registerThemingParticipant, IThemeService, getThemeTypeSelector } from '../../../platform/theme/common/themeService';
import { scrollbarShadow, diffInserted, diffRemoved, defaultInsertColor, defaultRemoveColor, diffInsertedOutline, diffRemovedOutline, diffBorder } from '../../../platform/theme/common/colorRegistry';
import { OverviewRulerZone } from '../../common/view/overviewZoneManager';
import { ModelDecorationOptions } from '../../common/model/textModel';
import { DiffReview } from './diffReview';
import { createStringBuilder } from '../../common/core/stringBuilder';
import { INotificationService } from '../../../platform/notification/common/notification';
import { StableEditorScrollState } from '../core/editorState';
var VisualEditorState = /** @class */ (function () {
    function VisualEditorState() {
        this._zones = [];
        this._zonesMap = {};
        this._decorations = [];
    }
    VisualEditorState.prototype.getForeignViewZones = function (allViewZones) {
        var _this = this;
        return allViewZones.filter(function (z) { return !_this._zonesMap[String(z.id)]; });
    };
    VisualEditorState.prototype.clean = function (editor) {
        var _this = this;
        // (1) View zones
        if (this._zones.length > 0) {
            editor.changeViewZones(function (viewChangeAccessor) {
                for (var i = 0, length_1 = _this._zones.length; i < length_1; i++) {
                    viewChangeAccessor.removeZone(_this._zones[i]);
                }
            });
        }
        this._zones = [];
        this._zonesMap = {};
        // (2) Model decorations
        this._decorations = editor.deltaDecorations(this._decorations, []);
    };
    VisualEditorState.prototype.apply = function (editor, overviewRuler, newDecorations, restoreScrollState) {
        var _this = this;
        var scrollState = restoreScrollState ? StableEditorScrollState.capture(editor) : null;
        // view zones
        editor.changeViewZones(function (viewChangeAccessor) {
            for (var i = 0, length_2 = _this._zones.length; i < length_2; i++) {
                viewChangeAccessor.removeZone(_this._zones[i]);
            }
            _this._zones = [];
            _this._zonesMap = {};
            for (var i = 0, length_3 = newDecorations.zones.length; i < length_3; i++) {
                newDecorations.zones[i].suppressMouseDown = true;
                var zoneId = viewChangeAccessor.addZone(newDecorations.zones[i]);
                _this._zones.push(zoneId);
                _this._zonesMap[String(zoneId)] = true;
            }
        });
        if (scrollState) {
            scrollState.restore(editor);
        }
        // decorations
        this._decorations = editor.deltaDecorations(this._decorations, newDecorations.decorations);
        // overview ruler
        if (overviewRuler) {
            overviewRuler.setZones(newDecorations.overviewZones);
        }
    };
    return VisualEditorState;
}());
var DIFF_EDITOR_ID = 0;
var DiffEditorWidget = /** @class */ (function (_super) {
    __extends(DiffEditorWidget, _super);
    function DiffEditorWidget(domElement, options, editorWorkerService, contextKeyService, instantiationService, codeEditorService, themeService, notificationService) {
        var _this = _super.call(this) || this;
        _this._onDidDispose = _this._register(new Emitter());
        _this.onDidDispose = _this._onDidDispose.event;
        _this._onDidUpdateDiff = _this._register(new Emitter());
        _this.onDidUpdateDiff = _this._onDidUpdateDiff.event;
        _this._lastOriginalWarning = null;
        _this._lastModifiedWarning = null;
        _this._editorWorkerService = editorWorkerService;
        _this._codeEditorService = codeEditorService;
        _this._contextKeyService = _this._register(contextKeyService.createScoped(domElement));
        _this._contextKeyService.createKey('isInDiffEditor', true);
        _this._themeService = themeService;
        _this._notificationService = notificationService;
        _this.id = (++DIFF_EDITOR_ID);
        _this._domElement = domElement;
        options = options || {};
        // renderSideBySide
        _this._renderSideBySide = true;
        if (typeof options.renderSideBySide !== 'undefined') {
            _this._renderSideBySide = options.renderSideBySide;
        }
        // ignoreTrimWhitespace
        _this._ignoreTrimWhitespace = true;
        if (typeof options.ignoreTrimWhitespace !== 'undefined') {
            _this._ignoreTrimWhitespace = options.ignoreTrimWhitespace;
        }
        // renderIndicators
        _this._renderIndicators = true;
        if (typeof options.renderIndicators !== 'undefined') {
            _this._renderIndicators = options.renderIndicators;
        }
        _this._originalIsEditable = false;
        if (typeof options.originalEditable !== 'undefined') {
            _this._originalIsEditable = Boolean(options.originalEditable);
        }
        _this._updateDecorationsRunner = _this._register(new RunOnceScheduler(function () { return _this._updateDecorations(); }, 0));
        _this._containerDomElement = document.createElement('div');
        _this._containerDomElement.className = DiffEditorWidget._getClassName(_this._themeService.getTheme(), _this._renderSideBySide);
        _this._containerDomElement.style.position = 'relative';
        _this._containerDomElement.style.height = '100%';
        _this._domElement.appendChild(_this._containerDomElement);
        _this._overviewViewportDomElement = createFastDomNode(document.createElement('div'));
        _this._overviewViewportDomElement.setClassName('diffViewport');
        _this._overviewViewportDomElement.setPosition('absolute');
        _this._overviewDomElement = document.createElement('div');
        _this._overviewDomElement.className = 'diffOverview';
        _this._overviewDomElement.style.position = 'absolute';
        _this._overviewDomElement.appendChild(_this._overviewViewportDomElement.domNode);
        _this._register(dom.addStandardDisposableListener(_this._overviewDomElement, 'mousedown', function (e) {
            _this.modifiedEditor.delegateVerticalScrollbarMouseDown(e);
        }));
        _this._containerDomElement.appendChild(_this._overviewDomElement);
        _this._createLeftHandSide();
        _this._createRightHandSide();
        _this._beginUpdateDecorationsTimeout = -1;
        _this._currentlyChangingViewZones = false;
        _this._diffComputationToken = 0;
        _this._originalEditorState = new VisualEditorState();
        _this._modifiedEditorState = new VisualEditorState();
        _this._isVisible = true;
        _this._isHandlingScrollEvent = false;
        _this._width = 0;
        _this._height = 0;
        _this._reviewHeight = 0;
        _this._lineChanges = null;
        var leftContextKeyService = _this._contextKeyService.createScoped();
        leftContextKeyService.createKey('isInDiffLeftEditor', true);
        var leftServices = new ServiceCollection();
        leftServices.set(IContextKeyService, leftContextKeyService);
        var leftScopedInstantiationService = instantiationService.createChild(leftServices);
        var rightContextKeyService = _this._contextKeyService.createScoped();
        rightContextKeyService.createKey('isInDiffRightEditor', true);
        var rightServices = new ServiceCollection();
        rightServices.set(IContextKeyService, rightContextKeyService);
        var rightScopedInstantiationService = instantiationService.createChild(rightServices);
        _this._createLeftHandSideEditor(options, leftScopedInstantiationService);
        _this._createRightHandSideEditor(options, rightScopedInstantiationService);
        _this._reviewPane = new DiffReview(_this);
        _this._containerDomElement.appendChild(_this._reviewPane.domNode.domNode);
        _this._containerDomElement.appendChild(_this._reviewPane.shadow.domNode);
        _this._containerDomElement.appendChild(_this._reviewPane.actionBarContainer.domNode);
        if (options.automaticLayout) {
            _this._measureDomElementToken = window.setInterval(function () { return _this._measureDomElement(false); }, 100);
        }
        // enableSplitViewResizing
        _this._enableSplitViewResizing = true;
        if (typeof options.enableSplitViewResizing !== 'undefined') {
            _this._enableSplitViewResizing = options.enableSplitViewResizing;
        }
        if (_this._renderSideBySide) {
            _this._setStrategy(new DiffEdtorWidgetSideBySide(_this._createDataSource(), _this._enableSplitViewResizing));
        }
        else {
            _this._setStrategy(new DiffEdtorWidgetInline(_this._createDataSource(), _this._enableSplitViewResizing));
        }
        _this._register(themeService.onThemeChange(function (t) {
            if (_this._strategy && _this._strategy.applyColors(t)) {
                _this._updateDecorationsRunner.schedule();
            }
            _this._containerDomElement.className = DiffEditorWidget._getClassName(_this._themeService.getTheme(), _this._renderSideBySide);
        }));
        _this._codeEditorService.addDiffEditor(_this);
        return _this;
    }
    Object.defineProperty(DiffEditorWidget.prototype, "ignoreTrimWhitespace", {
        get: function () {
            return this._ignoreTrimWhitespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffEditorWidget.prototype, "renderSideBySide", {
        get: function () {
            return this._renderSideBySide;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffEditorWidget.prototype, "renderIndicators", {
        get: function () {
            return this._renderIndicators;
        },
        enumerable: true,
        configurable: true
    });
    DiffEditorWidget.prototype.hasWidgetFocus = function () {
        return dom.isAncestor(document.activeElement, this._domElement);
    };
    DiffEditorWidget.prototype.diffReviewNext = function () {
        this._reviewPane.next();
    };
    DiffEditorWidget.prototype.diffReviewPrev = function () {
        this._reviewPane.prev();
    };
    DiffEditorWidget._getClassName = function (theme, renderSideBySide) {
        var result = 'monaco-diff-editor monaco-editor-background ';
        if (renderSideBySide) {
            result += 'side-by-side ';
        }
        result += getThemeTypeSelector(theme.type);
        return result;
    };
    DiffEditorWidget.prototype._recreateOverviewRulers = function () {
        if (this._originalOverviewRuler) {
            this._overviewDomElement.removeChild(this._originalOverviewRuler.getDomNode());
            this._originalOverviewRuler.dispose();
        }
        this._originalOverviewRuler = this.originalEditor.createOverviewRuler('original diffOverviewRuler');
        this._overviewDomElement.appendChild(this._originalOverviewRuler.getDomNode());
        if (this._modifiedOverviewRuler) {
            this._overviewDomElement.removeChild(this._modifiedOverviewRuler.getDomNode());
            this._modifiedOverviewRuler.dispose();
        }
        this._modifiedOverviewRuler = this.modifiedEditor.createOverviewRuler('modified diffOverviewRuler');
        this._overviewDomElement.appendChild(this._modifiedOverviewRuler.getDomNode());
        this._layoutOverviewRulers();
    };
    DiffEditorWidget.prototype._createLeftHandSide = function () {
        this._originalDomNode = document.createElement('div');
        this._originalDomNode.className = 'editor original';
        this._originalDomNode.style.position = 'absolute';
        this._originalDomNode.style.height = '100%';
        this._containerDomElement.appendChild(this._originalDomNode);
    };
    DiffEditorWidget.prototype._createRightHandSide = function () {
        this._modifiedDomNode = document.createElement('div');
        this._modifiedDomNode.className = 'editor modified';
        this._modifiedDomNode.style.position = 'absolute';
        this._modifiedDomNode.style.height = '100%';
        this._containerDomElement.appendChild(this._modifiedDomNode);
    };
    DiffEditorWidget.prototype._createLeftHandSideEditor = function (options, instantiationService) {
        var _this = this;
        this.originalEditor = this._createInnerEditor(instantiationService, this._originalDomNode, this._adjustOptionsForLeftHandSide(options, this._originalIsEditable));
        this._register(this.originalEditor.onDidScrollChange(function (e) {
            if (_this._isHandlingScrollEvent) {
                return;
            }
            if (!e.scrollTopChanged && !e.scrollLeftChanged && !e.scrollHeightChanged) {
                return;
            }
            _this._isHandlingScrollEvent = true;
            _this.modifiedEditor.setScrollPosition({
                scrollLeft: e.scrollLeft,
                scrollTop: e.scrollTop
            });
            _this._isHandlingScrollEvent = false;
            _this._layoutOverviewViewport();
        }));
        this._register(this.originalEditor.onDidChangeViewZones(function () {
            _this._onViewZonesChanged();
        }));
        this._register(this.originalEditor.onDidChangeModelContent(function () {
            if (_this._isVisible) {
                _this._beginUpdateDecorationsSoon();
            }
        }));
    };
    DiffEditorWidget.prototype._createRightHandSideEditor = function (options, instantiationService) {
        var _this = this;
        this.modifiedEditor = this._createInnerEditor(instantiationService, this._modifiedDomNode, this._adjustOptionsForRightHandSide(options));
        this._register(this.modifiedEditor.onDidScrollChange(function (e) {
            if (_this._isHandlingScrollEvent) {
                return;
            }
            if (!e.scrollTopChanged && !e.scrollLeftChanged && !e.scrollHeightChanged) {
                return;
            }
            _this._isHandlingScrollEvent = true;
            _this.originalEditor.setScrollPosition({
                scrollLeft: e.scrollLeft,
                scrollTop: e.scrollTop
            });
            _this._isHandlingScrollEvent = false;
            _this._layoutOverviewViewport();
        }));
        this._register(this.modifiedEditor.onDidChangeViewZones(function () {
            _this._onViewZonesChanged();
        }));
        this._register(this.modifiedEditor.onDidChangeConfiguration(function (e) {
            if (e.fontInfo && _this.modifiedEditor.getModel()) {
                _this._onViewZonesChanged();
            }
        }));
        this._register(this.modifiedEditor.onDidChangeModelContent(function () {
            if (_this._isVisible) {
                _this._beginUpdateDecorationsSoon();
            }
        }));
    };
    DiffEditorWidget.prototype._createInnerEditor = function (instantiationService, container, options) {
        return instantiationService.createInstance(CodeEditorWidget, container, options, {});
    };
    DiffEditorWidget.prototype.dispose = function () {
        this._codeEditorService.removeDiffEditor(this);
        if (this._beginUpdateDecorationsTimeout !== -1) {
            window.clearTimeout(this._beginUpdateDecorationsTimeout);
            this._beginUpdateDecorationsTimeout = -1;
        }
        window.clearInterval(this._measureDomElementToken);
        this._cleanViewZonesAndDecorations();
        if (this._originalOverviewRuler) {
            this._overviewDomElement.removeChild(this._originalOverviewRuler.getDomNode());
            this._originalOverviewRuler.dispose();
        }
        if (this._modifiedOverviewRuler) {
            this._overviewDomElement.removeChild(this._modifiedOverviewRuler.getDomNode());
            this._modifiedOverviewRuler.dispose();
        }
        this._overviewDomElement.removeChild(this._overviewViewportDomElement.domNode);
        this._containerDomElement.removeChild(this._overviewDomElement);
        this._containerDomElement.removeChild(this._originalDomNode);
        this.originalEditor.dispose();
        this._containerDomElement.removeChild(this._modifiedDomNode);
        this.modifiedEditor.dispose();
        this._strategy.dispose();
        this._containerDomElement.removeChild(this._reviewPane.domNode.domNode);
        this._containerDomElement.removeChild(this._reviewPane.shadow.domNode);
        this._containerDomElement.removeChild(this._reviewPane.actionBarContainer.domNode);
        this._reviewPane.dispose();
        this._domElement.removeChild(this._containerDomElement);
        this._onDidDispose.fire();
        _super.prototype.dispose.call(this);
    };
    //------------ begin IDiffEditor methods
    DiffEditorWidget.prototype.getId = function () {
        return this.getEditorType() + ':' + this.id;
    };
    DiffEditorWidget.prototype.getEditorType = function () {
        return editorCommon.EditorType.IDiffEditor;
    };
    DiffEditorWidget.prototype.getLineChanges = function () {
        return this._lineChanges;
    };
    DiffEditorWidget.prototype.getOriginalEditor = function () {
        return this.originalEditor;
    };
    DiffEditorWidget.prototype.getModifiedEditor = function () {
        return this.modifiedEditor;
    };
    DiffEditorWidget.prototype.updateOptions = function (newOptions) {
        // Handle side by side
        var renderSideBySideChanged = false;
        if (typeof newOptions.renderSideBySide !== 'undefined') {
            if (this._renderSideBySide !== newOptions.renderSideBySide) {
                this._renderSideBySide = newOptions.renderSideBySide;
                renderSideBySideChanged = true;
            }
        }
        var beginUpdateDecorations = false;
        if (typeof newOptions.ignoreTrimWhitespace !== 'undefined') {
            if (this._ignoreTrimWhitespace !== newOptions.ignoreTrimWhitespace) {
                this._ignoreTrimWhitespace = newOptions.ignoreTrimWhitespace;
                // Begin comparing
                beginUpdateDecorations = true;
            }
        }
        if (typeof newOptions.renderIndicators !== 'undefined') {
            if (this._renderIndicators !== newOptions.renderIndicators) {
                this._renderIndicators = newOptions.renderIndicators;
                beginUpdateDecorations = true;
            }
        }
        if (beginUpdateDecorations) {
            this._beginUpdateDecorations();
        }
        if (typeof newOptions.originalEditable !== 'undefined') {
            this._originalIsEditable = Boolean(newOptions.originalEditable);
        }
        this.modifiedEditor.updateOptions(this._adjustOptionsForRightHandSide(newOptions));
        this.originalEditor.updateOptions(this._adjustOptionsForLeftHandSide(newOptions, this._originalIsEditable));
        // enableSplitViewResizing
        if (typeof newOptions.enableSplitViewResizing !== 'undefined') {
            this._enableSplitViewResizing = newOptions.enableSplitViewResizing;
        }
        this._strategy.setEnableSplitViewResizing(this._enableSplitViewResizing);
        // renderSideBySide
        if (renderSideBySideChanged) {
            if (this._renderSideBySide) {
                this._setStrategy(new DiffEdtorWidgetSideBySide(this._createDataSource(), this._enableSplitViewResizing));
            }
            else {
                this._setStrategy(new DiffEdtorWidgetInline(this._createDataSource(), this._enableSplitViewResizing));
            }
            // Update class name
            this._containerDomElement.className = DiffEditorWidget._getClassName(this._themeService.getTheme(), this._renderSideBySide);
        }
    };
    DiffEditorWidget.prototype.getModel = function () {
        return {
            original: this.originalEditor.getModel(),
            modified: this.modifiedEditor.getModel()
        };
    };
    DiffEditorWidget.prototype.setModel = function (model) {
        // Guard us against partial null model
        if (model && (!model.original || !model.modified)) {
            throw new Error(!model.original ? 'DiffEditorWidget.setModel: Original model is null' : 'DiffEditorWidget.setModel: Modified model is null');
        }
        // Remove all view zones & decorations
        this._cleanViewZonesAndDecorations();
        // Update code editor models
        this.originalEditor.setModel(model ? model.original : null);
        this.modifiedEditor.setModel(model ? model.modified : null);
        this._updateDecorationsRunner.cancel();
        if (model) {
            this.originalEditor.setScrollTop(0);
            this.modifiedEditor.setScrollTop(0);
        }
        // Disable any diff computations that will come in
        this._lineChanges = null;
        this._diffComputationToken++;
        if (model) {
            this._recreateOverviewRulers();
            // Begin comparing
            this._beginUpdateDecorations();
        }
        else {
            this._lineChanges = null;
        }
        this._layoutOverviewViewport();
    };
    DiffEditorWidget.prototype.getDomNode = function () {
        return this._domElement;
    };
    DiffEditorWidget.prototype.getVisibleColumnFromPosition = function (position) {
        return this.modifiedEditor.getVisibleColumnFromPosition(position);
    };
    DiffEditorWidget.prototype.getPosition = function () {
        return this.modifiedEditor.getPosition();
    };
    DiffEditorWidget.prototype.setPosition = function (position) {
        this.modifiedEditor.setPosition(position);
    };
    DiffEditorWidget.prototype.revealLine = function (lineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealLine(lineNumber, scrollType);
    };
    DiffEditorWidget.prototype.revealLineInCenter = function (lineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealLineInCenter(lineNumber, scrollType);
    };
    DiffEditorWidget.prototype.revealLineInCenterIfOutsideViewport = function (lineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealLineInCenterIfOutsideViewport(lineNumber, scrollType);
    };
    DiffEditorWidget.prototype.revealPosition = function (position, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealPosition(position, scrollType);
    };
    DiffEditorWidget.prototype.revealPositionInCenter = function (position, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealPositionInCenter(position, scrollType);
    };
    DiffEditorWidget.prototype.revealPositionInCenterIfOutsideViewport = function (position, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealPositionInCenterIfOutsideViewport(position, scrollType);
    };
    DiffEditorWidget.prototype.getSelection = function () {
        return this.modifiedEditor.getSelection();
    };
    DiffEditorWidget.prototype.getSelections = function () {
        return this.modifiedEditor.getSelections();
    };
    DiffEditorWidget.prototype.setSelection = function (something) {
        this.modifiedEditor.setSelection(something);
    };
    DiffEditorWidget.prototype.setSelections = function (ranges) {
        this.modifiedEditor.setSelections(ranges);
    };
    DiffEditorWidget.prototype.revealLines = function (startLineNumber, endLineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealLines(startLineNumber, endLineNumber, scrollType);
    };
    DiffEditorWidget.prototype.revealLinesInCenter = function (startLineNumber, endLineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealLinesInCenter(startLineNumber, endLineNumber, scrollType);
    };
    DiffEditorWidget.prototype.revealLinesInCenterIfOutsideViewport = function (startLineNumber, endLineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealLinesInCenterIfOutsideViewport(startLineNumber, endLineNumber, scrollType);
    };
    DiffEditorWidget.prototype.revealRange = function (range, scrollType, revealVerticalInCenter, revealHorizontal) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
        if (revealHorizontal === void 0) { revealHorizontal = true; }
        this.modifiedEditor.revealRange(range, scrollType, revealVerticalInCenter, revealHorizontal);
    };
    DiffEditorWidget.prototype.revealRangeInCenter = function (range, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealRangeInCenter(range, scrollType);
    };
    DiffEditorWidget.prototype.revealRangeInCenterIfOutsideViewport = function (range, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealRangeInCenterIfOutsideViewport(range, scrollType);
    };
    DiffEditorWidget.prototype.revealRangeAtTop = function (range, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this.modifiedEditor.revealRangeAtTop(range, scrollType);
    };
    DiffEditorWidget.prototype.getSupportedActions = function () {
        return this.modifiedEditor.getSupportedActions();
    };
    DiffEditorWidget.prototype.saveViewState = function () {
        var originalViewState = this.originalEditor.saveViewState();
        var modifiedViewState = this.modifiedEditor.saveViewState();
        return {
            original: originalViewState,
            modified: modifiedViewState
        };
    };
    DiffEditorWidget.prototype.restoreViewState = function (s) {
        if (s.original && s.original) {
            var diffEditorState = s;
            this.originalEditor.restoreViewState(diffEditorState.original);
            this.modifiedEditor.restoreViewState(diffEditorState.modified);
        }
    };
    DiffEditorWidget.prototype.layout = function (dimension) {
        this._measureDomElement(false, dimension);
    };
    DiffEditorWidget.prototype.focus = function () {
        this.modifiedEditor.focus();
    };
    DiffEditorWidget.prototype.hasTextFocus = function () {
        return this.originalEditor.hasTextFocus() || this.modifiedEditor.hasTextFocus();
    };
    DiffEditorWidget.prototype.onVisible = function () {
        this._isVisible = true;
        this.originalEditor.onVisible();
        this.modifiedEditor.onVisible();
        // Begin comparing
        this._beginUpdateDecorations();
    };
    DiffEditorWidget.prototype.onHide = function () {
        this._isVisible = false;
        this.originalEditor.onHide();
        this.modifiedEditor.onHide();
        // Remove all view zones & decorations
        this._cleanViewZonesAndDecorations();
    };
    DiffEditorWidget.prototype.trigger = function (source, handlerId, payload) {
        this.modifiedEditor.trigger(source, handlerId, payload);
    };
    DiffEditorWidget.prototype.changeDecorations = function (callback) {
        return this.modifiedEditor.changeDecorations(callback);
    };
    //------------ end IDiffEditor methods
    //------------ begin layouting methods
    DiffEditorWidget.prototype._measureDomElement = function (forceDoLayoutCall, dimensions) {
        dimensions = dimensions || {
            width: this._containerDomElement.clientWidth,
            height: this._containerDomElement.clientHeight
        };
        if (dimensions.width <= 0) {
            this._width = 0;
            this._height = 0;
            this._reviewHeight = 0;
            return;
        }
        if (!forceDoLayoutCall && dimensions.width === this._width && dimensions.height === this._height) {
            // Nothing has changed
            return;
        }
        this._width = dimensions.width;
        this._height = dimensions.height;
        this._reviewHeight = this._reviewPane.isVisible() ? this._height : 0;
        this._doLayout();
    };
    DiffEditorWidget.prototype._layoutOverviewRulers = function () {
        var freeSpace = DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH - 2 * DiffEditorWidget.ONE_OVERVIEW_WIDTH;
        var layoutInfo = this.modifiedEditor.getLayoutInfo();
        if (layoutInfo) {
            this._originalOverviewRuler.setLayout({
                top: 0,
                width: DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                right: freeSpace + DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                height: (this._height - this._reviewHeight)
            });
            this._modifiedOverviewRuler.setLayout({
                top: 0,
                right: 0,
                width: DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                height: (this._height - this._reviewHeight)
            });
        }
    };
    //------------ end layouting methods
    DiffEditorWidget.prototype._onViewZonesChanged = function () {
        if (this._currentlyChangingViewZones) {
            return;
        }
        this._updateDecorationsRunner.schedule();
    };
    DiffEditorWidget.prototype._beginUpdateDecorationsSoon = function () {
        var _this = this;
        // Clear previous timeout if necessary
        if (this._beginUpdateDecorationsTimeout !== -1) {
            window.clearTimeout(this._beginUpdateDecorationsTimeout);
            this._beginUpdateDecorationsTimeout = -1;
        }
        this._beginUpdateDecorationsTimeout = window.setTimeout(function () { return _this._beginUpdateDecorations(); }, DiffEditorWidget.UPDATE_DIFF_DECORATIONS_DELAY);
    };
    DiffEditorWidget._equals = function (a, b) {
        if (!a && !b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return (a.toString() === b.toString());
    };
    DiffEditorWidget.prototype._beginUpdateDecorations = function () {
        var _this = this;
        this._beginUpdateDecorationsTimeout = -1;
        var currentOriginalModel = this.originalEditor.getModel();
        var currentModifiedModel = this.modifiedEditor.getModel();
        if (!currentOriginalModel || !currentModifiedModel) {
            return;
        }
        // Prevent old diff requests to come if a new request has been initiated
        // The best method would be to call cancel on the Promise, but this is not
        // yet supported, so using tokens for now.
        this._diffComputationToken++;
        var currentToken = this._diffComputationToken;
        if (!this._editorWorkerService.canComputeDiff(currentOriginalModel.uri, currentModifiedModel.uri)) {
            if (!DiffEditorWidget._equals(currentOriginalModel.uri, this._lastOriginalWarning)
                || !DiffEditorWidget._equals(currentModifiedModel.uri, this._lastModifiedWarning)) {
                this._lastOriginalWarning = currentOriginalModel.uri;
                this._lastModifiedWarning = currentModifiedModel.uri;
                this._notificationService.warn(nls.localize("diff.tooLarge", "Cannot compare files because one file is too large."));
            }
            return;
        }
        this._editorWorkerService.computeDiff(currentOriginalModel.uri, currentModifiedModel.uri, this._ignoreTrimWhitespace).then(function (result) {
            if (currentToken === _this._diffComputationToken
                && currentOriginalModel === _this.originalEditor.getModel()
                && currentModifiedModel === _this.modifiedEditor.getModel()) {
                _this._lineChanges = result;
                _this._updateDecorationsRunner.schedule();
                _this._onDidUpdateDiff.fire();
            }
        }, function (error) {
            if (currentToken === _this._diffComputationToken
                && currentOriginalModel === _this.originalEditor.getModel()
                && currentModifiedModel === _this.modifiedEditor.getModel()) {
                _this._lineChanges = null;
                _this._updateDecorationsRunner.schedule();
            }
        });
    };
    DiffEditorWidget.prototype._cleanViewZonesAndDecorations = function () {
        this._originalEditorState.clean(this.originalEditor);
        this._modifiedEditorState.clean(this.modifiedEditor);
    };
    DiffEditorWidget.prototype._updateDecorations = function () {
        if (!this.originalEditor.getModel() || !this.modifiedEditor.getModel()) {
            return;
        }
        var lineChanges = this._lineChanges || [];
        var foreignOriginal = this._originalEditorState.getForeignViewZones(this.originalEditor.getWhitespaces());
        var foreignModified = this._modifiedEditorState.getForeignViewZones(this.modifiedEditor.getWhitespaces());
        var diffDecorations = this._strategy.getEditorsDiffDecorations(lineChanges, this._ignoreTrimWhitespace, this._renderIndicators, foreignOriginal, foreignModified, this.originalEditor, this.modifiedEditor);
        try {
            this._currentlyChangingViewZones = true;
            this._originalEditorState.apply(this.originalEditor, this._originalOverviewRuler, diffDecorations.original, false);
            this._modifiedEditorState.apply(this.modifiedEditor, this._modifiedOverviewRuler, diffDecorations.modified, true);
        }
        finally {
            this._currentlyChangingViewZones = false;
        }
    };
    DiffEditorWidget.prototype._adjustOptionsForSubEditor = function (options) {
        var clonedOptions = objects.deepClone(options || {});
        clonedOptions.inDiffEditor = true;
        clonedOptions.wordWrap = 'off';
        clonedOptions.wordWrapMinified = false;
        clonedOptions.automaticLayout = false;
        clonedOptions.scrollbar = clonedOptions.scrollbar || {};
        clonedOptions.scrollbar.vertical = 'visible';
        clonedOptions.folding = false;
        clonedOptions.codeLens = false;
        clonedOptions.fixedOverflowWidgets = true;
        // clonedOptions.lineDecorationsWidth = '2ch';
        if (!clonedOptions.minimap) {
            clonedOptions.minimap = {};
        }
        clonedOptions.minimap.enabled = false;
        return clonedOptions;
    };
    DiffEditorWidget.prototype._adjustOptionsForLeftHandSide = function (options, isEditable) {
        var result = this._adjustOptionsForSubEditor(options);
        result.readOnly = !isEditable;
        result.overviewRulerLanes = 1;
        result.extraEditorClassName = 'original-in-monaco-diff-editor';
        return result;
    };
    DiffEditorWidget.prototype._adjustOptionsForRightHandSide = function (options) {
        var result = this._adjustOptionsForSubEditor(options);
        result.revealHorizontalRightPadding = editorOptions.EDITOR_DEFAULTS.viewInfo.revealHorizontalRightPadding + DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH;
        result.scrollbar.verticalHasArrows = false;
        result.extraEditorClassName = 'modified-in-monaco-diff-editor';
        return result;
    };
    DiffEditorWidget.prototype.doLayout = function () {
        this._measureDomElement(true);
    };
    DiffEditorWidget.prototype._doLayout = function () {
        var splitPoint = this._strategy.layout();
        this._originalDomNode.style.width = splitPoint + 'px';
        this._originalDomNode.style.left = '0px';
        this._modifiedDomNode.style.width = (this._width - splitPoint) + 'px';
        this._modifiedDomNode.style.left = splitPoint + 'px';
        this._overviewDomElement.style.top = '0px';
        this._overviewDomElement.style.height = (this._height - this._reviewHeight) + 'px';
        this._overviewDomElement.style.width = DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH + 'px';
        this._overviewDomElement.style.left = (this._width - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH) + 'px';
        this._overviewViewportDomElement.setWidth(DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH);
        this._overviewViewportDomElement.setHeight(30);
        this.originalEditor.layout({ width: splitPoint, height: (this._height - this._reviewHeight) });
        this.modifiedEditor.layout({ width: this._width - splitPoint - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH, height: (this._height - this._reviewHeight) });
        if (this._originalOverviewRuler || this._modifiedOverviewRuler) {
            this._layoutOverviewRulers();
        }
        this._reviewPane.layout(this._height - this._reviewHeight, this._width, this._reviewHeight);
        this._layoutOverviewViewport();
    };
    DiffEditorWidget.prototype._layoutOverviewViewport = function () {
        var layout = this._computeOverviewViewport();
        if (!layout) {
            this._overviewViewportDomElement.setTop(0);
            this._overviewViewportDomElement.setHeight(0);
        }
        else {
            this._overviewViewportDomElement.setTop(layout.top);
            this._overviewViewportDomElement.setHeight(layout.height);
        }
    };
    DiffEditorWidget.prototype._computeOverviewViewport = function () {
        var layoutInfo = this.modifiedEditor.getLayoutInfo();
        if (!layoutInfo) {
            return null;
        }
        var scrollTop = this.modifiedEditor.getScrollTop();
        var scrollHeight = this.modifiedEditor.getScrollHeight();
        var computedAvailableSize = Math.max(0, layoutInfo.contentHeight);
        var computedRepresentableSize = Math.max(0, computedAvailableSize - 2 * 0);
        var computedRatio = scrollHeight > 0 ? (computedRepresentableSize / scrollHeight) : 0;
        var computedSliderSize = Math.max(0, Math.floor(layoutInfo.contentHeight * computedRatio));
        var computedSliderPosition = Math.floor(scrollTop * computedRatio);
        return {
            height: computedSliderSize,
            top: computedSliderPosition
        };
    };
    DiffEditorWidget.prototype._createDataSource = function () {
        var _this = this;
        return {
            getWidth: function () {
                return _this._width;
            },
            getHeight: function () {
                return (_this._height - _this._reviewHeight);
            },
            getContainerDomNode: function () {
                return _this._containerDomElement;
            },
            relayoutEditors: function () {
                _this._doLayout();
            },
            getOriginalEditor: function () {
                return _this.originalEditor;
            },
            getModifiedEditor: function () {
                return _this.modifiedEditor;
            }
        };
    };
    DiffEditorWidget.prototype._setStrategy = function (newStrategy) {
        if (this._strategy) {
            this._strategy.dispose();
        }
        this._strategy = newStrategy;
        newStrategy.applyColors(this._themeService.getTheme());
        if (this._lineChanges) {
            this._updateDecorations();
        }
        // Just do a layout, the strategy might need it
        this._measureDomElement(true);
    };
    DiffEditorWidget.prototype._getLineChangeAtOrBeforeLineNumber = function (lineNumber, startLineNumberExtractor) {
        if (this._lineChanges.length === 0 || lineNumber < startLineNumberExtractor(this._lineChanges[0])) {
            // There are no changes or `lineNumber` is before the first change
            return null;
        }
        var min = 0, max = this._lineChanges.length - 1;
        while (min < max) {
            var mid = Math.floor((min + max) / 2);
            var midStart = startLineNumberExtractor(this._lineChanges[mid]);
            var midEnd = (mid + 1 <= max ? startLineNumberExtractor(this._lineChanges[mid + 1]) : Number.MAX_VALUE);
            if (lineNumber < midStart) {
                max = mid - 1;
            }
            else if (lineNumber >= midEnd) {
                min = mid + 1;
            }
            else {
                // HIT!
                min = mid;
                max = mid;
            }
        }
        return this._lineChanges[min];
    };
    DiffEditorWidget.prototype._getEquivalentLineForOriginalLineNumber = function (lineNumber) {
        var lineChange = this._getLineChangeAtOrBeforeLineNumber(lineNumber, function (lineChange) { return lineChange.originalStartLineNumber; });
        if (!lineChange) {
            return lineNumber;
        }
        var originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
        var modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
        var lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
        var lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
        var delta = lineNumber - originalEquivalentLineNumber;
        if (delta <= lineChangeOriginalLength) {
            return modifiedEquivalentLineNumber + Math.min(delta, lineChangeModifiedLength);
        }
        return modifiedEquivalentLineNumber + lineChangeModifiedLength - lineChangeOriginalLength + delta;
    };
    DiffEditorWidget.prototype._getEquivalentLineForModifiedLineNumber = function (lineNumber) {
        var lineChange = this._getLineChangeAtOrBeforeLineNumber(lineNumber, function (lineChange) { return lineChange.modifiedStartLineNumber; });
        if (!lineChange) {
            return lineNumber;
        }
        var originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
        var modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
        var lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
        var lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
        var delta = lineNumber - modifiedEquivalentLineNumber;
        if (delta <= lineChangeModifiedLength) {
            return originalEquivalentLineNumber + Math.min(delta, lineChangeOriginalLength);
        }
        return originalEquivalentLineNumber + lineChangeOriginalLength - lineChangeModifiedLength + delta;
    };
    DiffEditorWidget.prototype.getDiffLineInformationForOriginal = function (lineNumber) {
        if (!this._lineChanges) {
            // Cannot answer that which I don't know
            return null;
        }
        return {
            equivalentLineNumber: this._getEquivalentLineForOriginalLineNumber(lineNumber)
        };
    };
    DiffEditorWidget.prototype.getDiffLineInformationForModified = function (lineNumber) {
        if (!this._lineChanges) {
            // Cannot answer that which I don't know
            return null;
        }
        return {
            equivalentLineNumber: this._getEquivalentLineForModifiedLineNumber(lineNumber)
        };
    };
    DiffEditorWidget.ONE_OVERVIEW_WIDTH = 15;
    DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH = 30;
    DiffEditorWidget.UPDATE_DIFF_DECORATIONS_DELAY = 200; // ms
    DiffEditorWidget = __decorate([
        __param(2, IEditorWorkerService),
        __param(3, IContextKeyService),
        __param(4, IInstantiationService),
        __param(5, ICodeEditorService),
        __param(6, IThemeService),
        __param(7, INotificationService)
    ], DiffEditorWidget);
    return DiffEditorWidget;
}(Disposable));
export { DiffEditorWidget };
var DiffEditorWidgetStyle = /** @class */ (function (_super) {
    __extends(DiffEditorWidgetStyle, _super);
    function DiffEditorWidgetStyle(dataSource) {
        var _this = _super.call(this) || this;
        _this._dataSource = dataSource;
        return _this;
    }
    DiffEditorWidgetStyle.prototype.applyColors = function (theme) {
        var newInsertColor = (theme.getColor(diffInserted) || defaultInsertColor).transparent(2);
        var newRemoveColor = (theme.getColor(diffRemoved) || defaultRemoveColor).transparent(2);
        var hasChanges = !newInsertColor.equals(this._insertColor) || !newRemoveColor.equals(this._removeColor);
        this._insertColor = newInsertColor;
        this._removeColor = newRemoveColor;
        return hasChanges;
    };
    DiffEditorWidgetStyle.prototype.getEditorsDiffDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalWhitespaces, modifiedWhitespaces, originalEditor, modifiedEditor) {
        // Get view zones
        modifiedWhitespaces = modifiedWhitespaces.sort(function (a, b) {
            return a.afterLineNumber - b.afterLineNumber;
        });
        originalWhitespaces = originalWhitespaces.sort(function (a, b) {
            return a.afterLineNumber - b.afterLineNumber;
        });
        var zones = this._getViewZones(lineChanges, originalWhitespaces, modifiedWhitespaces, originalEditor, modifiedEditor, renderIndicators);
        // Get decorations & overview ruler zones
        var originalDecorations = this._getOriginalEditorDecorations(lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor);
        var modifiedDecorations = this._getModifiedEditorDecorations(lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor);
        return {
            original: {
                decorations: originalDecorations.decorations,
                overviewZones: originalDecorations.overviewZones,
                zones: zones.original
            },
            modified: {
                decorations: modifiedDecorations.decorations,
                overviewZones: modifiedDecorations.overviewZones,
                zones: zones.modified
            }
        };
    };
    return DiffEditorWidgetStyle;
}(Disposable));
var ForeignViewZonesIterator = /** @class */ (function () {
    function ForeignViewZonesIterator(source) {
        this._source = source;
        this._index = -1;
        this.advance();
    }
    ForeignViewZonesIterator.prototype.advance = function () {
        this._index++;
        if (this._index < this._source.length) {
            this.current = this._source[this._index];
        }
        else {
            this.current = null;
        }
    };
    return ForeignViewZonesIterator;
}());
var ViewZonesComputer = /** @class */ (function () {
    function ViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ) {
        this.lineChanges = lineChanges;
        this.originalForeignVZ = originalForeignVZ;
        this.modifiedForeignVZ = modifiedForeignVZ;
    }
    ViewZonesComputer.prototype.getViewZones = function () {
        var result = {
            original: [],
            modified: []
        };
        var lineChangeModifiedLength = 0;
        var lineChangeOriginalLength = 0;
        var originalEquivalentLineNumber = 0;
        var modifiedEquivalentLineNumber = 0;
        var originalEndEquivalentLineNumber = 0;
        var modifiedEndEquivalentLineNumber = 0;
        var sortMyViewZones = function (a, b) {
            return a.afterLineNumber - b.afterLineNumber;
        };
        var addAndCombineIfPossible = function (destination, item) {
            if (item.domNode === null && destination.length > 0) {
                var lastItem = destination[destination.length - 1];
                if (lastItem.afterLineNumber === item.afterLineNumber && lastItem.domNode === null) {
                    lastItem.heightInLines += item.heightInLines;
                    return;
                }
            }
            destination.push(item);
        };
        var modifiedForeignVZ = new ForeignViewZonesIterator(this.modifiedForeignVZ);
        var originalForeignVZ = new ForeignViewZonesIterator(this.originalForeignVZ);
        // In order to include foreign view zones after the last line change, the for loop will iterate once more after the end of the `lineChanges` array
        for (var i = 0, length_4 = this.lineChanges.length; i <= length_4; i++) {
            var lineChange = (i < length_4 ? this.lineChanges[i] : null);
            if (lineChange !== null) {
                originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
                modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
                lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
                lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
                originalEndEquivalentLineNumber = Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber);
                modifiedEndEquivalentLineNumber = Math.max(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber);
            }
            else {
                // Increase to very large value to get the producing tests of foreign view zones running
                originalEquivalentLineNumber += 10000000 + lineChangeOriginalLength;
                modifiedEquivalentLineNumber += 10000000 + lineChangeModifiedLength;
                originalEndEquivalentLineNumber = originalEquivalentLineNumber;
                modifiedEndEquivalentLineNumber = modifiedEquivalentLineNumber;
            }
            // Each step produces view zones, and after producing them, we try to cancel them out, to avoid empty-empty view zone cases
            var stepOriginal = [];
            var stepModified = [];
            // ---------------------------- PRODUCE VIEW ZONES
            // [PRODUCE] View zone(s) in original-side due to foreign view zone(s) in modified-side
            while (modifiedForeignVZ.current && modifiedForeignVZ.current.afterLineNumber <= modifiedEndEquivalentLineNumber) {
                var viewZoneLineNumber = void 0;
                if (modifiedForeignVZ.current.afterLineNumber <= modifiedEquivalentLineNumber) {
                    viewZoneLineNumber = originalEquivalentLineNumber - modifiedEquivalentLineNumber + modifiedForeignVZ.current.afterLineNumber;
                }
                else {
                    viewZoneLineNumber = originalEndEquivalentLineNumber;
                }
                var marginDomNode = null;
                if (lineChange && lineChange.modifiedStartLineNumber <= modifiedForeignVZ.current.afterLineNumber && modifiedForeignVZ.current.afterLineNumber <= lineChange.modifiedEndLineNumber) {
                    marginDomNode = this._createOriginalMarginDomNodeForModifiedForeignViewZoneInAddedRegion();
                }
                stepOriginal.push({
                    afterLineNumber: viewZoneLineNumber,
                    heightInLines: modifiedForeignVZ.current.heightInLines,
                    domNode: null,
                    marginDomNode: marginDomNode
                });
                modifiedForeignVZ.advance();
            }
            // [PRODUCE] View zone(s) in modified-side due to foreign view zone(s) in original-side
            while (originalForeignVZ.current && originalForeignVZ.current.afterLineNumber <= originalEndEquivalentLineNumber) {
                var viewZoneLineNumber = void 0;
                if (originalForeignVZ.current.afterLineNumber <= originalEquivalentLineNumber) {
                    viewZoneLineNumber = modifiedEquivalentLineNumber - originalEquivalentLineNumber + originalForeignVZ.current.afterLineNumber;
                }
                else {
                    viewZoneLineNumber = modifiedEndEquivalentLineNumber;
                }
                stepModified.push({
                    afterLineNumber: viewZoneLineNumber,
                    heightInLines: originalForeignVZ.current.heightInLines,
                    domNode: null
                });
                originalForeignVZ.advance();
            }
            if (lineChange !== null && isChangeOrInsert(lineChange)) {
                var r = this._produceOriginalFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength);
                if (r) {
                    stepOriginal.push(r);
                }
            }
            if (lineChange !== null && isChangeOrDelete(lineChange)) {
                var r = this._produceModifiedFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength);
                if (r) {
                    stepModified.push(r);
                }
            }
            // ---------------------------- END PRODUCE VIEW ZONES
            // ---------------------------- EMIT MINIMAL VIEW ZONES
            // [CANCEL & EMIT] Try to cancel view zones out
            var stepOriginalIndex = 0;
            var stepModifiedIndex = 0;
            stepOriginal = stepOriginal.sort(sortMyViewZones);
            stepModified = stepModified.sort(sortMyViewZones);
            while (stepOriginalIndex < stepOriginal.length && stepModifiedIndex < stepModified.length) {
                var original = stepOriginal[stepOriginalIndex];
                var modified = stepModified[stepModifiedIndex];
                var originalDelta = original.afterLineNumber - originalEquivalentLineNumber;
                var modifiedDelta = modified.afterLineNumber - modifiedEquivalentLineNumber;
                if (originalDelta < modifiedDelta) {
                    addAndCombineIfPossible(result.original, original);
                    stepOriginalIndex++;
                }
                else if (modifiedDelta < originalDelta) {
                    addAndCombineIfPossible(result.modified, modified);
                    stepModifiedIndex++;
                }
                else if (original.shouldNotShrink) {
                    addAndCombineIfPossible(result.original, original);
                    stepOriginalIndex++;
                }
                else if (modified.shouldNotShrink) {
                    addAndCombineIfPossible(result.modified, modified);
                    stepModifiedIndex++;
                }
                else {
                    if (original.heightInLines >= modified.heightInLines) {
                        // modified view zone gets removed
                        original.heightInLines -= modified.heightInLines;
                        stepModifiedIndex++;
                    }
                    else {
                        // original view zone gets removed
                        modified.heightInLines -= original.heightInLines;
                        stepOriginalIndex++;
                    }
                }
            }
            // [EMIT] Remaining original view zones
            while (stepOriginalIndex < stepOriginal.length) {
                addAndCombineIfPossible(result.original, stepOriginal[stepOriginalIndex]);
                stepOriginalIndex++;
            }
            // [EMIT] Remaining modified view zones
            while (stepModifiedIndex < stepModified.length) {
                addAndCombineIfPossible(result.modified, stepModified[stepModifiedIndex]);
                stepModifiedIndex++;
            }
            // ---------------------------- END EMIT MINIMAL VIEW ZONES
        }
        var ensureDomNode = function (z) {
            if (!z.domNode) {
                z.domNode = createFakeLinesDiv();
            }
        };
        result.original.forEach(ensureDomNode);
        result.modified.forEach(ensureDomNode);
        return result;
    };
    return ViewZonesComputer;
}());
function createDecoration(startLineNumber, startColumn, endLineNumber, endColumn, options) {
    return {
        range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
        options: options
    };
}
var DECORATIONS = {
    charDelete: ModelDecorationOptions.register({
        className: 'char-delete'
    }),
    charDeleteWholeLine: ModelDecorationOptions.register({
        className: 'char-delete',
        isWholeLine: true
    }),
    charInsert: ModelDecorationOptions.register({
        className: 'char-insert'
    }),
    charInsertWholeLine: ModelDecorationOptions.register({
        className: 'char-insert',
        isWholeLine: true
    }),
    lineInsert: ModelDecorationOptions.register({
        className: 'line-insert',
        marginClassName: 'line-insert',
        isWholeLine: true
    }),
    lineInsertWithSign: ModelDecorationOptions.register({
        className: 'line-insert',
        linesDecorationsClassName: 'insert-sign',
        marginClassName: 'line-insert',
        isWholeLine: true
    }),
    lineDelete: ModelDecorationOptions.register({
        className: 'line-delete',
        marginClassName: 'line-delete',
        isWholeLine: true
    }),
    lineDeleteWithSign: ModelDecorationOptions.register({
        className: 'line-delete',
        linesDecorationsClassName: 'delete-sign',
        marginClassName: 'line-delete',
        isWholeLine: true
    }),
    lineDeleteMargin: ModelDecorationOptions.register({
        marginClassName: 'line-delete',
    })
};
var DiffEdtorWidgetSideBySide = /** @class */ (function (_super) {
    __extends(DiffEdtorWidgetSideBySide, _super);
    function DiffEdtorWidgetSideBySide(dataSource, enableSplitViewResizing) {
        var _this = _super.call(this, dataSource) || this;
        _this._disableSash = (enableSplitViewResizing === false);
        _this._sashRatio = null;
        _this._sashPosition = null;
        _this._sash = _this._register(new Sash(_this._dataSource.getContainerDomNode(), _this));
        if (_this._disableSash) {
            _this._sash.state = 0 /* Disabled */;
        }
        _this._sash.onDidStart(function () { return _this.onSashDragStart(); });
        _this._sash.onDidChange(function (e) { return _this.onSashDrag(e); });
        _this._sash.onDidEnd(function () { return _this.onSashDragEnd(); });
        _this._sash.onDidReset(function () { return _this.onSashReset(); });
        return _this;
    }
    DiffEdtorWidgetSideBySide.prototype.setEnableSplitViewResizing = function (enableSplitViewResizing) {
        var newDisableSash = (enableSplitViewResizing === false);
        if (this._disableSash !== newDisableSash) {
            this._disableSash = newDisableSash;
            this._sash.state = this._disableSash ? 0 /* Disabled */ : 3 /* Enabled */;
        }
    };
    DiffEdtorWidgetSideBySide.prototype.layout = function (sashRatio) {
        if (sashRatio === void 0) { sashRatio = this._sashRatio; }
        var w = this._dataSource.getWidth();
        var contentWidth = w - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH;
        var sashPosition = Math.floor((sashRatio || 0.5) * contentWidth);
        var midPoint = Math.floor(0.5 * contentWidth);
        sashPosition = this._disableSash ? midPoint : sashPosition || midPoint;
        if (contentWidth > DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH * 2) {
            if (sashPosition < DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH) {
                sashPosition = DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH;
            }
            if (sashPosition > contentWidth - DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH) {
                sashPosition = contentWidth - DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH;
            }
        }
        else {
            sashPosition = midPoint;
        }
        if (this._sashPosition !== sashPosition) {
            this._sashPosition = sashPosition;
            this._sash.layout();
        }
        return this._sashPosition;
    };
    DiffEdtorWidgetSideBySide.prototype.onSashDragStart = function () {
        this._startSashPosition = this._sashPosition;
    };
    DiffEdtorWidgetSideBySide.prototype.onSashDrag = function (e) {
        var w = this._dataSource.getWidth();
        var contentWidth = w - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH;
        var sashPosition = this.layout((this._startSashPosition + (e.currentX - e.startX)) / contentWidth);
        this._sashRatio = sashPosition / contentWidth;
        this._dataSource.relayoutEditors();
    };
    DiffEdtorWidgetSideBySide.prototype.onSashDragEnd = function () {
        this._sash.layout();
    };
    DiffEdtorWidgetSideBySide.prototype.onSashReset = function () {
        this._sashRatio = 0.5;
        this._dataSource.relayoutEditors();
        this._sash.layout();
    };
    DiffEdtorWidgetSideBySide.prototype.getVerticalSashTop = function (sash) {
        return 0;
    };
    DiffEdtorWidgetSideBySide.prototype.getVerticalSashLeft = function (sash) {
        return this._sashPosition;
    };
    DiffEdtorWidgetSideBySide.prototype.getVerticalSashHeight = function (sash) {
        return this._dataSource.getHeight();
    };
    DiffEdtorWidgetSideBySide.prototype._getViewZones = function (lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor) {
        var c = new SideBySideViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ);
        return c.getViewZones();
    };
    DiffEdtorWidgetSideBySide.prototype._getOriginalEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
        var overviewZoneColor = this._removeColor.toString();
        var result = {
            decorations: [],
            overviewZones: []
        };
        var originalModel = originalEditor.getModel();
        for (var i = 0, length_5 = lineChanges.length; i < length_5; i++) {
            var lineChange = lineChanges[i];
            if (isChangeOrDelete(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, Number.MAX_VALUE),
                    options: (renderIndicators ? DECORATIONS.lineDeleteWithSign : DECORATIONS.lineDelete)
                });
                if (!isChangeOrInsert(lineChange) || !lineChange.charChanges) {
                    result.decorations.push(createDecoration(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, Number.MAX_VALUE, DECORATIONS.charDeleteWholeLine));
                }
                result.overviewZones.push(new OverviewRulerZone(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber, overviewZoneColor));
                if (lineChange.charChanges) {
                    for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                        var charChange = lineChange.charChanges[j];
                        if (isChangeOrDelete(charChange)) {
                            if (ignoreTrimWhitespace) {
                                for (var lineNumber = charChange.originalStartLineNumber; lineNumber <= charChange.originalEndLineNumber; lineNumber++) {
                                    var startColumn = void 0;
                                    var endColumn = void 0;
                                    if (lineNumber === charChange.originalStartLineNumber) {
                                        startColumn = charChange.originalStartColumn;
                                    }
                                    else {
                                        startColumn = originalModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                    }
                                    if (lineNumber === charChange.originalEndLineNumber) {
                                        endColumn = charChange.originalEndColumn;
                                    }
                                    else {
                                        endColumn = originalModel.getLineLastNonWhitespaceColumn(lineNumber);
                                    }
                                    result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charDelete));
                                }
                            }
                            else {
                                result.decorations.push(createDecoration(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn, DECORATIONS.charDelete));
                            }
                        }
                    }
                }
            }
        }
        return result;
    };
    DiffEdtorWidgetSideBySide.prototype._getModifiedEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
        var overviewZoneColor = this._insertColor.toString();
        var result = {
            decorations: [],
            overviewZones: []
        };
        var modifiedModel = modifiedEditor.getModel();
        for (var i = 0, length_6 = lineChanges.length; i < length_6; i++) {
            var lineChange = lineChanges[i];
            if (isChangeOrInsert(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE),
                    options: (renderIndicators ? DECORATIONS.lineInsertWithSign : DECORATIONS.lineInsert)
                });
                if (!isChangeOrDelete(lineChange) || !lineChange.charChanges) {
                    result.decorations.push(createDecoration(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE, DECORATIONS.charInsertWholeLine));
                }
                result.overviewZones.push(new OverviewRulerZone(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber, overviewZoneColor));
                if (lineChange.charChanges) {
                    for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                        var charChange = lineChange.charChanges[j];
                        if (isChangeOrInsert(charChange)) {
                            if (ignoreTrimWhitespace) {
                                for (var lineNumber = charChange.modifiedStartLineNumber; lineNumber <= charChange.modifiedEndLineNumber; lineNumber++) {
                                    var startColumn = void 0;
                                    var endColumn = void 0;
                                    if (lineNumber === charChange.modifiedStartLineNumber) {
                                        startColumn = charChange.modifiedStartColumn;
                                    }
                                    else {
                                        startColumn = modifiedModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                    }
                                    if (lineNumber === charChange.modifiedEndLineNumber) {
                                        endColumn = charChange.modifiedEndColumn;
                                    }
                                    else {
                                        endColumn = modifiedModel.getLineLastNonWhitespaceColumn(lineNumber);
                                    }
                                    result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charInsert));
                                }
                            }
                            else {
                                result.decorations.push(createDecoration(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn, DECORATIONS.charInsert));
                            }
                        }
                    }
                }
            }
        }
        return result;
    };
    DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH = 100;
    return DiffEdtorWidgetSideBySide;
}(DiffEditorWidgetStyle));
var SideBySideViewZonesComputer = /** @class */ (function (_super) {
    __extends(SideBySideViewZonesComputer, _super);
    function SideBySideViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ) {
        return _super.call(this, lineChanges, originalForeignVZ, modifiedForeignVZ) || this;
    }
    SideBySideViewZonesComputer.prototype._createOriginalMarginDomNodeForModifiedForeignViewZoneInAddedRegion = function () {
        return null;
    };
    SideBySideViewZonesComputer.prototype._produceOriginalFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        if (lineChangeModifiedLength > lineChangeOriginalLength) {
            return {
                afterLineNumber: Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber),
                heightInLines: (lineChangeModifiedLength - lineChangeOriginalLength),
                domNode: null
            };
        }
        return null;
    };
    SideBySideViewZonesComputer.prototype._produceModifiedFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        if (lineChangeOriginalLength > lineChangeModifiedLength) {
            return {
                afterLineNumber: Math.max(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber),
                heightInLines: (lineChangeOriginalLength - lineChangeModifiedLength),
                domNode: null
            };
        }
        return null;
    };
    return SideBySideViewZonesComputer;
}(ViewZonesComputer));
var DiffEdtorWidgetInline = /** @class */ (function (_super) {
    __extends(DiffEdtorWidgetInline, _super);
    function DiffEdtorWidgetInline(dataSource, enableSplitViewResizing) {
        var _this = _super.call(this, dataSource) || this;
        _this.decorationsLeft = dataSource.getOriginalEditor().getLayoutInfo().decorationsLeft;
        _this._register(dataSource.getOriginalEditor().onDidLayoutChange(function (layoutInfo) {
            if (_this.decorationsLeft !== layoutInfo.decorationsLeft) {
                _this.decorationsLeft = layoutInfo.decorationsLeft;
                dataSource.relayoutEditors();
            }
        }));
        return _this;
    }
    DiffEdtorWidgetInline.prototype.setEnableSplitViewResizing = function (enableSplitViewResizing) {
        // Nothing to do..
    };
    DiffEdtorWidgetInline.prototype._getViewZones = function (lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators) {
        var computer = new InlineViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators);
        return computer.getViewZones();
    };
    DiffEdtorWidgetInline.prototype._getOriginalEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
        var overviewZoneColor = this._removeColor.toString();
        var result = {
            decorations: [],
            overviewZones: []
        };
        for (var i = 0, length_7 = lineChanges.length; i < length_7; i++) {
            var lineChange = lineChanges[i];
            // Add overview zones in the overview ruler
            if (isChangeOrDelete(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, Number.MAX_VALUE),
                    options: DECORATIONS.lineDeleteMargin
                });
                result.overviewZones.push(new OverviewRulerZone(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber, overviewZoneColor));
            }
        }
        return result;
    };
    DiffEdtorWidgetInline.prototype._getModifiedEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
        var overviewZoneColor = this._insertColor.toString();
        var result = {
            decorations: [],
            overviewZones: []
        };
        var modifiedModel = modifiedEditor.getModel();
        for (var i = 0, length_8 = lineChanges.length; i < length_8; i++) {
            var lineChange = lineChanges[i];
            // Add decorations & overview zones
            if (isChangeOrInsert(lineChange)) {
                result.decorations.push({
                    range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE),
                    options: (renderIndicators ? DECORATIONS.lineInsertWithSign : DECORATIONS.lineInsert)
                });
                result.overviewZones.push(new OverviewRulerZone(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber, overviewZoneColor));
                if (lineChange.charChanges) {
                    for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                        var charChange = lineChange.charChanges[j];
                        if (isChangeOrInsert(charChange)) {
                            if (ignoreTrimWhitespace) {
                                for (var lineNumber = charChange.modifiedStartLineNumber; lineNumber <= charChange.modifiedEndLineNumber; lineNumber++) {
                                    var startColumn = void 0;
                                    var endColumn = void 0;
                                    if (lineNumber === charChange.modifiedStartLineNumber) {
                                        startColumn = charChange.modifiedStartColumn;
                                    }
                                    else {
                                        startColumn = modifiedModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                    }
                                    if (lineNumber === charChange.modifiedEndLineNumber) {
                                        endColumn = charChange.modifiedEndColumn;
                                    }
                                    else {
                                        endColumn = modifiedModel.getLineLastNonWhitespaceColumn(lineNumber);
                                    }
                                    result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charInsert));
                                }
                            }
                            else {
                                result.decorations.push(createDecoration(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn, DECORATIONS.charInsert));
                            }
                        }
                    }
                }
                else {
                    result.decorations.push(createDecoration(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE, DECORATIONS.charInsertWholeLine));
                }
            }
        }
        return result;
    };
    DiffEdtorWidgetInline.prototype.layout = function () {
        // An editor should not be smaller than 5px
        return Math.max(5, this.decorationsLeft);
    };
    return DiffEdtorWidgetInline;
}(DiffEditorWidgetStyle));
var InlineViewZonesComputer = /** @class */ (function (_super) {
    __extends(InlineViewZonesComputer, _super);
    function InlineViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators) {
        var _this = _super.call(this, lineChanges, originalForeignVZ, modifiedForeignVZ) || this;
        _this.originalModel = originalEditor.getModel();
        _this.modifiedEditorConfiguration = modifiedEditor.getConfiguration();
        _this.modifiedEditorTabSize = modifiedEditor.getModel().getOptions().tabSize;
        _this.renderIndicators = renderIndicators;
        return _this;
    }
    InlineViewZonesComputer.prototype._createOriginalMarginDomNodeForModifiedForeignViewZoneInAddedRegion = function () {
        var result = document.createElement('div');
        result.className = 'inline-added-margin-view-zone';
        return result;
    };
    InlineViewZonesComputer.prototype._produceOriginalFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        var marginDomNode = document.createElement('div');
        marginDomNode.className = 'inline-added-margin-view-zone';
        return {
            afterLineNumber: Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber),
            heightInLines: lineChangeModifiedLength,
            domNode: document.createElement('div'),
            marginDomNode: marginDomNode
        };
    };
    InlineViewZonesComputer.prototype._produceModifiedFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
        var decorations = [];
        if (lineChange.charChanges) {
            for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                var charChange = lineChange.charChanges[j];
                if (isChangeOrDelete(charChange)) {
                    decorations.push(new InlineDecoration(new Range(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn), 'char-delete', 0 /* Regular */));
                }
            }
        }
        var sb = createStringBuilder(10000);
        var marginHTML = [];
        var lineDecorationsWidth = this.modifiedEditorConfiguration.layoutInfo.decorationsWidth;
        var lineHeight = this.modifiedEditorConfiguration.lineHeight;
        var typicalHalfwidthCharacterWidth = this.modifiedEditorConfiguration.fontInfo.typicalHalfwidthCharacterWidth;
        var maxCharsPerLine = 0;
        for (var lineNumber = lineChange.originalStartLineNumber; lineNumber <= lineChange.originalEndLineNumber; lineNumber++) {
            maxCharsPerLine = Math.max(maxCharsPerLine, this._renderOriginalLine(lineNumber - lineChange.originalStartLineNumber, this.originalModel, this.modifiedEditorConfiguration, this.modifiedEditorTabSize, lineNumber, decorations, sb));
            if (this.renderIndicators) {
                var index = lineNumber - lineChange.originalStartLineNumber;
                marginHTML = marginHTML.concat([
                    "<div class=\"delete-sign\" style=\"position:absolute;top:" + index * lineHeight + "px;width:" + lineDecorationsWidth + "px;height:" + lineHeight + "px;right:0;\"></div>"
                ]);
            }
        }
        maxCharsPerLine += this.modifiedEditorConfiguration.viewInfo.scrollBeyondLastColumn;
        var domNode = document.createElement('div');
        domNode.className = 'view-lines line-delete';
        domNode.innerHTML = sb.build();
        Configuration.applyFontInfoSlow(domNode, this.modifiedEditorConfiguration.fontInfo);
        var marginDomNode = document.createElement('div');
        marginDomNode.className = 'inline-deleted-margin-view-zone';
        marginDomNode.innerHTML = marginHTML.join('');
        Configuration.applyFontInfoSlow(marginDomNode, this.modifiedEditorConfiguration.fontInfo);
        return {
            shouldNotShrink: true,
            afterLineNumber: (lineChange.modifiedEndLineNumber === 0 ? lineChange.modifiedStartLineNumber : lineChange.modifiedStartLineNumber - 1),
            heightInLines: lineChangeOriginalLength,
            minWidthInPx: (maxCharsPerLine * typicalHalfwidthCharacterWidth),
            domNode: domNode,
            marginDomNode: marginDomNode
        };
    };
    InlineViewZonesComputer.prototype._renderOriginalLine = function (count, originalModel, config, tabSize, lineNumber, decorations, sb) {
        var lineTokens = originalModel.getLineTokens(lineNumber);
        var lineContent = lineTokens.getLineContent();
        var actualDecorations = LineDecoration.filter(decorations, lineNumber, 1, lineContent.length + 1);
        sb.appendASCIIString('<div class="view-line');
        if (decorations.length === 0) {
            // No char changes
            sb.appendASCIIString(' char-delete');
        }
        sb.appendASCIIString('" style="top:');
        sb.appendASCIIString(String(count * config.lineHeight));
        sb.appendASCIIString('px;width:1000000px;">');
        var isBasicASCII = ViewLineRenderingData.isBasicASCII(lineContent, originalModel.mightContainNonBasicASCII());
        var containsRTL = ViewLineRenderingData.containsRTL(lineContent, isBasicASCII, originalModel.mightContainRTL());
        var output = renderViewLine(new RenderLineInput((config.fontInfo.isMonospace && !config.viewInfo.disableMonospaceOptimizations), config.fontInfo.canUseHalfwidthRightwardsArrow, lineContent, false, isBasicASCII, containsRTL, 0, lineTokens, actualDecorations, tabSize, config.fontInfo.spaceWidth, config.viewInfo.stopRenderingLineAfter, config.viewInfo.renderWhitespace, config.viewInfo.renderControlCharacters, config.viewInfo.fontLigatures), sb);
        sb.appendASCIIString('</div>');
        var absoluteOffsets = output.characterMapping.getAbsoluteOffsets();
        return absoluteOffsets.length > 0 ? absoluteOffsets[absoluteOffsets.length - 1] : 0;
    };
    return InlineViewZonesComputer;
}(ViewZonesComputer));
function isChangeOrInsert(lineChange) {
    return lineChange.modifiedEndLineNumber > 0;
}
function isChangeOrDelete(lineChange) {
    return lineChange.originalEndLineNumber > 0;
}
function createFakeLinesDiv() {
    var r = document.createElement('div');
    r.className = 'diagonal-fill';
    return r;
}
registerThemingParticipant(function (theme, collector) {
    var added = theme.getColor(diffInserted);
    if (added) {
        collector.addRule(".monaco-editor .line-insert, .monaco-editor .char-insert { background-color: " + added + "; }");
        collector.addRule(".monaco-diff-editor .line-insert, .monaco-diff-editor .char-insert { background-color: " + added + "; }");
        collector.addRule(".monaco-editor .inline-added-margin-view-zone { background-color: " + added + "; }");
    }
    var removed = theme.getColor(diffRemoved);
    if (removed) {
        collector.addRule(".monaco-editor .line-delete, .monaco-editor .char-delete { background-color: " + removed + "; }");
        collector.addRule(".monaco-diff-editor .line-delete, .monaco-diff-editor .char-delete { background-color: " + removed + "; }");
        collector.addRule(".monaco-editor .inline-deleted-margin-view-zone { background-color: " + removed + "; }");
    }
    var addedOutline = theme.getColor(diffInsertedOutline);
    if (addedOutline) {
        collector.addRule(".monaco-editor .line-insert, .monaco-editor .char-insert { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + addedOutline + "; }");
    }
    var removedOutline = theme.getColor(diffRemovedOutline);
    if (removedOutline) {
        collector.addRule(".monaco-editor .line-delete, .monaco-editor .char-delete { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + removedOutline + "; }");
    }
    var shadow = theme.getColor(scrollbarShadow);
    if (shadow) {
        collector.addRule(".monaco-diff-editor.side-by-side .editor.modified { box-shadow: -6px 0 5px -5px " + shadow + "; }");
    }
    var border = theme.getColor(diffBorder);
    if (border) {
        collector.addRule(".monaco-diff-editor.side-by-side .editor.modified { border-left: 1px solid " + border + "; }");
    }
});

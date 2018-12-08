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
import * as dom from '../../../base/browser/dom.js';
import { createFastDomNode } from '../../../base/browser/fastDomNode.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { PointerHandler } from '../controller/pointerHandler.js';
import { TextAreaHandler } from '../controller/textAreaHandler.js';
import { ViewController } from './viewController.js';
import { ContentViewOverlays, MarginViewOverlays } from './viewOverlays.js';
import { PartFingerprints } from './viewPart.js';
import { ViewContentWidgets } from '../viewParts/contentWidgets/contentWidgets.js';
import { CurrentLineHighlightOverlay } from '../viewParts/currentLineHighlight/currentLineHighlight.js';
import { CurrentLineMarginHighlightOverlay } from '../viewParts/currentLineMarginHighlight/currentLineMarginHighlight.js';
import { DecorationsOverlay } from '../viewParts/decorations/decorations.js';
import { EditorScrollbar } from '../viewParts/editorScrollbar/editorScrollbar.js';
import { GlyphMarginOverlay } from '../viewParts/glyphMargin/glyphMargin.js';
import { IndentGuidesOverlay } from '../viewParts/indentGuides/indentGuides.js';
import { LineNumbersOverlay } from '../viewParts/lineNumbers/lineNumbers.js';
import { ViewLines } from '../viewParts/lines/viewLines.js';
import { LinesDecorationsOverlay } from '../viewParts/linesDecorations/linesDecorations.js';
import { Margin } from '../viewParts/margin/margin.js';
import { MarginViewLineDecorationsOverlay } from '../viewParts/marginDecorations/marginDecorations.js';
import { Minimap } from '../viewParts/minimap/minimap.js';
import { ViewOverlayWidgets } from '../viewParts/overlayWidgets/overlayWidgets.js';
import { DecorationsOverviewRuler } from '../viewParts/overviewRuler/decorationsOverviewRuler.js';
import { OverviewRuler } from '../viewParts/overviewRuler/overviewRuler.js';
import { Rulers } from '../viewParts/rulers/rulers.js';
import { ScrollDecorationViewPart } from '../viewParts/scrollDecoration/scrollDecoration.js';
import { SelectionsOverlay } from '../viewParts/selections/selections.js';
import { ViewCursors } from '../viewParts/viewCursors/viewCursors.js';
import { ViewZones } from '../viewParts/viewZones/viewZones.js';
import { Position } from '../../common/core/position.js';
import { RenderingContext } from '../../common/view/renderingContext.js';
import { ViewContext } from '../../common/view/viewContext.js';
import { ViewEventDispatcher } from '../../common/view/viewEventDispatcher.js';
import * as viewEvents from '../../common/view/viewEvents.js';
import { ViewportData } from '../../common/viewLayout/viewLinesViewportData.js';
import { ViewEventHandler } from '../../common/viewModel/viewEventHandler.js';
import { getThemeTypeSelector } from '../../../platform/theme/common/themeService.js';
var invalidFunc = function () { throw new Error("Invalid change accessor"); };
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(commandDelegate, configuration, themeService, model, cursor, outgoingEvents) {
        var _this = _super.call(this) || this;
        _this._cursor = cursor;
        _this._renderAnimationFrame = null;
        _this.outgoingEvents = outgoingEvents;
        var viewController = new ViewController(configuration, model, _this.outgoingEvents, commandDelegate);
        // The event dispatcher will always go through _renderOnce before dispatching any events
        _this.eventDispatcher = new ViewEventDispatcher(function (callback) { return _this._renderOnce(callback); });
        // Ensure the view is the first event handler in order to update the layout
        _this.eventDispatcher.addEventHandler(_this);
        // The view context is passed on to most classes (basically to reduce param. counts in ctors)
        _this._context = new ViewContext(configuration, themeService.getTheme(), model, _this.eventDispatcher);
        _this._register(themeService.onThemeChange(function (theme) {
            _this._context.theme = theme;
            _this.eventDispatcher.emit(new viewEvents.ViewThemeChangedEvent());
            _this.render(true, false);
        }));
        _this.viewParts = [];
        // Keyboard handler
        _this._textAreaHandler = new TextAreaHandler(_this._context, viewController, _this.createTextAreaHandlerHelper());
        _this.viewParts.push(_this._textAreaHandler);
        _this.createViewParts();
        _this._setLayout();
        // Pointer handler
        _this.pointerHandler = new PointerHandler(_this._context, viewController, _this.createPointerHandlerHelper());
        _this._register(model.addEventListener(function (events) {
            _this.eventDispatcher.emitMany(events);
        }));
        _this._register(_this._cursor.addEventListener(function (events) {
            _this.eventDispatcher.emitMany(events);
        }));
        return _this;
    }
    View.prototype.createViewParts = function () {
        // These two dom nodes must be constructed up front, since references are needed in the layout provider (scrolling & co.)
        this.linesContent = createFastDomNode(document.createElement('div'));
        this.linesContent.setClassName('lines-content' + ' monaco-editor-background');
        this.linesContent.setPosition('absolute');
        this.domNode = createFastDomNode(document.createElement('div'));
        this.domNode.setClassName(this.getEditorClassName());
        this.overflowGuardContainer = createFastDomNode(document.createElement('div'));
        PartFingerprints.write(this.overflowGuardContainer, 3 /* OverflowGuard */);
        this.overflowGuardContainer.setClassName('overflow-guard');
        this._scrollbar = new EditorScrollbar(this._context, this.linesContent, this.domNode, this.overflowGuardContainer);
        this.viewParts.push(this._scrollbar);
        // View Lines
        this.viewLines = new ViewLines(this._context, this.linesContent);
        // View Zones
        this.viewZones = new ViewZones(this._context);
        this.viewParts.push(this.viewZones);
        // Decorations overview ruler
        var decorationsOverviewRuler = new DecorationsOverviewRuler(this._context);
        this.viewParts.push(decorationsOverviewRuler);
        var scrollDecoration = new ScrollDecorationViewPart(this._context);
        this.viewParts.push(scrollDecoration);
        var contentViewOverlays = new ContentViewOverlays(this._context);
        this.viewParts.push(contentViewOverlays);
        contentViewOverlays.addDynamicOverlay(new CurrentLineHighlightOverlay(this._context));
        contentViewOverlays.addDynamicOverlay(new SelectionsOverlay(this._context));
        contentViewOverlays.addDynamicOverlay(new IndentGuidesOverlay(this._context));
        contentViewOverlays.addDynamicOverlay(new DecorationsOverlay(this._context));
        var marginViewOverlays = new MarginViewOverlays(this._context);
        this.viewParts.push(marginViewOverlays);
        marginViewOverlays.addDynamicOverlay(new CurrentLineMarginHighlightOverlay(this._context));
        marginViewOverlays.addDynamicOverlay(new GlyphMarginOverlay(this._context));
        marginViewOverlays.addDynamicOverlay(new MarginViewLineDecorationsOverlay(this._context));
        marginViewOverlays.addDynamicOverlay(new LinesDecorationsOverlay(this._context));
        marginViewOverlays.addDynamicOverlay(new LineNumbersOverlay(this._context));
        var margin = new Margin(this._context);
        margin.getDomNode().appendChild(this.viewZones.marginDomNode);
        margin.getDomNode().appendChild(marginViewOverlays.getDomNode());
        this.viewParts.push(margin);
        // Content widgets
        this.contentWidgets = new ViewContentWidgets(this._context, this.domNode);
        this.viewParts.push(this.contentWidgets);
        this.viewCursors = new ViewCursors(this._context);
        this.viewParts.push(this.viewCursors);
        // Overlay widgets
        this.overlayWidgets = new ViewOverlayWidgets(this._context);
        this.viewParts.push(this.overlayWidgets);
        var rulers = new Rulers(this._context);
        this.viewParts.push(rulers);
        var minimap = new Minimap(this._context);
        this.viewParts.push(minimap);
        // -------------- Wire dom nodes up
        if (decorationsOverviewRuler) {
            var overviewRulerData = this._scrollbar.getOverviewRulerLayoutInfo();
            overviewRulerData.parent.insertBefore(decorationsOverviewRuler.getDomNode(), overviewRulerData.insertBefore);
        }
        this.linesContent.appendChild(contentViewOverlays.getDomNode());
        this.linesContent.appendChild(rulers.domNode);
        this.linesContent.appendChild(this.viewZones.domNode);
        this.linesContent.appendChild(this.viewLines.getDomNode());
        this.linesContent.appendChild(this.contentWidgets.domNode);
        this.linesContent.appendChild(this.viewCursors.getDomNode());
        this.overflowGuardContainer.appendChild(margin.getDomNode());
        this.overflowGuardContainer.appendChild(this._scrollbar.getDomNode());
        this.overflowGuardContainer.appendChild(scrollDecoration.getDomNode());
        this.overflowGuardContainer.appendChild(this._textAreaHandler.textArea);
        this.overflowGuardContainer.appendChild(this._textAreaHandler.textAreaCover);
        this.overflowGuardContainer.appendChild(this.overlayWidgets.getDomNode());
        this.overflowGuardContainer.appendChild(minimap.getDomNode());
        this.domNode.appendChild(this.overflowGuardContainer);
        this.domNode.appendChild(this.contentWidgets.overflowingContentWidgetsDomNode);
    };
    View.prototype._flushAccumulatedAndRenderNow = function () {
        this._renderNow();
    };
    View.prototype.createPointerHandlerHelper = function () {
        var _this = this;
        return {
            viewDomNode: this.domNode.domNode,
            linesContentDomNode: this.linesContent.domNode,
            focusTextArea: function () {
                _this.focus();
            },
            getLastViewCursorsRenderData: function () {
                return _this.viewCursors.getLastRenderData() || [];
            },
            shouldSuppressMouseDownOnViewZone: function (viewZoneId) {
                return _this.viewZones.shouldSuppressMouseDownOnViewZone(viewZoneId);
            },
            shouldSuppressMouseDownOnWidget: function (widgetId) {
                return _this.contentWidgets.shouldSuppressMouseDownOnWidget(widgetId);
            },
            getPositionFromDOMInfo: function (spanNode, offset) {
                _this._flushAccumulatedAndRenderNow();
                return _this.viewLines.getPositionFromDOMInfo(spanNode, offset);
            },
            visibleRangeForPosition2: function (lineNumber, column) {
                _this._flushAccumulatedAndRenderNow();
                return _this.viewLines.visibleRangeForPosition(new Position(lineNumber, column));
            },
            getLineWidth: function (lineNumber) {
                _this._flushAccumulatedAndRenderNow();
                return _this.viewLines.getLineWidth(lineNumber);
            }
        };
    };
    View.prototype.createTextAreaHandlerHelper = function () {
        var _this = this;
        return {
            visibleRangeForPositionRelativeToEditor: function (lineNumber, column) {
                _this._flushAccumulatedAndRenderNow();
                return _this.viewLines.visibleRangeForPosition(new Position(lineNumber, column));
            }
        };
    };
    View.prototype._setLayout = function () {
        var layoutInfo = this._context.configuration.editor.layoutInfo;
        this.domNode.setWidth(layoutInfo.width);
        this.domNode.setHeight(layoutInfo.height);
        this.overflowGuardContainer.setWidth(layoutInfo.width);
        this.overflowGuardContainer.setHeight(layoutInfo.height);
        this.linesContent.setWidth(1000000);
        this.linesContent.setHeight(1000000);
    };
    View.prototype.getEditorClassName = function () {
        var focused = this._textAreaHandler.isFocused() ? ' focused' : '';
        return this._context.configuration.editor.editorClassName + ' ' + getThemeTypeSelector(this._context.theme.type) + focused;
    };
    // --- begin event handlers
    View.prototype.onConfigurationChanged = function (e) {
        if (e.editorClassName) {
            this.domNode.setClassName(this.getEditorClassName());
        }
        if (e.layoutInfo) {
            this._setLayout();
        }
        return false;
    };
    View.prototype.onFocusChanged = function (e) {
        this.domNode.setClassName(this.getEditorClassName());
        this._context.model.setHasFocus(e.isFocused);
        if (e.isFocused) {
            this.outgoingEvents.emitViewFocusGained();
        }
        else {
            this.outgoingEvents.emitViewFocusLost();
        }
        return false;
    };
    View.prototype.onScrollChanged = function (e) {
        this.outgoingEvents.emitScrollChanged(e);
        return false;
    };
    View.prototype.onThemeChanged = function (e) {
        this.domNode.setClassName(this.getEditorClassName());
        return false;
    };
    // --- end event handlers
    View.prototype.dispose = function () {
        if (this._renderAnimationFrame !== null) {
            this._renderAnimationFrame.dispose();
            this._renderAnimationFrame = null;
        }
        this.eventDispatcher.removeEventHandler(this);
        this.outgoingEvents.dispose();
        this.pointerHandler.dispose();
        this.viewLines.dispose();
        // Destroy view parts
        for (var i = 0, len = this.viewParts.length; i < len; i++) {
            this.viewParts[i].dispose();
        }
        this.viewParts = [];
        _super.prototype.dispose.call(this);
    };
    View.prototype._renderOnce = function (callback) {
        var r = safeInvokeNoArg(callback);
        this._scheduleRender();
        return r;
    };
    View.prototype._scheduleRender = function () {
        if (this._renderAnimationFrame === null) {
            this._renderAnimationFrame = dom.runAtThisOrScheduleAtNextAnimationFrame(this._onRenderScheduled.bind(this), 100);
        }
    };
    View.prototype._onRenderScheduled = function () {
        this._renderAnimationFrame = null;
        this._flushAccumulatedAndRenderNow();
    };
    View.prototype._renderNow = function () {
        var _this = this;
        safeInvokeNoArg(function () { return _this._actualRender(); });
    };
    View.prototype._getViewPartsToRender = function () {
        var result = [], resultLen = 0;
        for (var i = 0, len = this.viewParts.length; i < len; i++) {
            var viewPart = this.viewParts[i];
            if (viewPart.shouldRender()) {
                result[resultLen++] = viewPart;
            }
        }
        return result;
    };
    View.prototype._actualRender = function () {
        if (!dom.isInDOM(this.domNode.domNode)) {
            return;
        }
        var viewPartsToRender = this._getViewPartsToRender();
        if (!this.viewLines.shouldRender() && viewPartsToRender.length === 0) {
            // Nothing to render
            return;
        }
        var partialViewportData = this._context.viewLayout.getLinesViewportData();
        this._context.model.setViewport(partialViewportData.startLineNumber, partialViewportData.endLineNumber, partialViewportData.centeredLineNumber);
        var viewportData = new ViewportData(this._cursor.getViewSelections(), partialViewportData, this._context.viewLayout.getWhitespaceViewportData(), this._context.model);
        if (this.contentWidgets.shouldRender()) {
            // Give the content widgets a chance to set their max width before a possible synchronous layout
            this.contentWidgets.onBeforeRender(viewportData);
        }
        if (this.viewLines.shouldRender()) {
            this.viewLines.renderText(viewportData);
            this.viewLines.onDidRender();
            // Rendering of viewLines might cause scroll events to occur, so collect view parts to render again
            viewPartsToRender = this._getViewPartsToRender();
        }
        var renderingContext = new RenderingContext(this._context.viewLayout, viewportData, this.viewLines);
        // Render the rest of the parts
        for (var i = 0, len = viewPartsToRender.length; i < len; i++) {
            var viewPart = viewPartsToRender[i];
            viewPart.prepareRender(renderingContext);
        }
        for (var i = 0, len = viewPartsToRender.length; i < len; i++) {
            var viewPart = viewPartsToRender[i];
            viewPart.render(renderingContext);
            viewPart.onDidRender();
        }
    };
    // --- BEGIN CodeEditor helpers
    View.prototype.delegateVerticalScrollbarMouseDown = function (browserEvent) {
        this._scrollbar.delegateVerticalScrollbarMouseDown(browserEvent);
    };
    View.prototype.restoreState = function (scrollPosition) {
        this._context.viewLayout.setScrollPositionNow({ scrollTop: scrollPosition.scrollTop });
        this._renderNow();
        this.viewLines.updateLineWidths();
        this._context.viewLayout.setScrollPositionNow({ scrollLeft: scrollPosition.scrollLeft });
    };
    View.prototype.getOffsetForColumn = function (modelLineNumber, modelColumn) {
        var modelPosition = this._context.model.validateModelPosition({
            lineNumber: modelLineNumber,
            column: modelColumn
        });
        var viewPosition = this._context.model.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);
        this._flushAccumulatedAndRenderNow();
        var visibleRange = this.viewLines.visibleRangeForPosition(new Position(viewPosition.lineNumber, viewPosition.column));
        if (!visibleRange) {
            return -1;
        }
        return visibleRange.left;
    };
    View.prototype.getTargetAtClientPoint = function (clientX, clientY) {
        return this.pointerHandler.getTargetAtClientPoint(clientX, clientY);
    };
    View.prototype.createOverviewRuler = function (cssClassName) {
        return new OverviewRuler(this._context, cssClassName);
    };
    View.prototype.change = function (callback) {
        var _this = this;
        var zonesHaveChanged = false;
        this._renderOnce(function () {
            var changeAccessor = {
                addZone: function (zone) {
                    zonesHaveChanged = true;
                    return _this.viewZones.addZone(zone);
                },
                removeZone: function (id) {
                    if (!id) {
                        return;
                    }
                    zonesHaveChanged = _this.viewZones.removeZone(id) || zonesHaveChanged;
                },
                layoutZone: function (id) {
                    if (!id) {
                        return;
                    }
                    zonesHaveChanged = _this.viewZones.layoutZone(id) || zonesHaveChanged;
                }
            };
            safeInvoke1Arg(callback, changeAccessor);
            // Invalidate changeAccessor
            changeAccessor.addZone = invalidFunc;
            changeAccessor.removeZone = invalidFunc;
            changeAccessor.layoutZone = invalidFunc;
            if (zonesHaveChanged) {
                _this._context.viewLayout.onHeightMaybeChanged();
                _this._context.privateViewEventBus.emit(new viewEvents.ViewZonesChangedEvent());
            }
        });
        return zonesHaveChanged;
    };
    View.prototype.render = function (now, everything) {
        if (everything) {
            // Force everything to render...
            this.viewLines.forceShouldRender();
            for (var i = 0, len = this.viewParts.length; i < len; i++) {
                var viewPart = this.viewParts[i];
                viewPart.forceShouldRender();
            }
        }
        if (now) {
            this._flushAccumulatedAndRenderNow();
        }
        else {
            this._scheduleRender();
        }
    };
    View.prototype.focus = function () {
        this._textAreaHandler.focusTextArea();
    };
    View.prototype.isFocused = function () {
        return this._textAreaHandler.isFocused();
    };
    View.prototype.addContentWidget = function (widgetData) {
        this.contentWidgets.addWidget(widgetData.widget);
        this.layoutContentWidget(widgetData);
        this._scheduleRender();
    };
    View.prototype.layoutContentWidget = function (widgetData) {
        var newPosition = widgetData.position ? widgetData.position.position : null;
        var newRange = widgetData.position ? widgetData.position.range : null;
        var newPreference = widgetData.position ? widgetData.position.preference : null;
        this.contentWidgets.setWidgetPosition(widgetData.widget, newPosition, newRange, newPreference);
        this._scheduleRender();
    };
    View.prototype.removeContentWidget = function (widgetData) {
        this.contentWidgets.removeWidget(widgetData.widget);
        this._scheduleRender();
    };
    View.prototype.addOverlayWidget = function (widgetData) {
        this.overlayWidgets.addWidget(widgetData.widget);
        this.layoutOverlayWidget(widgetData);
        this._scheduleRender();
    };
    View.prototype.layoutOverlayWidget = function (widgetData) {
        var newPreference = widgetData.position ? widgetData.position.preference : null;
        var shouldRender = this.overlayWidgets.setWidgetPosition(widgetData.widget, newPreference);
        if (shouldRender) {
            this._scheduleRender();
        }
    };
    View.prototype.removeOverlayWidget = function (widgetData) {
        this.overlayWidgets.removeWidget(widgetData.widget);
        this._scheduleRender();
    };
    return View;
}(ViewEventHandler));
export { View };
function safeInvokeNoArg(func) {
    try {
        return func();
    }
    catch (e) {
        onUnexpectedError(e);
    }
}
function safeInvoke1Arg(func, arg1) {
    try {
        return func(arg1);
    }
    catch (e) {
        onUnexpectedError(e);
    }
}

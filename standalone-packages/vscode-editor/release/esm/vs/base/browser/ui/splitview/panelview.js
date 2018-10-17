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
import './panelview.css';
import { dispose, combinedDisposable, Disposable } from '../../../common/lifecycle.js';
import { Emitter, chain } from '../../../common/event.js';
import { domEvent } from '../../event.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { $, append, addClass, removeClass, toggleClass, trackFocus, scheduleAtNextAnimationFrame } from '../../dom.js';
import { firstIndex } from '../../../common/arrays.js';
import { Color, RGBA } from '../../../common/color.js';
import { SplitView } from './splitview.js';
/**
 * A Panel is a structured SplitView view.
 *
 * WARNING: You must call `render()` after you contruct it.
 * It can't be done automatically at the end of the ctor
 * because of the order of property initialization in TypeScript.
 * Subclasses wouldn't be able to set own properties
 * before the `render()` call, thus forbiding their use.
 */
var Panel = /** @class */ (function () {
    function Panel(options) {
        if (options === void 0) { options = {}; }
        this.disposables = [];
        this.expandedSize = undefined;
        this._headerVisible = true;
        this.styles = {};
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._expanded = typeof options.expanded === 'undefined' ? true : !!options.expanded;
        this.ariaHeaderLabel = options.ariaHeaderLabel || '';
        this._minimumBodySize = typeof options.minimumBodySize === 'number' ? options.minimumBodySize : 120;
        this._maximumBodySize = typeof options.maximumBodySize === 'number' ? options.maximumBodySize : Number.POSITIVE_INFINITY;
        this.element = $('.panel');
    }
    Object.defineProperty(Panel.prototype, "draggableElement", {
        get: function () {
            return this.header;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "dropTargetElement", {
        get: function () {
            return this.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "dropBackground", {
        get: function () {
            return this._dropBackground;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "minimumBodySize", {
        get: function () {
            return this._minimumBodySize;
        },
        set: function (size) {
            this._minimumBodySize = size;
            this._onDidChange.fire();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "maximumBodySize", {
        get: function () {
            return this._maximumBodySize;
        },
        set: function (size) {
            this._maximumBodySize = size;
            this._onDidChange.fire();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "headerSize", {
        get: function () {
            return this.headerVisible ? Panel.HEADER_SIZE : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "minimumSize", {
        get: function () {
            var headerSize = this.headerSize;
            var expanded = !this.headerVisible || this.isExpanded();
            var minimumBodySize = expanded ? this._minimumBodySize : 0;
            return headerSize + minimumBodySize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "maximumSize", {
        get: function () {
            var headerSize = this.headerSize;
            var expanded = !this.headerVisible || this.isExpanded();
            var maximumBodySize = expanded ? this._maximumBodySize : 0;
            return headerSize + maximumBodySize;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype.isExpanded = function () {
        return this._expanded;
    };
    Panel.prototype.setExpanded = function (expanded) {
        if (this._expanded === !!expanded) {
            return;
        }
        this._expanded = !!expanded;
        this.updateHeader();
        this._onDidChange.fire(expanded ? this.expandedSize : undefined);
    };
    Object.defineProperty(Panel.prototype, "headerVisible", {
        get: function () {
            return this._headerVisible;
        },
        set: function (visible) {
            if (this._headerVisible === !!visible) {
                return;
            }
            this._headerVisible = !!visible;
            this.updateHeader();
            this._onDidChange.fire();
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype.render = function () {
        var _this = this;
        this.header = $('.panel-header');
        append(this.element, this.header);
        this.header.setAttribute('tabindex', '0');
        this.header.setAttribute('role', 'toolbar');
        this.header.setAttribute('aria-label', this.ariaHeaderLabel);
        this.renderHeader(this.header);
        var focusTracker = trackFocus(this.header);
        focusTracker.onDidFocus(function () { return addClass(_this.header, 'focused'); });
        focusTracker.onDidBlur(function () { return removeClass(_this.header, 'focused'); });
        this.updateHeader();
        var onHeaderKeyDown = chain(domEvent(this.header, 'keydown'))
            .map(function (e) { return new StandardKeyboardEvent(e); });
        onHeaderKeyDown.filter(function (e) { return e.keyCode === 3 /* Enter */ || e.keyCode === 10 /* Space */; })
            .event(function () { return _this.setExpanded(!_this.isExpanded()); }, null, this.disposables);
        onHeaderKeyDown.filter(function (e) { return e.keyCode === 15 /* LeftArrow */; })
            .event(function () { return _this.setExpanded(false); }, null, this.disposables);
        onHeaderKeyDown.filter(function (e) { return e.keyCode === 17 /* RightArrow */; })
            .event(function () { return _this.setExpanded(true); }, null, this.disposables);
        domEvent(this.header, 'click')(function () { return _this.setExpanded(!_this.isExpanded()); }, null, this.disposables);
        // TODO@Joao move this down to panelview
        // onHeaderKeyDown.filter(e => e.keyCode === KeyCode.UpArrow)
        // 	.event(focusPrevious, this, this.disposables);
        // onHeaderKeyDown.filter(e => e.keyCode === KeyCode.DownArrow)
        // 	.event(focusNext, this, this.disposables);
        var body = append(this.element, $('.panel-body'));
        this.renderBody(body);
    };
    Panel.prototype.layout = function (size) {
        var headerSize = this.headerVisible ? Panel.HEADER_SIZE : 0;
        this.layoutBody(size - headerSize);
        if (this.isExpanded()) {
            this.expandedSize = size;
        }
    };
    Panel.prototype.style = function (styles) {
        this.styles = styles;
        if (!this.header) {
            return;
        }
        this.updateHeader();
    };
    Panel.prototype.updateHeader = function () {
        var expanded = !this.headerVisible || this.isExpanded();
        this.header.style.height = this.headerSize + "px";
        this.header.style.lineHeight = this.headerSize + "px";
        toggleClass(this.header, 'hidden', !this.headerVisible);
        toggleClass(this.header, 'expanded', expanded);
        this.header.setAttribute('aria-expanded', String(expanded));
        this.header.style.color = this.styles.headerForeground ? this.styles.headerForeground.toString() : null;
        this.header.style.backgroundColor = this.styles.headerBackground ? this.styles.headerBackground.toString() : null;
        this.header.style.borderTop = this.styles.headerBorder ? "1px solid " + this.styles.headerBorder : null;
        this._dropBackground = this.styles.dropBackground;
    };
    Panel.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
        this._onDidChange.dispose();
    };
    Panel.HEADER_SIZE = 22;
    return Panel;
}());
export { Panel };
var PanelDraggable = /** @class */ (function (_super) {
    __extends(PanelDraggable, _super);
    function PanelDraggable(panel, dnd, context) {
        var _this = _super.call(this) || this;
        _this.panel = panel;
        _this.dnd = dnd;
        _this.context = context;
        _this.dragOverCounter = 0; // see https://github.com/Microsoft/vscode/issues/14470
        _this._onDidDrop = _this._register(new Emitter());
        _this.onDidDrop = _this._onDidDrop.event;
        panel.draggableElement.draggable = true;
        _this._register(domEvent(panel.draggableElement, 'dragstart')(_this.onDragStart, _this));
        _this._register(domEvent(panel.dropTargetElement, 'dragenter')(_this.onDragEnter, _this));
        _this._register(domEvent(panel.dropTargetElement, 'dragleave')(_this.onDragLeave, _this));
        _this._register(domEvent(panel.dropTargetElement, 'dragend')(_this.onDragEnd, _this));
        _this._register(domEvent(panel.dropTargetElement, 'drop')(_this.onDrop, _this));
        return _this;
    }
    PanelDraggable.prototype.onDragStart = function (e) {
        if (!this.dnd.canDrag(this.panel)) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        e.dataTransfer.effectAllowed = 'move';
        var dragImage = append(document.body, $('.monaco-panel-drag-image', {}, this.panel.draggableElement.textContent));
        e.dataTransfer.setDragImage(dragImage, -10, -10);
        setTimeout(function () { return document.body.removeChild(dragImage); }, 0);
        this.context.draggable = this;
    };
    PanelDraggable.prototype.onDragEnter = function (e) {
        if (!this.context.draggable || this.context.draggable === this) {
            return;
        }
        if (!this.dnd.canDrop(this.context.draggable.panel, this.panel)) {
            return;
        }
        this.dragOverCounter++;
        this.render();
    };
    PanelDraggable.prototype.onDragLeave = function (e) {
        if (!this.context.draggable || this.context.draggable === this) {
            return;
        }
        if (!this.dnd.canDrop(this.context.draggable.panel, this.panel)) {
            return;
        }
        this.dragOverCounter--;
        if (this.dragOverCounter === 0) {
            this.render();
        }
    };
    PanelDraggable.prototype.onDragEnd = function (e) {
        if (!this.context.draggable) {
            return;
        }
        this.dragOverCounter = 0;
        this.render();
        this.context.draggable = null;
    };
    PanelDraggable.prototype.onDrop = function (e) {
        if (!this.context.draggable) {
            return;
        }
        this.dragOverCounter = 0;
        this.render();
        if (this.dnd.canDrop(this.context.draggable.panel, this.panel) && this.context.draggable !== this) {
            this._onDidDrop.fire({ from: this.context.draggable.panel, to: this.panel });
        }
        this.context.draggable = null;
    };
    PanelDraggable.prototype.render = function () {
        var backgroundColor = null;
        if (this.dragOverCounter > 0) {
            backgroundColor = (this.panel.dropBackground || PanelDraggable.DefaultDragOverBackgroundColor).toString();
        }
        this.panel.dropTargetElement.style.backgroundColor = backgroundColor;
    };
    PanelDraggable.DefaultDragOverBackgroundColor = new Color(new RGBA(128, 128, 128, 0.5));
    return PanelDraggable;
}(Disposable));
var DefaultPanelDndController = /** @class */ (function () {
    function DefaultPanelDndController() {
    }
    DefaultPanelDndController.prototype.canDrag = function (panel) {
        return true;
    };
    DefaultPanelDndController.prototype.canDrop = function (panel, overPanel) {
        return true;
    };
    return DefaultPanelDndController;
}());
export { DefaultPanelDndController };
var PanelView = /** @class */ (function (_super) {
    __extends(PanelView, _super);
    function PanelView(container, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.dndContext = { draggable: null };
        _this.panelItems = [];
        _this.animationTimer = null;
        _this._onDidDrop = _this._register(new Emitter());
        _this.onDidDrop = _this._onDidDrop.event;
        _this.dnd = options.dnd;
        _this.el = append(container, $('.monaco-panel-view'));
        _this.splitview = _this._register(new SplitView(_this.el));
        _this.onDidSashChange = _this.splitview.onDidSashChange;
        return _this;
    }
    PanelView.prototype.addPanel = function (panel, size, index) {
        var _this = this;
        if (index === void 0) { index = this.splitview.length; }
        var disposables = [];
        disposables.push(
        // fix https://github.com/Microsoft/vscode/issues/37129 by delaying the listener
        // for changes to animate them. lots of views cause a onDidChange during their
        // initial creation and this causes the view to animate even though it shows
        // for the first time. animation should only be used to indicate new elements
        // are added or existing ones removed in a view that is already showing
        scheduleAtNextAnimationFrame(function () { return panel.onDidChange(_this.setupAnimation, _this, disposables); }));
        var panelItem = { panel: panel, disposable: combinedDisposable(disposables) };
        this.panelItems.splice(index, 0, panelItem);
        this.splitview.addView(panel, size, index);
        if (this.dnd) {
            var draggable = new PanelDraggable(panel, this.dnd, this.dndContext);
            disposables.push(draggable);
            draggable.onDidDrop(this._onDidDrop.fire, this._onDidDrop, disposables);
        }
    };
    PanelView.prototype.removePanel = function (panel) {
        var index = firstIndex(this.panelItems, function (item) { return item.panel === panel; });
        if (index === -1) {
            return;
        }
        this.splitview.removeView(index);
        var panelItem = this.panelItems.splice(index, 1)[0];
        panelItem.disposable.dispose();
    };
    PanelView.prototype.movePanel = function (from, to) {
        var fromIndex = firstIndex(this.panelItems, function (item) { return item.panel === from; });
        var toIndex = firstIndex(this.panelItems, function (item) { return item.panel === to; });
        if (fromIndex === -1 || toIndex === -1) {
            return;
        }
        var panelItem = this.panelItems.splice(fromIndex, 1)[0];
        this.panelItems.splice(toIndex, 0, panelItem);
        this.splitview.moveView(fromIndex, toIndex);
    };
    PanelView.prototype.resizePanel = function (panel, size) {
        var index = firstIndex(this.panelItems, function (item) { return item.panel === panel; });
        if (index === -1) {
            return;
        }
        this.splitview.resizeView(index, size);
    };
    PanelView.prototype.getPanelSize = function (panel) {
        var index = firstIndex(this.panelItems, function (item) { return item.panel === panel; });
        if (index === -1) {
            return -1;
        }
        return this.splitview.getViewSize(index);
    };
    PanelView.prototype.layout = function (size) {
        this.splitview.layout(size);
    };
    PanelView.prototype.setupAnimation = function () {
        var _this = this;
        if (typeof this.animationTimer === 'number') {
            window.clearTimeout(this.animationTimer);
        }
        addClass(this.el, 'animated');
        this.animationTimer = window.setTimeout(function () {
            _this.animationTimer = null;
            removeClass(_this.el, 'animated');
        }, 200);
    };
    PanelView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.panelItems.forEach(function (i) { return i.disposable.dispose(); });
    };
    return PanelView;
}(Disposable));
export { PanelView };

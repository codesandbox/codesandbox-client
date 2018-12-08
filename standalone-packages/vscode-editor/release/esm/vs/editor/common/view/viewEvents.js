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
import * as errors from '../../../base/common/errors.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
var ViewConfigurationChangedEvent = /** @class */ (function () {
    function ViewConfigurationChangedEvent(source) {
        this.type = 1 /* ViewConfigurationChanged */;
        this.canUseLayerHinting = source.canUseLayerHinting;
        this.pixelRatio = source.pixelRatio;
        this.editorClassName = source.editorClassName;
        this.lineHeight = source.lineHeight;
        this.readOnly = source.readOnly;
        this.accessibilitySupport = source.accessibilitySupport;
        this.emptySelectionClipboard = source.emptySelectionClipboard;
        this.copyWithSyntaxHighlighting = source.copyWithSyntaxHighlighting;
        this.layoutInfo = source.layoutInfo;
        this.fontInfo = source.fontInfo;
        this.viewInfo = source.viewInfo;
        this.wrappingInfo = source.wrappingInfo;
    }
    return ViewConfigurationChangedEvent;
}());
export { ViewConfigurationChangedEvent };
var ViewCursorStateChangedEvent = /** @class */ (function () {
    function ViewCursorStateChangedEvent(selections) {
        this.type = 2 /* ViewCursorStateChanged */;
        this.selections = selections;
    }
    return ViewCursorStateChangedEvent;
}());
export { ViewCursorStateChangedEvent };
var ViewDecorationsChangedEvent = /** @class */ (function () {
    function ViewDecorationsChangedEvent() {
        this.type = 3 /* ViewDecorationsChanged */;
        // Nothing to do
    }
    return ViewDecorationsChangedEvent;
}());
export { ViewDecorationsChangedEvent };
var ViewFlushedEvent = /** @class */ (function () {
    function ViewFlushedEvent() {
        this.type = 4 /* ViewFlushed */;
        // Nothing to do
    }
    return ViewFlushedEvent;
}());
export { ViewFlushedEvent };
var ViewFocusChangedEvent = /** @class */ (function () {
    function ViewFocusChangedEvent(isFocused) {
        this.type = 5 /* ViewFocusChanged */;
        this.isFocused = isFocused;
    }
    return ViewFocusChangedEvent;
}());
export { ViewFocusChangedEvent };
var ViewLineMappingChangedEvent = /** @class */ (function () {
    function ViewLineMappingChangedEvent() {
        this.type = 6 /* ViewLineMappingChanged */;
        // Nothing to do
    }
    return ViewLineMappingChangedEvent;
}());
export { ViewLineMappingChangedEvent };
var ViewLinesChangedEvent = /** @class */ (function () {
    function ViewLinesChangedEvent(fromLineNumber, toLineNumber) {
        this.type = 7 /* ViewLinesChanged */;
        this.fromLineNumber = fromLineNumber;
        this.toLineNumber = toLineNumber;
    }
    return ViewLinesChangedEvent;
}());
export { ViewLinesChangedEvent };
var ViewLinesDeletedEvent = /** @class */ (function () {
    function ViewLinesDeletedEvent(fromLineNumber, toLineNumber) {
        this.type = 8 /* ViewLinesDeleted */;
        this.fromLineNumber = fromLineNumber;
        this.toLineNumber = toLineNumber;
    }
    return ViewLinesDeletedEvent;
}());
export { ViewLinesDeletedEvent };
var ViewLinesInsertedEvent = /** @class */ (function () {
    function ViewLinesInsertedEvent(fromLineNumber, toLineNumber) {
        this.type = 9 /* ViewLinesInserted */;
        this.fromLineNumber = fromLineNumber;
        this.toLineNumber = toLineNumber;
    }
    return ViewLinesInsertedEvent;
}());
export { ViewLinesInsertedEvent };
var ViewRevealRangeRequestEvent = /** @class */ (function () {
    function ViewRevealRangeRequestEvent(range, verticalType, revealHorizontal, scrollType) {
        this.type = 10 /* ViewRevealRangeRequest */;
        this.range = range;
        this.verticalType = verticalType;
        this.revealHorizontal = revealHorizontal;
        this.scrollType = scrollType;
    }
    return ViewRevealRangeRequestEvent;
}());
export { ViewRevealRangeRequestEvent };
var ViewScrollChangedEvent = /** @class */ (function () {
    function ViewScrollChangedEvent(source) {
        this.type = 11 /* ViewScrollChanged */;
        this.scrollWidth = source.scrollWidth;
        this.scrollLeft = source.scrollLeft;
        this.scrollHeight = source.scrollHeight;
        this.scrollTop = source.scrollTop;
        this.scrollWidthChanged = source.scrollWidthChanged;
        this.scrollLeftChanged = source.scrollLeftChanged;
        this.scrollHeightChanged = source.scrollHeightChanged;
        this.scrollTopChanged = source.scrollTopChanged;
    }
    return ViewScrollChangedEvent;
}());
export { ViewScrollChangedEvent };
var ViewTokensChangedEvent = /** @class */ (function () {
    function ViewTokensChangedEvent(ranges) {
        this.type = 12 /* ViewTokensChanged */;
        this.ranges = ranges;
    }
    return ViewTokensChangedEvent;
}());
export { ViewTokensChangedEvent };
var ViewThemeChangedEvent = /** @class */ (function () {
    function ViewThemeChangedEvent() {
        this.type = 15 /* ViewThemeChanged */;
    }
    return ViewThemeChangedEvent;
}());
export { ViewThemeChangedEvent };
var ViewTokensColorsChangedEvent = /** @class */ (function () {
    function ViewTokensColorsChangedEvent() {
        this.type = 13 /* ViewTokensColorsChanged */;
        // Nothing to do
    }
    return ViewTokensColorsChangedEvent;
}());
export { ViewTokensColorsChangedEvent };
var ViewZonesChangedEvent = /** @class */ (function () {
    function ViewZonesChangedEvent() {
        this.type = 14 /* ViewZonesChanged */;
        // Nothing to do
    }
    return ViewZonesChangedEvent;
}());
export { ViewZonesChangedEvent };
var ViewLanguageConfigurationEvent = /** @class */ (function () {
    function ViewLanguageConfigurationEvent() {
        this.type = 16 /* ViewLanguageConfigurationChanged */;
    }
    return ViewLanguageConfigurationEvent;
}());
export { ViewLanguageConfigurationEvent };
var ViewEventEmitter = /** @class */ (function (_super) {
    __extends(ViewEventEmitter, _super);
    function ViewEventEmitter() {
        var _this = _super.call(this) || this;
        _this._listeners = [];
        _this._collector = null;
        _this._collectorCnt = 0;
        return _this;
    }
    ViewEventEmitter.prototype.dispose = function () {
        this._listeners = [];
        _super.prototype.dispose.call(this);
    };
    ViewEventEmitter.prototype._beginEmit = function () {
        this._collectorCnt++;
        if (this._collectorCnt === 1) {
            this._collector = new ViewEventsCollector();
        }
        return this._collector;
    };
    ViewEventEmitter.prototype._endEmit = function () {
        this._collectorCnt--;
        if (this._collectorCnt === 0) {
            var events = this._collector.finalize();
            this._collector = null;
            if (events.length > 0) {
                this._emit(events);
            }
        }
    };
    ViewEventEmitter.prototype._emit = function (events) {
        var listeners = this._listeners.slice(0);
        for (var i = 0, len = listeners.length; i < len; i++) {
            safeInvokeListener(listeners[i], events);
        }
    };
    ViewEventEmitter.prototype.addEventListener = function (listener) {
        var _this = this;
        this._listeners.push(listener);
        return toDisposable(function () {
            var listeners = _this._listeners;
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        });
    };
    return ViewEventEmitter;
}(Disposable));
export { ViewEventEmitter };
var ViewEventsCollector = /** @class */ (function () {
    function ViewEventsCollector() {
        this._eventsLen = 0;
        this._events = [];
        this._eventsLen = 0;
    }
    ViewEventsCollector.prototype.emit = function (event) {
        this._events[this._eventsLen++] = event;
    };
    ViewEventsCollector.prototype.finalize = function () {
        var result = this._events;
        this._events = [];
        return result;
    };
    return ViewEventsCollector;
}());
export { ViewEventsCollector };
function safeInvokeListener(listener, events) {
    try {
        listener(events);
    }
    catch (e) {
        errors.onUnexpectedError(e);
    }
}

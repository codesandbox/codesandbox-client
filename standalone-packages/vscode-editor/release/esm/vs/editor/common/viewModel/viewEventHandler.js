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
import { Disposable } from '../../../base/common/lifecycle.js';
var ViewEventHandler = /** @class */ (function (_super) {
    __extends(ViewEventHandler, _super);
    function ViewEventHandler() {
        var _this = _super.call(this) || this;
        _this._shouldRender = true;
        return _this;
    }
    ViewEventHandler.prototype.shouldRender = function () {
        return this._shouldRender;
    };
    ViewEventHandler.prototype.forceShouldRender = function () {
        this._shouldRender = true;
    };
    ViewEventHandler.prototype.setShouldRender = function () {
        this._shouldRender = true;
    };
    ViewEventHandler.prototype.onDidRender = function () {
        this._shouldRender = false;
    };
    // --- begin event handlers
    ViewEventHandler.prototype.onConfigurationChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onCursorStateChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onDecorationsChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onFlushed = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onFocusChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onLanguageConfigurationChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onLineMappingChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onLinesChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onLinesDeleted = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onLinesInserted = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onRevealRangeRequest = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onScrollChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onTokensChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onTokensColorsChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onZonesChanged = function (e) {
        return false;
    };
    ViewEventHandler.prototype.onThemeChanged = function (e) {
        return false;
    };
    // --- end event handlers
    ViewEventHandler.prototype.handleEvents = function (events) {
        var shouldRender = false;
        for (var i = 0, len = events.length; i < len; i++) {
            var e = events[i];
            switch (e.type) {
                case 1 /* ViewConfigurationChanged */:
                    if (this.onConfigurationChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 2 /* ViewCursorStateChanged */:
                    if (this.onCursorStateChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 3 /* ViewDecorationsChanged */:
                    if (this.onDecorationsChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 4 /* ViewFlushed */:
                    if (this.onFlushed(e)) {
                        shouldRender = true;
                    }
                    break;
                case 5 /* ViewFocusChanged */:
                    if (this.onFocusChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 16 /* ViewLanguageConfigurationChanged */:
                    if (this.onLanguageConfigurationChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 6 /* ViewLineMappingChanged */:
                    if (this.onLineMappingChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 7 /* ViewLinesChanged */:
                    if (this.onLinesChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 8 /* ViewLinesDeleted */:
                    if (this.onLinesDeleted(e)) {
                        shouldRender = true;
                    }
                    break;
                case 9 /* ViewLinesInserted */:
                    if (this.onLinesInserted(e)) {
                        shouldRender = true;
                    }
                    break;
                case 10 /* ViewRevealRangeRequest */:
                    if (this.onRevealRangeRequest(e)) {
                        shouldRender = true;
                    }
                    break;
                case 11 /* ViewScrollChanged */:
                    if (this.onScrollChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 12 /* ViewTokensChanged */:
                    if (this.onTokensChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 13 /* ViewTokensColorsChanged */:
                    if (this.onTokensColorsChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 14 /* ViewZonesChanged */:
                    if (this.onZonesChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                case 15 /* ViewThemeChanged */:
                    if (this.onThemeChanged(e)) {
                        shouldRender = true;
                    }
                    break;
                default:
                    console.info('View received unknown event: ');
                    console.info(e);
            }
        }
        if (shouldRender) {
            this._shouldRender = true;
        }
    };
    return ViewEventHandler;
}(Disposable));
export { ViewEventHandler };

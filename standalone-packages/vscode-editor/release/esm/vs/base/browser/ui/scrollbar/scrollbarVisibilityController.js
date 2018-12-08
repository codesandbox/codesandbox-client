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
import { TimeoutTimer } from '../../../common/async.js';
import { Disposable } from '../../../common/lifecycle.js';
var ScrollbarVisibilityController = /** @class */ (function (_super) {
    __extends(ScrollbarVisibilityController, _super);
    function ScrollbarVisibilityController(visibility, visibleClassName, invisibleClassName) {
        var _this = _super.call(this) || this;
        _this._visibility = visibility;
        _this._visibleClassName = visibleClassName;
        _this._invisibleClassName = invisibleClassName;
        _this._domNode = null;
        _this._isVisible = false;
        _this._isNeeded = false;
        _this._shouldBeVisible = false;
        _this._revealTimer = _this._register(new TimeoutTimer());
        return _this;
    }
    // ----------------- Hide / Reveal
    ScrollbarVisibilityController.prototype.applyVisibilitySetting = function (shouldBeVisible) {
        if (this._visibility === 2 /* Hidden */) {
            return false;
        }
        if (this._visibility === 3 /* Visible */) {
            return true;
        }
        return shouldBeVisible;
    };
    ScrollbarVisibilityController.prototype.setShouldBeVisible = function (rawShouldBeVisible) {
        var shouldBeVisible = this.applyVisibilitySetting(rawShouldBeVisible);
        if (this._shouldBeVisible !== shouldBeVisible) {
            this._shouldBeVisible = shouldBeVisible;
            this.ensureVisibility();
        }
    };
    ScrollbarVisibilityController.prototype.setIsNeeded = function (isNeeded) {
        if (this._isNeeded !== isNeeded) {
            this._isNeeded = isNeeded;
            this.ensureVisibility();
        }
    };
    ScrollbarVisibilityController.prototype.setDomNode = function (domNode) {
        this._domNode = domNode;
        this._domNode.setClassName(this._invisibleClassName);
        // Now that the flags & the dom node are in a consistent state, ensure the Hidden/Visible configuration
        this.setShouldBeVisible(false);
    };
    ScrollbarVisibilityController.prototype.ensureVisibility = function () {
        if (!this._isNeeded) {
            // Nothing to be rendered
            this._hide(false);
            return;
        }
        if (this._shouldBeVisible) {
            this._reveal();
        }
        else {
            this._hide(true);
        }
    };
    ScrollbarVisibilityController.prototype._reveal = function () {
        var _this = this;
        if (this._isVisible) {
            return;
        }
        this._isVisible = true;
        // The CSS animation doesn't play otherwise
        this._revealTimer.setIfNotSet(function () {
            if (_this._domNode) {
                _this._domNode.setClassName(_this._visibleClassName);
            }
        }, 0);
    };
    ScrollbarVisibilityController.prototype._hide = function (withFadeAway) {
        this._revealTimer.cancel();
        if (!this._isVisible) {
            return;
        }
        this._isVisible = false;
        if (this._domNode) {
            this._domNode.setClassName(this._invisibleClassName + (withFadeAway ? ' fade' : ''));
        }
    };
    return ScrollbarVisibilityController;
}(Disposable));
export { ScrollbarVisibilityController };

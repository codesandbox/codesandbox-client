/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { StatusBarAlignment as ExtHostStatusBarAlignment, Disposable } from './extHostTypes.js';
import { MainContext } from './extHost.protocol.js';
var ExtHostStatusBarEntry = /** @class */ (function () {
    function ExtHostStatusBarEntry(proxy, extensionId, alignment, priority) {
        if (alignment === void 0) { alignment = ExtHostStatusBarAlignment.Left; }
        this._id = ExtHostStatusBarEntry.ID_GEN++;
        this._proxy = proxy;
        this._alignment = alignment;
        this._priority = priority;
        this._extensionId = extensionId;
    }
    Object.defineProperty(ExtHostStatusBarEntry.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostStatusBarEntry.prototype, "alignment", {
        get: function () {
            return this._alignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostStatusBarEntry.prototype, "priority", {
        get: function () {
            return this._priority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostStatusBarEntry.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (text) {
            this._text = text;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostStatusBarEntry.prototype, "tooltip", {
        get: function () {
            return this._tooltip;
        },
        set: function (tooltip) {
            this._tooltip = tooltip;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostStatusBarEntry.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (color) {
            this._color = color;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostStatusBarEntry.prototype, "command", {
        get: function () {
            return this._command;
        },
        set: function (command) {
            this._command = command;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    ExtHostStatusBarEntry.prototype.show = function () {
        this._visible = true;
        this.update();
    };
    ExtHostStatusBarEntry.prototype.hide = function () {
        clearTimeout(this._timeoutHandle);
        this._visible = false;
        this._proxy.$dispose(this.id);
    };
    ExtHostStatusBarEntry.prototype.update = function () {
        var _this = this;
        if (this._disposed || !this._visible) {
            return;
        }
        clearTimeout(this._timeoutHandle);
        // Defer the update so that multiple changes to setters dont cause a redraw each
        this._timeoutHandle = setTimeout(function () {
            _this._timeoutHandle = undefined;
            // Set to status bar
            _this._proxy.$setEntry(_this.id, _this._extensionId, _this.text, _this.tooltip, _this.command, _this.color, _this._alignment === ExtHostStatusBarAlignment.Left ? 0 /* LEFT */ : 1 /* RIGHT */, _this._priority);
        }, 0);
    };
    ExtHostStatusBarEntry.prototype.dispose = function () {
        this.hide();
        this._disposed = true;
    };
    ExtHostStatusBarEntry.ID_GEN = 0;
    return ExtHostStatusBarEntry;
}());
export { ExtHostStatusBarEntry };
var StatusBarMessage = /** @class */ (function () {
    function StatusBarMessage(statusBar) {
        this._messages = [];
        this._item = statusBar.createStatusBarEntry(void 0, ExtHostStatusBarAlignment.Left, Number.MIN_VALUE);
    }
    StatusBarMessage.prototype.dispose = function () {
        this._messages.length = 0;
        this._item.dispose();
    };
    StatusBarMessage.prototype.setMessage = function (message) {
        var _this = this;
        var data = { message: message }; // use object to not confuse equal strings
        this._messages.unshift(data);
        this._update();
        return new Disposable(function () {
            var idx = _this._messages.indexOf(data);
            if (idx >= 0) {
                _this._messages.splice(idx, 1);
                _this._update();
            }
        });
    };
    StatusBarMessage.prototype._update = function () {
        if (this._messages.length > 0) {
            this._item.text = this._messages[0].message;
            this._item.show();
        }
        else {
            this._item.hide();
        }
    };
    return StatusBarMessage;
}());
var ExtHostStatusBar = /** @class */ (function () {
    function ExtHostStatusBar(mainContext) {
        this._proxy = mainContext.getProxy(MainContext.MainThreadStatusBar);
        this._statusMessage = new StatusBarMessage(this);
    }
    ExtHostStatusBar.prototype.createStatusBarEntry = function (extensionId, alignment, priority) {
        return new ExtHostStatusBarEntry(this._proxy, extensionId, alignment, priority);
    };
    ExtHostStatusBar.prototype.setStatusBarMessage = function (text, timeoutOrThenable) {
        var d = this._statusMessage.setMessage(text);
        var handle;
        if (typeof timeoutOrThenable === 'number') {
            handle = setTimeout(function () { return d.dispose(); }, timeoutOrThenable);
        }
        else if (typeof timeoutOrThenable !== 'undefined') {
            timeoutOrThenable.then(function () { return d.dispose(); }, function () { return d.dispose(); });
        }
        return new Disposable(function () {
            d.dispose();
            clearTimeout(handle);
        });
    };
    return ExtHostStatusBar;
}());
export { ExtHostStatusBar };

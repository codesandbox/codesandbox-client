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
import { combinedDisposable, Disposable } from './lifecycle';
import { Emitter } from './event';
var Action = /** @class */ (function () {
    function Action(id, label, cssClass, enabled, actionCallback) {
        if (label === void 0) { label = ''; }
        if (cssClass === void 0) { cssClass = ''; }
        if (enabled === void 0) { enabled = true; }
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._id = id;
        this._label = label;
        this._cssClass = cssClass;
        this._enabled = enabled;
        this._actionCallback = actionCallback;
    }
    Object.defineProperty(Action.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (value) {
            this._setLabel(value);
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype._setLabel = function (value) {
        if (this._label !== value) {
            this._label = value;
            this._onDidChange.fire({ label: value });
        }
    };
    Object.defineProperty(Action.prototype, "tooltip", {
        get: function () {
            return this._tooltip;
        },
        set: function (value) {
            this._setTooltip(value);
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype._setTooltip = function (value) {
        if (this._tooltip !== value) {
            this._tooltip = value;
            this._onDidChange.fire({ tooltip: value });
        }
    };
    Object.defineProperty(Action.prototype, "class", {
        get: function () {
            return this._cssClass;
        },
        set: function (value) {
            this._setClass(value);
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype._setClass = function (value) {
        if (this._cssClass !== value) {
            this._cssClass = value;
            this._onDidChange.fire({ class: value });
        }
    };
    Object.defineProperty(Action.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._setEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype._setEnabled = function (value) {
        if (this._enabled !== value) {
            this._enabled = value;
            this._onDidChange.fire({ enabled: value });
        }
    };
    Object.defineProperty(Action.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (value) {
            this._setChecked(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "radio", {
        get: function () {
            return this._radio;
        },
        set: function (value) {
            this._setRadio(value);
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype._setChecked = function (value) {
        if (this._checked !== value) {
            this._checked = value;
            this._onDidChange.fire({ checked: value });
        }
    };
    Action.prototype._setRadio = function (value) {
        if (this._radio !== value) {
            this._radio = value;
            this._onDidChange.fire({ radio: value });
        }
    };
    Action.prototype.run = function (event, data) {
        if (this._actionCallback !== void 0) {
            return this._actionCallback(event);
        }
        return Promise.resolve(true);
    };
    Action.prototype.dispose = function () {
        this._onDidChange.dispose();
    };
    return Action;
}());
export { Action };
var ActionRunner = /** @class */ (function (_super) {
    __extends(ActionRunner, _super);
    function ActionRunner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onDidBeforeRun = _this._register(new Emitter());
        _this.onDidBeforeRun = _this._onDidBeforeRun.event;
        _this._onDidRun = _this._register(new Emitter());
        _this.onDidRun = _this._onDidRun.event;
        return _this;
    }
    ActionRunner.prototype.run = function (action, context) {
        var _this = this;
        if (!action.enabled) {
            return Promise.resolve(null);
        }
        this._onDidBeforeRun.fire({ action: action });
        return this.runAction(action, context).then(function (result) {
            _this._onDidRun.fire({ action: action, result: result });
        }, function (error) {
            _this._onDidRun.fire({ action: action, error: error });
        });
    };
    ActionRunner.prototype.runAction = function (action, context) {
        var res = context ? action.run(context) : action.run();
        return Promise.resolve(res);
    };
    return ActionRunner;
}(Disposable));
export { ActionRunner };
var RadioGroup = /** @class */ (function (_super) {
    __extends(RadioGroup, _super);
    function RadioGroup(actions) {
        var _this = _super.call(this) || this;
        _this.actions = actions;
        _this._register(combinedDisposable(actions.map(function (action) {
            return action.onDidChange(function (e) {
                if (e.checked && action.checked) {
                    for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                        var candidate = actions_1[_i];
                        if (candidate !== action) {
                            candidate.checked = false;
                        }
                    }
                }
            });
        })));
        return _this;
    }
    return RadioGroup;
}(Disposable));
export { RadioGroup };

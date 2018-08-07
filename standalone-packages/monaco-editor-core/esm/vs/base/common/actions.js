/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from './winjs.base';
import { combinedDisposable } from './lifecycle';
import { Emitter } from './event';
var Action = /** @class */ (function () {
    function Action(id, label, cssClass, enabled, actionCallback) {
        if (label === void 0) { label = ''; }
        if (cssClass === void 0) { cssClass = ''; }
        if (enabled === void 0) { enabled = true; }
        this._onDidChange = new Emitter();
        this._id = id;
        this._label = label;
        this._cssClass = cssClass;
        this._enabled = enabled;
        this._actionCallback = actionCallback;
    }
    Action.prototype.dispose = function () {
        this._onDidChange.dispose();
    };
    Object.defineProperty(Action.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(Action.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (value) {
            this._order = value;
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.run = function (event, data) {
        if (this._actionCallback !== void 0) {
            return this._actionCallback(event);
        }
        return TPromise.as(true);
    };
    return Action;
}());
export { Action };
var ActionRunner = /** @class */ (function () {
    function ActionRunner() {
        this._onDidBeforeRun = new Emitter();
        this._onDidRun = new Emitter();
    }
    Object.defineProperty(ActionRunner.prototype, "onDidRun", {
        get: function () {
            return this._onDidRun.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionRunner.prototype, "onDidBeforeRun", {
        get: function () {
            return this._onDidBeforeRun.event;
        },
        enumerable: true,
        configurable: true
    });
    ActionRunner.prototype.run = function (action, context) {
        var _this = this;
        if (!action.enabled) {
            return TPromise.as(null);
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
        if (TPromise.is(res)) {
            return res;
        }
        return TPromise.wrap(res);
    };
    ActionRunner.prototype.dispose = function () {
        this._onDidBeforeRun.dispose();
        this._onDidRun.dispose();
    };
    return ActionRunner;
}());
export { ActionRunner };
var RadioGroup = /** @class */ (function () {
    function RadioGroup(actions) {
        this.actions = actions;
        this._disposable = combinedDisposable(actions.map(function (action) {
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
        }));
    }
    RadioGroup.prototype.dispose = function () {
        this._disposable.dispose();
    };
    return RadioGroup;
}());
export { RadioGroup };

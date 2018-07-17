/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { dispose } from '../../../base/common/lifecycle';
import { CommandsRegistry } from '../../commands/common/commands';
import { KeybindingResolver } from '../../keybinding/common/keybindingResolver';
import { IContextKeyService, SET_CONTEXT_COMMAND_ID } from '../common/contextkey';
import { IConfigurationService, ConfigurationTarget } from '../../configuration/common/configuration';
import { Emitter, debounceEvent } from '../../../base/common/event';
var KEYBINDING_CONTEXT_ATTR = 'data-keybinding-context';
var Context = /** @class */ (function () {
    function Context(id, parent) {
        this._id = id;
        this._parent = parent;
        this._value = Object.create(null);
        this._value['_contextId'] = id;
    }
    Context.prototype.setValue = function (key, value) {
        // console.log('SET ' + key + ' = ' + value + ' ON ' + this._id);
        if (this._value[key] !== value) {
            this._value[key] = value;
            return true;
        }
        return false;
    };
    Context.prototype.removeValue = function (key) {
        // console.log('REMOVE ' + key + ' FROM ' + this._id);
        if (key in this._value) {
            delete this._value[key];
            return true;
        }
        return false;
    };
    Context.prototype.getValue = function (key) {
        var ret = this._value[key];
        if (typeof ret === 'undefined' && this._parent) {
            return this._parent.getValue(key);
        }
        return ret;
    };
    Context.prototype.collectAllValues = function () {
        var result = this._parent ? this._parent.collectAllValues() : Object.create(null);
        result = __assign({}, result, this._value);
        delete result['_contextId'];
        return result;
    };
    return Context;
}());
export { Context };
var ConfigAwareContextValuesContainer = /** @class */ (function (_super) {
    __extends(ConfigAwareContextValuesContainer, _super);
    function ConfigAwareContextValuesContainer(id, configurationService, emitter) {
        var _this = _super.call(this, id, null) || this;
        _this._emitter = emitter;
        _this._configurationService = configurationService;
        _this._subscription = configurationService.onDidChangeConfiguration(_this._onConfigurationUpdated, _this);
        _this._initFromConfiguration();
        return _this;
    }
    ConfigAwareContextValuesContainer.prototype.dispose = function () {
        this._subscription.dispose();
    };
    ConfigAwareContextValuesContainer.prototype._onConfigurationUpdated = function (event) {
        if (event.source === ConfigurationTarget.DEFAULT) {
            // new setting, rebuild everything
            this._initFromConfiguration();
        }
        else {
            // update those that we know
            for (var _i = 0, _a = event.affectedKeys; _i < _a.length; _i++) {
                var configKey = _a[_i];
                var contextKey = "config." + configKey;
                if (contextKey in this._value) {
                    this._value[contextKey] = this._configurationService.getValue(configKey);
                    this._emitter.fire(contextKey);
                }
            }
        }
    };
    ConfigAwareContextValuesContainer.prototype._initFromConfiguration = function () {
        var _this = this;
        var prefix = 'config.';
        var config = this._configurationService.getValue();
        var configKeys = Object.create(null);
        var configKeysChanged = [];
        // add new value from config
        var walk = function (obj, keys) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    keys.push(key);
                    var value = obj[key];
                    if (typeof value === 'boolean') {
                        var configKey = keys.join('.');
                        var oldValue = _this._value[configKey];
                        _this._value[configKey] = value;
                        if (oldValue !== value) {
                            configKeysChanged.push(configKey);
                            configKeys[configKey] = true;
                        }
                        else {
                            configKeys[configKey] = false;
                        }
                    }
                    else if (typeof value === 'object') {
                        walk(value, keys);
                    }
                    keys.pop();
                }
            }
        };
        walk(config, ['config']);
        // remove unused keys
        for (var key in this._value) {
            if (key.indexOf(prefix) === 0 && configKeys[key] === undefined) {
                delete this._value[key];
                configKeys[key] = true;
                configKeysChanged.push(key);
            }
        }
        // send events
        this._emitter.fire(configKeysChanged);
    };
    return ConfigAwareContextValuesContainer;
}(Context));
var ContextKey = /** @class */ (function () {
    function ContextKey(parent, key, defaultValue) {
        this._parent = parent;
        this._key = key;
        this._defaultValue = defaultValue;
        this.reset();
    }
    ContextKey.prototype.set = function (value) {
        this._parent.setContext(this._key, value);
    };
    ContextKey.prototype.reset = function () {
        if (typeof this._defaultValue === 'undefined') {
            this._parent.removeContext(this._key);
        }
        else {
            this._parent.setContext(this._key, this._defaultValue);
        }
    };
    ContextKey.prototype.get = function () {
        return this._parent.getContextKeyValue(this._key);
    };
    return ContextKey;
}());
var ContextKeyChangeEvent = /** @class */ (function () {
    function ContextKeyChangeEvent() {
        this._keys = [];
    }
    ContextKeyChangeEvent.prototype.collect = function (oneOrManyKeys) {
        this._keys = this._keys.concat(oneOrManyKeys);
    };
    ContextKeyChangeEvent.prototype.affectsSome = function (keys) {
        for (var _i = 0, _a = this._keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (keys.has(key)) {
                return true;
            }
        }
        return false;
    };
    return ContextKeyChangeEvent;
}());
export { ContextKeyChangeEvent };
var AbstractContextKeyService = /** @class */ (function () {
    function AbstractContextKeyService(myContextId) {
        this._myContextId = myContextId;
        this._onDidChangeContextKey = new Emitter();
    }
    AbstractContextKeyService.prototype.createKey = function (key, defaultValue) {
        return new ContextKey(this, key, defaultValue);
    };
    Object.defineProperty(AbstractContextKeyService.prototype, "onDidChangeContext", {
        get: function () {
            if (!this._onDidChangeContext) {
                this._onDidChangeContext = debounceEvent(this._onDidChangeContextKey.event, function (prev, cur) {
                    if (!prev) {
                        prev = new ContextKeyChangeEvent();
                    }
                    prev.collect(cur);
                    return prev;
                }, 25);
            }
            return this._onDidChangeContext;
        },
        enumerable: true,
        configurable: true
    });
    AbstractContextKeyService.prototype.createScoped = function (domNode) {
        return new ScopedContextKeyService(this, this._onDidChangeContextKey, domNode);
    };
    AbstractContextKeyService.prototype.contextMatchesRules = function (rules) {
        var context = this.getContextValuesContainer(this._myContextId);
        var result = KeybindingResolver.contextMatchesRules(context, rules);
        // console.group(rules.serialize() + ' -> ' + result);
        // rules.keys().forEach(key => { console.log(key, ctx[key]); });
        // console.groupEnd();
        return result;
    };
    AbstractContextKeyService.prototype.getContextKeyValue = function (key) {
        return this.getContextValuesContainer(this._myContextId).getValue(key);
    };
    AbstractContextKeyService.prototype.setContext = function (key, value) {
        var myContext = this.getContextValuesContainer(this._myContextId);
        if (!myContext) {
            return;
        }
        if (myContext.setValue(key, value)) {
            this._onDidChangeContextKey.fire(key);
        }
    };
    AbstractContextKeyService.prototype.removeContext = function (key) {
        if (this.getContextValuesContainer(this._myContextId).removeValue(key)) {
            this._onDidChangeContextKey.fire(key);
        }
    };
    AbstractContextKeyService.prototype.getContext = function (target) {
        return this.getContextValuesContainer(findContextAttr(target));
    };
    return AbstractContextKeyService;
}());
export { AbstractContextKeyService };
var ContextKeyService = /** @class */ (function (_super) {
    __extends(ContextKeyService, _super);
    function ContextKeyService(configurationService) {
        var _this = _super.call(this, 0) || this;
        _this._toDispose = [];
        _this._lastContextId = 0;
        _this._contexts = Object.create(null);
        var myContext = new ConfigAwareContextValuesContainer(_this._myContextId, configurationService, _this._onDidChangeContextKey);
        _this._contexts[String(_this._myContextId)] = myContext;
        _this._toDispose.push(myContext);
        return _this;
        // Uncomment this to see the contexts continuously logged
        // let lastLoggedValue: string = null;
        // setInterval(() => {
        // 	let values = Object.keys(this._contexts).map((key) => this._contexts[key]);
        // 	let logValue = values.map(v => JSON.stringify(v._value, null, '\t')).join('\n');
        // 	if (lastLoggedValue !== logValue) {
        // 		lastLoggedValue = logValue;
        // 		console.log(lastLoggedValue);
        // 	}
        // }, 2000);
    }
    ContextKeyService.prototype.dispose = function () {
        this._toDispose = dispose(this._toDispose);
    };
    ContextKeyService.prototype.getContextValuesContainer = function (contextId) {
        return this._contexts[String(contextId)];
    };
    ContextKeyService.prototype.createChildContext = function (parentContextId) {
        if (parentContextId === void 0) { parentContextId = this._myContextId; }
        var id = (++this._lastContextId);
        this._contexts[String(id)] = new Context(id, this.getContextValuesContainer(parentContextId));
        return id;
    };
    ContextKeyService.prototype.disposeContext = function (contextId) {
        delete this._contexts[String(contextId)];
    };
    ContextKeyService = __decorate([
        __param(0, IConfigurationService)
    ], ContextKeyService);
    return ContextKeyService;
}(AbstractContextKeyService));
export { ContextKeyService };
var ScopedContextKeyService = /** @class */ (function (_super) {
    __extends(ScopedContextKeyService, _super);
    function ScopedContextKeyService(parent, emitter, domNode) {
        var _this = _super.call(this, parent.createChildContext()) || this;
        _this._parent = parent;
        _this._onDidChangeContextKey = emitter;
        if (domNode) {
            _this._domNode = domNode;
            _this._domNode.setAttribute(KEYBINDING_CONTEXT_ATTR, String(_this._myContextId));
        }
        return _this;
    }
    ScopedContextKeyService.prototype.dispose = function () {
        this._parent.disposeContext(this._myContextId);
        if (this._domNode) {
            this._domNode.removeAttribute(KEYBINDING_CONTEXT_ATTR);
            this._domNode = undefined;
        }
    };
    Object.defineProperty(ScopedContextKeyService.prototype, "onDidChangeContext", {
        get: function () {
            return this._parent.onDidChangeContext;
        },
        enumerable: true,
        configurable: true
    });
    ScopedContextKeyService.prototype.getContextValuesContainer = function (contextId) {
        return this._parent.getContextValuesContainer(contextId);
    };
    ScopedContextKeyService.prototype.createChildContext = function (parentContextId) {
        if (parentContextId === void 0) { parentContextId = this._myContextId; }
        return this._parent.createChildContext(parentContextId);
    };
    ScopedContextKeyService.prototype.disposeContext = function (contextId) {
        this._parent.disposeContext(contextId);
    };
    return ScopedContextKeyService;
}(AbstractContextKeyService));
function findContextAttr(domNode) {
    while (domNode) {
        if (domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)) {
            return parseInt(domNode.getAttribute(KEYBINDING_CONTEXT_ATTR), 10);
        }
        domNode = domNode.parentElement;
    }
    return 0;
}
CommandsRegistry.registerCommand(SET_CONTEXT_COMMAND_ID, function (accessor, contextKey, contextValue) {
    accessor.get(IContextKeyService).createKey(String(contextKey), contextValue);
});

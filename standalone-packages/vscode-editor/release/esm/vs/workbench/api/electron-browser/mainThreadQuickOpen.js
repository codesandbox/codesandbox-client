/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import { IQuickInputService } from '../../../platform/quickinput/common/quickInput.js';
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { URI } from '../../../base/common/uri.js';
var MainThreadQuickOpen = /** @class */ (function () {
    function MainThreadQuickOpen(extHostContext, quickInputService) {
        this._items = {};
        // ---- QuickInput
        this.sessions = new Map();
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostQuickOpen);
        this._quickInputService = quickInputService;
    }
    MainThreadQuickOpen.prototype.dispose = function () {
    };
    MainThreadQuickOpen.prototype.$show = function (instance, options, token) {
        var _this = this;
        var contents = new Promise(function (resolve, reject) {
            _this._items[instance] = { resolve: resolve, reject: reject };
        });
        options = __assign({}, options, { onDidFocus: function (el) {
                if (el) {
                    _this._proxy.$onItemSelected(el.handle);
                }
            } });
        if (options.canPickMany) {
            return this._quickInputService.pick(contents, options, token).then(function (items) {
                if (items) {
                    return items.map(function (item) { return item.handle; });
                }
                return undefined;
            });
        }
        else {
            return this._quickInputService.pick(contents, options, token).then(function (item) {
                if (item) {
                    return item.handle;
                }
                return undefined;
            });
        }
    };
    MainThreadQuickOpen.prototype.$setItems = function (instance, items) {
        if (this._items[instance]) {
            this._items[instance].resolve(items);
            delete this._items[instance];
        }
        return undefined;
    };
    MainThreadQuickOpen.prototype.$setError = function (instance, error) {
        if (this._items[instance]) {
            this._items[instance].reject(error);
            delete this._items[instance];
        }
        return undefined;
    };
    // ---- input
    MainThreadQuickOpen.prototype.$input = function (options, validateInput, token) {
        var _this = this;
        var inputOptions = Object.create(null);
        if (options) {
            inputOptions.password = options.password;
            inputOptions.placeHolder = options.placeHolder;
            inputOptions.valueSelection = options.valueSelection;
            inputOptions.prompt = options.prompt;
            inputOptions.value = options.value;
            inputOptions.ignoreFocusLost = options.ignoreFocusOut;
        }
        if (validateInput) {
            inputOptions.validateInput = function (value) {
                return _this._proxy.$validateInput(value);
            };
        }
        return this._quickInputService.input(inputOptions, token);
    };
    MainThreadQuickOpen.prototype.$createOrUpdate = function (params) {
        var _this = this;
        var sessionId = params.id;
        var session = this.sessions.get(sessionId);
        if (!session) {
            if (params.type === 'quickPick') {
                var input_1 = this._quickInputService.createQuickPick();
                input_1.onDidAccept(function () {
                    _this._proxy.$onDidAccept(sessionId);
                });
                input_1.onDidChangeActive(function (items) {
                    _this._proxy.$onDidChangeActive(sessionId, items.map(function (item) { return item.handle; }));
                });
                input_1.onDidChangeSelection(function (items) {
                    _this._proxy.$onDidChangeSelection(sessionId, items.map(function (item) { return item.handle; }));
                });
                input_1.onDidTriggerButton(function (button) {
                    _this._proxy.$onDidTriggerButton(sessionId, button.handle);
                });
                input_1.onDidChangeValue(function (value) {
                    _this._proxy.$onDidChangeValue(sessionId, value);
                });
                input_1.onDidHide(function () {
                    _this._proxy.$onDidHide(sessionId);
                });
                session = {
                    input: input_1,
                    handlesToItems: new Map()
                };
            }
            else {
                var input_2 = this._quickInputService.createInputBox();
                input_2.onDidAccept(function () {
                    _this._proxy.$onDidAccept(sessionId);
                });
                input_2.onDidTriggerButton(function (button) {
                    _this._proxy.$onDidTriggerButton(sessionId, button.handle);
                });
                input_2.onDidChangeValue(function (value) {
                    _this._proxy.$onDidChangeValue(sessionId, value);
                });
                input_2.onDidHide(function () {
                    _this._proxy.$onDidHide(sessionId);
                });
                session = {
                    input: input_2,
                    handlesToItems: new Map()
                };
            }
            this.sessions.set(sessionId, session);
        }
        var input = session.input, handlesToItems = session.handlesToItems;
        for (var param in params) {
            if (param === 'id' || param === 'type') {
                continue;
            }
            if (param === 'visible') {
                if (params.visible) {
                    input.show();
                }
                else {
                    input.hide();
                }
            }
            else if (param === 'items') {
                handlesToItems.clear();
                params[param].forEach(function (item) {
                    handlesToItems.set(item.handle, item);
                });
                input[param] = params[param];
            }
            else if (param === 'activeItems' || param === 'selectedItems') {
                input[param] = params[param]
                    .filter(function (handle) { return handlesToItems.has(handle); })
                    .map(function (handle) { return handlesToItems.get(handle); });
            }
            else if (param === 'buttons') {
                input[param] = params.buttons.map(function (button) {
                    if (button.handle === -1) {
                        return _this._quickInputService.backButton;
                    }
                    var iconPath = button.iconPath, tooltip = button.tooltip, handle = button.handle;
                    return {
                        iconPath: {
                            dark: URI.revive(iconPath.dark),
                            light: iconPath.light && URI.revive(iconPath.light)
                        },
                        tooltip: tooltip,
                        handle: handle
                    };
                });
            }
            else {
                input[param] = params[param];
            }
        }
        return Promise.resolve(undefined);
    };
    MainThreadQuickOpen.prototype.$dispose = function (sessionId) {
        var session = this.sessions.get(sessionId);
        if (session) {
            session.input.dispose();
            this.sessions.delete(sessionId);
        }
        return Promise.resolve(undefined);
    };
    MainThreadQuickOpen = __decorate([
        extHostNamedCustomer(MainContext.MainThreadQuickOpen),
        __param(1, IQuickInputService)
    ], MainThreadQuickOpen);
    return MainThreadQuickOpen;
}());
export { MainThreadQuickOpen };

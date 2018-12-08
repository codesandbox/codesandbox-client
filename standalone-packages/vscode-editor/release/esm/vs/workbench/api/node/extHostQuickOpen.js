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
import { asThenable } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { MainContext } from './extHost.protocol.js';
import { URI } from '../../../base/common/uri.js';
import { ThemeIcon, QuickInputButtons } from './extHostTypes.js';
import { isPromiseCanceledError } from '../../../base/common/errors.js';
var ExtHostQuickOpen = /** @class */ (function () {
    function ExtHostQuickOpen(mainContext, workspace, commands) {
        this._sessions = new Map();
        this._instances = 0;
        this._proxy = mainContext.getProxy(MainContext.MainThreadQuickOpen);
        this._workspace = workspace;
        this._commands = commands;
    }
    ExtHostQuickOpen.prototype.showQuickPick = function (itemsOrItemsPromise, enableProposedApi, options, token) {
        var _this = this;
        if (token === void 0) { token = CancellationToken.None; }
        // clear state from last invocation
        this._onDidSelectItem = undefined;
        var itemsPromise = Promise.resolve(itemsOrItemsPromise);
        var instance = ++this._instances;
        var quickPickWidget = this._proxy.$show(instance, {
            placeHolder: options && options.placeHolder,
            matchOnDescription: options && options.matchOnDescription,
            matchOnDetail: options && options.matchOnDetail,
            ignoreFocusLost: options && options.ignoreFocusOut,
            canPickMany: options && options.canPickMany
        }, token);
        var widgetClosedMarker = {};
        var widgetClosedPromise = quickPickWidget.then(function () { return widgetClosedMarker; });
        return Promise.race([widgetClosedPromise, itemsPromise]).then(function (result) {
            if (result === widgetClosedMarker) {
                return undefined;
            }
            return itemsPromise.then(function (items) {
                var pickItems = [];
                for (var handle = 0; handle < items.length; handle++) {
                    var item = items[handle];
                    var label = void 0;
                    var description = void 0;
                    var detail = void 0;
                    var picked = void 0;
                    var alwaysShow = void 0;
                    if (typeof item === 'string') {
                        label = item;
                    }
                    else {
                        label = item.label;
                        description = item.description;
                        detail = item.detail;
                        picked = item.picked;
                        alwaysShow = item.alwaysShow;
                    }
                    pickItems.push({
                        label: label,
                        description: description,
                        handle: handle,
                        detail: detail,
                        picked: picked,
                        alwaysShow: alwaysShow
                    });
                }
                // handle selection changes
                if (options && typeof options.onDidSelectItem === 'function') {
                    _this._onDidSelectItem = function (handle) {
                        options.onDidSelectItem(items[handle]);
                    };
                }
                // show items
                _this._proxy.$setItems(instance, pickItems);
                return quickPickWidget.then(function (handle) {
                    if (typeof handle === 'number') {
                        return items[handle];
                    }
                    else if (Array.isArray(handle)) {
                        return handle.map(function (h) { return items[h]; });
                    }
                    return undefined;
                });
            });
        }).then(null, function (err) {
            if (isPromiseCanceledError(err)) {
                return undefined;
            }
            _this._proxy.$setError(instance, err);
            return Promise.reject(err);
        });
    };
    ExtHostQuickOpen.prototype.$onItemSelected = function (handle) {
        if (this._onDidSelectItem) {
            this._onDidSelectItem(handle);
        }
    };
    // ---- input
    ExtHostQuickOpen.prototype.showInput = function (options, token) {
        if (token === void 0) { token = CancellationToken.None; }
        // global validate fn used in callback below
        this._validateInput = options && options.validateInput;
        return this._proxy.$input(options, typeof this._validateInput === 'function', token)
            .then(null, function (err) {
            if (isPromiseCanceledError(err)) {
                return undefined;
            }
            return Promise.reject(err);
        });
    };
    ExtHostQuickOpen.prototype.$validateInput = function (input) {
        var _this = this;
        if (this._validateInput) {
            return asThenable(function () { return _this._validateInput(input); });
        }
        return undefined;
    };
    // ---- workspace folder picker
    ExtHostQuickOpen.prototype.showWorkspaceFolderPick = function (options, token) {
        var _this = this;
        if (token === void 0) { token = CancellationToken.None; }
        return this._commands.executeCommand('_workbench.pickWorkspaceFolder', [options]).then(function (selectedFolder) {
            if (!selectedFolder) {
                return undefined;
            }
            return _this._workspace.getWorkspaceFolders().filter(function (folder) { return folder.uri.toString() === selectedFolder.uri.toString(); })[0];
        });
    };
    // ---- QuickInput
    ExtHostQuickOpen.prototype.createQuickPick = function (extensionId, enableProposedApi) {
        var _this = this;
        var session = new ExtHostQuickPick(this._proxy, extensionId, enableProposedApi, function () { return _this._sessions.delete(session._id); });
        this._sessions.set(session._id, session);
        return session;
    };
    ExtHostQuickOpen.prototype.createInputBox = function (extensionId) {
        var _this = this;
        var session = new ExtHostInputBox(this._proxy, extensionId, function () { return _this._sessions.delete(session._id); });
        this._sessions.set(session._id, session);
        return session;
    };
    ExtHostQuickOpen.prototype.$onDidChangeValue = function (sessionId, value) {
        var session = this._sessions.get(sessionId);
        if (session) {
            session._fireDidChangeValue(value);
        }
    };
    ExtHostQuickOpen.prototype.$onDidAccept = function (sessionId) {
        var session = this._sessions.get(sessionId);
        if (session) {
            session._fireDidAccept();
        }
    };
    ExtHostQuickOpen.prototype.$onDidChangeActive = function (sessionId, handles) {
        var session = this._sessions.get(sessionId);
        if (session instanceof ExtHostQuickPick) {
            session._fireDidChangeActive(handles);
        }
    };
    ExtHostQuickOpen.prototype.$onDidChangeSelection = function (sessionId, handles) {
        var session = this._sessions.get(sessionId);
        if (session instanceof ExtHostQuickPick) {
            session._fireDidChangeSelection(handles);
        }
    };
    ExtHostQuickOpen.prototype.$onDidTriggerButton = function (sessionId, handle) {
        var session = this._sessions.get(sessionId);
        if (session) {
            session._fireDidTriggerButton(handle);
        }
    };
    ExtHostQuickOpen.prototype.$onDidHide = function (sessionId) {
        var session = this._sessions.get(sessionId);
        if (session) {
            session._fireDidHide();
        }
    };
    return ExtHostQuickOpen;
}());
export { ExtHostQuickOpen };
var ExtHostQuickInput = /** @class */ (function () {
    function ExtHostQuickInput(_proxy, _extensionId, _onDidDispose) {
        this._proxy = _proxy;
        this._extensionId = _extensionId;
        this._onDidDispose = _onDidDispose;
        this._id = ExtHostQuickPick._nextId++;
        this._visible = false;
        this._expectingHide = false;
        this._enabled = true;
        this._busy = false;
        this._ignoreFocusOut = true;
        this._value = '';
        this._buttons = [];
        this._handlesToButtons = new Map();
        this._onDidAcceptEmitter = new Emitter();
        this._onDidChangeValueEmitter = new Emitter();
        this._onDidTriggerButtonEmitter = new Emitter();
        this._onDidHideEmitter = new Emitter();
        this._pendingUpdate = { id: this._id };
        this._disposed = false;
        this._disposables = [
            this._onDidTriggerButtonEmitter,
            this._onDidHideEmitter,
            this._onDidAcceptEmitter,
            this._onDidChangeValueEmitter
        ];
        this.onDidChangeValue = this._onDidChangeValueEmitter.event;
        this.onDidAccept = this._onDidAcceptEmitter.event;
        this.onDidTriggerButton = this._onDidTriggerButtonEmitter.event;
        this.onDidHide = this._onDidHideEmitter.event;
    }
    Object.defineProperty(ExtHostQuickInput.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            this._title = title;
            this.update({ title: title });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "step", {
        get: function () {
            return this._steps;
        },
        set: function (step) {
            this._steps = step;
            this.update({ step: step });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "totalSteps", {
        get: function () {
            return this._totalSteps;
        },
        set: function (totalSteps) {
            this._totalSteps = totalSteps;
            this.update({ totalSteps: totalSteps });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (enabled) {
            this._enabled = enabled;
            this.update({ enabled: enabled });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "busy", {
        get: function () {
            return this._busy;
        },
        set: function (busy) {
            this._busy = busy;
            this.update({ busy: busy });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "ignoreFocusOut", {
        get: function () {
            return this._ignoreFocusOut;
        },
        set: function (ignoreFocusOut) {
            this._ignoreFocusOut = ignoreFocusOut;
            this.update({ ignoreFocusOut: ignoreFocusOut });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
            this.update({ value: value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "placeholder", {
        get: function () {
            return this._placeholder;
        },
        set: function (placeholder) {
            this._placeholder = placeholder;
            this.update({ placeholder: placeholder });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickInput.prototype, "buttons", {
        get: function () {
            return this._buttons;
        },
        set: function (buttons) {
            var _this = this;
            this._buttons = buttons.slice();
            this._handlesToButtons.clear();
            buttons.forEach(function (button, i) {
                var handle = button === QuickInputButtons.Back ? -1 : i;
                _this._handlesToButtons.set(handle, button);
            });
            this.update({
                buttons: buttons.map(function (button, i) { return ({
                    iconPath: getIconUris(button.iconPath),
                    tooltip: button.tooltip,
                    handle: button === QuickInputButtons.Back ? -1 : i,
                }); })
            });
        },
        enumerable: true,
        configurable: true
    });
    ExtHostQuickInput.prototype.show = function () {
        this._visible = true;
        this._expectingHide = true;
        this.update({ visible: true });
    };
    ExtHostQuickInput.prototype.hide = function () {
        this._visible = false;
        this.update({ visible: false });
    };
    ExtHostQuickInput.prototype._fireDidAccept = function () {
        this._onDidAcceptEmitter.fire();
    };
    ExtHostQuickInput.prototype._fireDidChangeValue = function (value) {
        this._value = value;
        this._onDidChangeValueEmitter.fire(value);
    };
    ExtHostQuickInput.prototype._fireDidTriggerButton = function (handle) {
        var button = this._handlesToButtons.get(handle);
        this._onDidTriggerButtonEmitter.fire(button);
    };
    ExtHostQuickInput.prototype._fireDidHide = function () {
        if (this._expectingHide) {
            this._expectingHide = false;
            this._onDidHideEmitter.fire();
        }
    };
    ExtHostQuickInput.prototype.dispose = function () {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        this._fireDidHide();
        this._disposables = dispose(this._disposables);
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = undefined;
        }
        this._onDidDispose();
        this._proxy.$dispose(this._id);
    };
    ExtHostQuickInput.prototype.update = function (properties) {
        var _this = this;
        if (this._disposed) {
            return;
        }
        for (var _i = 0, _a = Object.keys(properties); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = properties[key];
            this._pendingUpdate[key] = value === undefined ? null : value;
        }
        if ('visible' in this._pendingUpdate) {
            if (this._updateTimeout) {
                clearTimeout(this._updateTimeout);
                this._updateTimeout = undefined;
            }
            this.dispatchUpdate();
        }
        else if (this._visible && !this._updateTimeout) {
            // Defer the update so that multiple changes to setters dont cause a redraw each
            this._updateTimeout = setTimeout(function () {
                _this._updateTimeout = undefined;
                _this.dispatchUpdate();
            }, 0);
        }
    };
    ExtHostQuickInput.prototype.dispatchUpdate = function () {
        this._proxy.$createOrUpdate(this._pendingUpdate);
        this._pendingUpdate = { id: this._id };
    };
    ExtHostQuickInput._nextId = 1;
    return ExtHostQuickInput;
}());
function getIconUris(iconPath) {
    var light = getLightIconUri(iconPath);
    return { dark: getDarkIconUri(iconPath) || light, light: light };
}
function getLightIconUri(iconPath) {
    if (iconPath && !(iconPath instanceof ThemeIcon)) {
        if (typeof iconPath === 'string'
            || iconPath instanceof URI) {
            return getIconUri(iconPath);
        }
        return getIconUri(iconPath['light']);
    }
    return undefined;
}
function getDarkIconUri(iconPath) {
    if (iconPath && !(iconPath instanceof ThemeIcon) && iconPath['dark']) {
        return getIconUri(iconPath['dark']);
    }
    return undefined;
}
function getIconUri(iconPath) {
    if (iconPath instanceof URI) {
        return iconPath;
    }
    return URI.file(iconPath);
}
var ExtHostQuickPick = /** @class */ (function (_super) {
    __extends(ExtHostQuickPick, _super);
    function ExtHostQuickPick(proxy, extensionId, enableProposedApi, onDispose) {
        var _this = _super.call(this, proxy, extensionId, onDispose) || this;
        _this._items = [];
        _this._handlesToItems = new Map();
        _this._itemsToHandles = new Map();
        _this._canSelectMany = false;
        _this._matchOnDescription = true;
        _this._matchOnDetail = true;
        _this._activeItems = [];
        _this._onDidChangeActiveEmitter = new Emitter();
        _this._selectedItems = [];
        _this._onDidChangeSelectionEmitter = new Emitter();
        _this.onDidChangeActive = _this._onDidChangeActiveEmitter.event;
        _this.onDidChangeSelection = _this._onDidChangeSelectionEmitter.event;
        _this._disposables.push(_this._onDidChangeActiveEmitter, _this._onDidChangeSelectionEmitter);
        _this.update({ type: 'quickPick' });
        return _this;
    }
    Object.defineProperty(ExtHostQuickPick.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (items) {
            var _this = this;
            this._items = items.slice();
            this._handlesToItems.clear();
            this._itemsToHandles.clear();
            items.forEach(function (item, i) {
                _this._handlesToItems.set(i, item);
                _this._itemsToHandles.set(item, i);
            });
            this.update({
                items: items.map(function (item, i) { return ({
                    label: item.label,
                    description: item.description,
                    handle: i,
                    detail: item.detail,
                    picked: item.picked,
                    alwaysShow: item.alwaysShow
                }); })
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickPick.prototype, "canSelectMany", {
        get: function () {
            return this._canSelectMany;
        },
        set: function (canSelectMany) {
            this._canSelectMany = canSelectMany;
            this.update({ canSelectMany: canSelectMany });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickPick.prototype, "matchOnDescription", {
        get: function () {
            return this._matchOnDescription;
        },
        set: function (matchOnDescription) {
            this._matchOnDescription = matchOnDescription;
            this.update({ matchOnDescription: matchOnDescription });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickPick.prototype, "matchOnDetail", {
        get: function () {
            return this._matchOnDetail;
        },
        set: function (matchOnDetail) {
            this._matchOnDetail = matchOnDetail;
            this.update({ matchOnDetail: matchOnDetail });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickPick.prototype, "activeItems", {
        get: function () {
            return this._activeItems;
        },
        set: function (activeItems) {
            var _this = this;
            this._activeItems = activeItems.filter(function (item) { return _this._itemsToHandles.has(item); });
            this.update({ activeItems: this._activeItems.map(function (item) { return _this._itemsToHandles.get(item); }) });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostQuickPick.prototype, "selectedItems", {
        get: function () {
            return this._selectedItems;
        },
        set: function (selectedItems) {
            var _this = this;
            this._selectedItems = selectedItems.filter(function (item) { return _this._itemsToHandles.has(item); });
            this.update({ selectedItems: this._selectedItems.map(function (item) { return _this._itemsToHandles.get(item); }) });
        },
        enumerable: true,
        configurable: true
    });
    ExtHostQuickPick.prototype._fireDidChangeActive = function (handles) {
        var _this = this;
        var items = handles.map(function (handle) { return _this._handlesToItems.get(handle); });
        this._activeItems = items;
        this._onDidChangeActiveEmitter.fire(items);
    };
    ExtHostQuickPick.prototype._fireDidChangeSelection = function (handles) {
        var _this = this;
        var items = handles.map(function (handle) { return _this._handlesToItems.get(handle); });
        this._selectedItems = items;
        this._onDidChangeSelectionEmitter.fire(items);
    };
    return ExtHostQuickPick;
}(ExtHostQuickInput));
var ExtHostInputBox = /** @class */ (function (_super) {
    __extends(ExtHostInputBox, _super);
    function ExtHostInputBox(proxy, extensionId, onDispose) {
        var _this = _super.call(this, proxy, extensionId, onDispose) || this;
        _this.update({ type: 'inputBox' });
        return _this;
    }
    Object.defineProperty(ExtHostInputBox.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (password) {
            this._password = password;
            this.update({ password: password });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostInputBox.prototype, "prompt", {
        get: function () {
            return this._prompt;
        },
        set: function (prompt) {
            this._prompt = prompt;
            this.update({ prompt: prompt });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostInputBox.prototype, "validationMessage", {
        get: function () {
            return this._validationMessage;
        },
        set: function (validationMessage) {
            this._validationMessage = validationMessage;
            this.update({ validationMessage: validationMessage });
        },
        enumerable: true,
        configurable: true
    });
    return ExtHostInputBox;
}(ExtHostQuickInput));

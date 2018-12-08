/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import * as typeConverters from './extHostTypeConverters.js';
import { MainContext } from './extHost.protocol.js';
import { Disposable } from './extHostTypes.js';
var ExtHostWebview = /** @class */ (function () {
    function ExtHostWebview(handle, proxy, options) {
        this._isDisposed = false;
        this._onMessageEmitter = new Emitter();
        this.onDidReceiveMessage = this._onMessageEmitter.event;
        this._handle = handle;
        this._proxy = proxy;
        this._options = options;
    }
    ExtHostWebview.prototype.dispose = function () {
        this._onMessageEmitter.dispose();
    };
    Object.defineProperty(ExtHostWebview.prototype, "html", {
        get: function () {
            this.assertNotDisposed();
            return this._html;
        },
        set: function (value) {
            this.assertNotDisposed();
            if (this._html !== value) {
                this._html = value;
                this._proxy.$setHtml(this._handle, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWebview.prototype, "options", {
        get: function () {
            this.assertNotDisposed();
            return this._options;
        },
        set: function (newOptions) {
            this.assertNotDisposed();
            this._proxy.$setOptions(this._handle, newOptions);
            this._options = newOptions;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostWebview.prototype.postMessage = function (message) {
        this.assertNotDisposed();
        return this._proxy.$postMessage(this._handle, message);
    };
    ExtHostWebview.prototype.assertNotDisposed = function () {
        if (this._isDisposed) {
            throw new Error('Webview is disposed');
        }
    };
    return ExtHostWebview;
}());
export { ExtHostWebview };
var ExtHostWebviewPanel = /** @class */ (function () {
    function ExtHostWebviewPanel(handle, proxy, viewType, title, viewColumn, editorOptions, webview) {
        this._isDisposed = false;
        this._visible = true;
        this._active = true;
        this._onDisposeEmitter = new Emitter();
        this.onDidDispose = this._onDisposeEmitter.event;
        this._onDidChangeViewStateEmitter = new Emitter();
        this.onDidChangeViewState = this._onDidChangeViewStateEmitter.event;
        this._handle = handle;
        this._proxy = proxy;
        this._viewType = viewType;
        this._options = editorOptions;
        this._viewColumn = viewColumn;
        this._title = title;
        this._webview = webview;
    }
    ExtHostWebviewPanel.prototype.dispose = function () {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this._onDisposeEmitter.fire();
        this._proxy.$disposeWebview(this._handle);
        this._webview.dispose();
        this._onDisposeEmitter.dispose();
        this._onDidChangeViewStateEmitter.dispose();
    };
    Object.defineProperty(ExtHostWebviewPanel.prototype, "webview", {
        get: function () {
            this.assertNotDisposed();
            return this._webview;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWebviewPanel.prototype, "viewType", {
        get: function () {
            this.assertNotDisposed();
            return this._viewType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWebviewPanel.prototype, "title", {
        get: function () {
            this.assertNotDisposed();
            return this._title;
        },
        set: function (value) {
            this.assertNotDisposed();
            if (this._title !== value) {
                this._title = value;
                this._proxy.$setTitle(this._handle, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWebviewPanel.prototype, "iconPath", {
        get: function () {
            this.assertNotDisposed();
            return this._iconPath;
        },
        set: function (value) {
            this.assertNotDisposed();
            if (this._iconPath !== value) {
                this._iconPath = value;
                this._proxy.$setIconPath(this._handle, URI.isUri(value) ? { light: value, dark: value } : value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWebviewPanel.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWebviewPanel.prototype, "viewColumn", {
        get: function () {
            this.assertNotDisposed();
            return this._viewColumn;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostWebviewPanel.prototype._setViewColumn = function (value) {
        this.assertNotDisposed();
        this._viewColumn = value;
    };
    Object.defineProperty(ExtHostWebviewPanel.prototype, "active", {
        get: function () {
            this.assertNotDisposed();
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostWebviewPanel.prototype._setActive = function (value) {
        this.assertNotDisposed();
        this._active = value;
    };
    Object.defineProperty(ExtHostWebviewPanel.prototype, "visible", {
        get: function () {
            this.assertNotDisposed();
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostWebviewPanel.prototype._setVisible = function (value) {
        this.assertNotDisposed();
        this._visible = value;
    };
    ExtHostWebviewPanel.prototype.postMessage = function (message) {
        this.assertNotDisposed();
        return this._proxy.$postMessage(this._handle, message);
    };
    ExtHostWebviewPanel.prototype.reveal = function (viewColumn, preserveFocus) {
        this.assertNotDisposed();
        this._proxy.$reveal(this._handle, {
            viewColumn: viewColumn ? typeConverters.ViewColumn.from(viewColumn) : undefined,
            preserveFocus: !!preserveFocus
        });
    };
    ExtHostWebviewPanel.prototype.assertNotDisposed = function () {
        if (this._isDisposed) {
            throw new Error('Webview is disposed');
        }
    };
    return ExtHostWebviewPanel;
}());
export { ExtHostWebviewPanel };
var ExtHostWebviews = /** @class */ (function () {
    function ExtHostWebviews(mainContext) {
        this._webviewPanels = new Map();
        this._serializers = new Map();
        this._proxy = mainContext.getProxy(MainContext.MainThreadWebviews);
    }
    ExtHostWebviews.newHandle = function () {
        return ExtHostWebviews.webviewHandlePool++ + '';
    };
    ExtHostWebviews.prototype.createWebview = function (extension, viewType, title, showOptions, options) {
        if (options === void 0) { options = {}; }
        var viewColumn = typeof showOptions === 'object' ? showOptions.viewColumn : showOptions;
        var webviewShowOptions = {
            viewColumn: typeConverters.ViewColumn.from(viewColumn),
            preserveFocus: typeof showOptions === 'object' && !!showOptions.preserveFocus
        };
        var handle = ExtHostWebviews.newHandle();
        this._proxy.$createWebviewPanel(handle, viewType, title, webviewShowOptions, options, extension.id, extension.extensionLocation);
        var webview = new ExtHostWebview(handle, this._proxy, options);
        var panel = new ExtHostWebviewPanel(handle, this._proxy, viewType, title, viewColumn, options, webview);
        this._webviewPanels.set(handle, panel);
        return panel;
    };
    ExtHostWebviews.prototype.registerWebviewPanelSerializer = function (viewType, serializer) {
        var _this = this;
        if (this._serializers.has(viewType)) {
            throw new Error("Serializer for '" + viewType + "' already registered");
        }
        this._serializers.set(viewType, serializer);
        this._proxy.$registerSerializer(viewType);
        return new Disposable(function () {
            _this._serializers.delete(viewType);
            _this._proxy.$unregisterSerializer(viewType);
        });
    };
    ExtHostWebviews.prototype.$onMessage = function (handle, message) {
        var panel = this.getWebviewPanel(handle);
        if (panel) {
            panel.webview._onMessageEmitter.fire(message);
        }
    };
    ExtHostWebviews.prototype.$onDidChangeWebviewPanelViewState = function (handle, newState) {
        var panel = this.getWebviewPanel(handle);
        if (!panel) {
            return;
        }
        var viewColumn = typeConverters.ViewColumn.to(newState.position);
        if (panel.active !== newState.active || panel.visible !== newState.visible || panel.viewColumn !== viewColumn) {
            panel._setActive(newState.active);
            panel._setVisible(newState.visible);
            panel._setViewColumn(viewColumn);
            panel._onDidChangeViewStateEmitter.fire({ webviewPanel: panel });
        }
    };
    ExtHostWebviews.prototype.$onDidDisposeWebviewPanel = function (handle) {
        var panel = this.getWebviewPanel(handle);
        if (panel) {
            panel.dispose();
            this._webviewPanels.delete(handle);
        }
        return Promise.resolve(void 0);
    };
    ExtHostWebviews.prototype.$deserializeWebviewPanel = function (webviewHandle, viewType, title, state, position, options) {
        var serializer = this._serializers.get(viewType);
        if (!serializer) {
            return Promise.reject(new Error("No serializer found for '" + viewType + "'"));
        }
        var webview = new ExtHostWebview(webviewHandle, this._proxy, options);
        var revivedPanel = new ExtHostWebviewPanel(webviewHandle, this._proxy, viewType, title, typeConverters.ViewColumn.to(position), options, webview);
        this._webviewPanels.set(webviewHandle, revivedPanel);
        return serializer.deserializeWebviewPanel(revivedPanel, state);
    };
    ExtHostWebviews.prototype.getWebviewPanel = function (handle) {
        return this._webviewPanels.get(handle);
    };
    ExtHostWebviews.webviewHandlePool = 1;
    return ExtHostWebviews;
}());
export { ExtHostWebviews };

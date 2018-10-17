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
import { TPromise } from '../../../../base/common/winjs.base.js';
import { Panel } from '../../panel.js';
import { EditorInput } from '../../../common/editor.js';
import { LRUCache } from '../../../../base/common/map.js';
import { once, Event } from '../../../../base/common/event.js';
import { isEmptyObject } from '../../../../base/common/types.js';
import { DEFAULT_EDITOR_MIN_DIMENSIONS, DEFAULT_EDITOR_MAX_DIMENSIONS } from './editor.js';
/**
 * The base class of editors in the workbench. Editors register themselves for specific editor inputs.
 * Editors are layed out in the editor part of the workbench in editor groups. Multiple editors can be
 * open at the same time. Each editor has a minimized representation that is good enough to provide some
 * information about the state of the editor data.
 *
 * The workbench will keep an editor alive after it has been created and show/hide it based on
 * user interaction. The lifecycle of a editor goes in the order create(), setVisible(true|false),
 * layout(), setInput(), focus(), dispose(). During use of the workbench, a editor will often receive a
 * clearInput, setVisible, layout and focus call, but only one create and dispose call.
 *
 * This class is only intended to be subclassed and not instantiated.
 */
var BaseEditor = /** @class */ (function (_super) {
    __extends(BaseEditor, _super);
    function BaseEditor(id, telemetryService, themeService) {
        var _this = _super.call(this, id, telemetryService, themeService) || this;
        _this.minimumWidth = DEFAULT_EDITOR_MIN_DIMENSIONS.width;
        _this.maximumWidth = DEFAULT_EDITOR_MAX_DIMENSIONS.width;
        _this.minimumHeight = DEFAULT_EDITOR_MIN_DIMENSIONS.height;
        _this.maximumHeight = DEFAULT_EDITOR_MAX_DIMENSIONS.height;
        _this.onDidSizeConstraintsChange = Event.None;
        return _this;
    }
    Object.defineProperty(BaseEditor.prototype, "input", {
        get: function () {
            return this._input;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEditor.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEditor.prototype, "group", {
        get: function () {
            return this._group;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Sets the given input with the options to the editor. The input is guaranteed
     * to be different from the previous input that was set using the input.matches()
     * method.
     *
     * The provided cancellation token should be used to test if the operation
     * was cancelled.
     */
    BaseEditor.prototype.setInput = function (input, options, token) {
        this._input = input;
        this._options = options;
        return TPromise.wrap(null);
    };
    /**
     * Called to indicate to the editor that the input should be cleared and
     * resources associated with the input should be freed.
     */
    BaseEditor.prototype.clearInput = function () {
        this._input = null;
        this._options = null;
    };
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Sets the given options to the editor. Clients should apply the options
     * to the current input.
     */
    BaseEditor.prototype.setOptions = function (options) {
        this._options = options;
    };
    BaseEditor.prototype.create = function (parent) {
        var res = _super.prototype.create.call(this, parent);
        // Create Editor
        this.createEditor(parent);
        return res;
    };
    BaseEditor.prototype.setVisible = function (visible, group) {
        var promise = _super.prototype.setVisible.call(this, visible);
        // Propagate to Editor
        this.setEditorVisible(visible, group);
        return promise;
    };
    /**
     * Indicates that the editor control got visible or hidden in a specific group. A
     * editor instance will only ever be visible in one editor group.
     *
     * @param visible the state of visibility of this editor
     * @param group the editor group this editor is in.
     */
    BaseEditor.prototype.setEditorVisible = function (visible, group) {
        this._group = group;
    };
    BaseEditor.prototype.getEditorMemento = function (storageService, editorGroupService, key, limit) {
        if (limit === void 0) { limit = 10; }
        var mementoKey = "" + this.getId() + key;
        var editorMemento = BaseEditor.EDITOR_MEMENTOS.get(mementoKey);
        if (!editorMemento) {
            editorMemento = new EditorMemento(this.getId(), key, this.getMemento(storageService, 1 /* WORKSPACE */), limit, editorGroupService);
            BaseEditor.EDITOR_MEMENTOS.set(mementoKey, editorMemento);
        }
        return editorMemento;
    };
    BaseEditor.prototype.shutdown = function () {
        var _this = this;
        // Shutdown all editor memento for this editor type
        BaseEditor.EDITOR_MEMENTOS.forEach(function (editorMemento) {
            if (editorMemento.id === _this.getId()) {
                editorMemento.shutdown();
            }
        });
        _super.prototype.shutdown.call(this);
    };
    BaseEditor.prototype.dispose = function () {
        this._input = null;
        this._options = null;
        _super.prototype.dispose.call(this);
    };
    BaseEditor.EDITOR_MEMENTOS = new Map();
    return BaseEditor;
}(Panel));
export { BaseEditor };
var EditorMemento = /** @class */ (function () {
    function EditorMemento(_id, key, memento, limit, editorGroupService) {
        this._id = _id;
        this.key = key;
        this.memento = memento;
        this.limit = limit;
        this.editorGroupService = editorGroupService;
        this.cleanedUp = false;
    }
    Object.defineProperty(EditorMemento.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    EditorMemento.prototype.saveState = function (group, resourceOrEditor, state) {
        var _this = this;
        var resource = this.doGetResource(resourceOrEditor);
        if (!resource || !group) {
            return; // we are not in a good state to save any state for a resource
        }
        var cache = this.doLoad();
        var mementoForResource = cache.get(resource.toString());
        if (!mementoForResource) {
            mementoForResource = Object.create(null);
            cache.set(resource.toString(), mementoForResource);
        }
        mementoForResource[group.id] = state;
        // Automatically clear when editor input gets disposed if any
        if (resourceOrEditor instanceof EditorInput) {
            once(resourceOrEditor.onDispose)(function () {
                _this.clearState(resource);
            });
        }
    };
    EditorMemento.prototype.loadState = function (group, resourceOrEditor) {
        var resource = this.doGetResource(resourceOrEditor);
        if (!resource || !group) {
            return void 0; // we are not in a good state to load any state for a resource
        }
        var cache = this.doLoad();
        var mementoForResource = cache.get(resource.toString());
        if (mementoForResource) {
            return mementoForResource[group.id];
        }
        return void 0;
    };
    EditorMemento.prototype.clearState = function (resourceOrEditor, group) {
        var resource = this.doGetResource(resourceOrEditor);
        if (resource) {
            var cache = this.doLoad();
            if (group) {
                var resourceViewState = cache.get(resource.toString());
                if (resourceViewState) {
                    delete resourceViewState[group.id];
                }
            }
            else {
                cache.delete(resource.toString());
            }
        }
    };
    EditorMemento.prototype.doGetResource = function (resourceOrEditor) {
        if (resourceOrEditor instanceof EditorInput) {
            return resourceOrEditor.getResource();
        }
        return resourceOrEditor;
    };
    EditorMemento.prototype.doLoad = function () {
        if (!this.cache) {
            this.cache = new LRUCache(this.limit);
            // Restore from serialized map state
            var rawEditorMemento = this.memento[this.key];
            if (Array.isArray(rawEditorMemento)) {
                this.cache.fromJSON(rawEditorMemento);
            }
        }
        return this.cache;
    };
    EditorMemento.prototype.shutdown = function () {
        var cache = this.doLoad();
        // Cleanup once during shutdown
        if (!this.cleanedUp) {
            this.cleanUp();
            this.cleanedUp = true;
        }
        this.memento[this.key] = cache.toJSON();
    };
    EditorMemento.prototype.cleanUp = function () {
        var _this = this;
        var cache = this.doLoad();
        // Remove groups from states that no longer exist
        cache.forEach(function (mapGroupToMemento, resource) {
            Object.keys(mapGroupToMemento).forEach(function (group) {
                var groupId = Number(group);
                if (!_this.editorGroupService.getGroup(groupId)) {
                    delete mapGroupToMemento[groupId];
                    if (isEmptyObject(mapGroupToMemento)) {
                        cache.delete(resource);
                    }
                }
            });
        });
    };
    return EditorMemento;
}());
export { EditorMemento };

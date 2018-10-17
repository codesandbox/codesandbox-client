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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter, once } from '../../../base/common/event.js';
import { Extensions, EditorInput, toResource, SideBySideEditorInput } from '../editor.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { dispose, Disposable } from '../../../base/common/lifecycle.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { ResourceMap } from '../../../base/common/map.js';
var EditorOpenPositioning = {
    LEFT: 'left',
    RIGHT: 'right',
    FIRST: 'first',
    LAST: 'last'
};
export function isSerializedEditorGroup(obj) {
    var group = obj;
    return obj && typeof obj === 'object' && Array.isArray(group.editors) && Array.isArray(group.mru);
}
var EditorGroup = /** @class */ (function (_super) {
    __extends(EditorGroup, _super);
    function EditorGroup(labelOrSerializedGroup, instantiationService, configurationService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.configurationService = configurationService;
        //#region events
        _this._onDidEditorActivate = _this._register(new Emitter());
        _this._onDidEditorOpen = _this._register(new Emitter());
        _this._onDidEditorClose = _this._register(new Emitter());
        _this._onDidEditorDispose = _this._register(new Emitter());
        _this._onDidEditorBecomeDirty = _this._register(new Emitter());
        _this._onDidEditorLabelChange = _this._register(new Emitter());
        _this._onDidEditorMove = _this._register(new Emitter());
        _this._onDidEditorPin = _this._register(new Emitter());
        _this._onDidEditorUnpin = _this._register(new Emitter());
        _this.editors = [];
        _this.mru = [];
        _this.mapResourceToEditorCount = new ResourceMap();
        if (isSerializedEditorGroup(labelOrSerializedGroup)) {
            _this.deserialize(labelOrSerializedGroup);
        }
        else {
            _this._id = EditorGroup.IDS++;
        }
        _this.onConfigurationUpdated();
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(EditorGroup.prototype, "onDidEditorActivate", {
        get: function () { return this._onDidEditorActivate.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorOpen", {
        get: function () { return this._onDidEditorOpen.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorClose", {
        get: function () { return this._onDidEditorClose.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorDispose", {
        get: function () { return this._onDidEditorDispose.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorBecomeDirty", {
        get: function () { return this._onDidEditorBecomeDirty.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorLabelChange", {
        get: function () { return this._onDidEditorLabelChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorMove", {
        get: function () { return this._onDidEditorMove.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorPin", {
        get: function () { return this._onDidEditorPin.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "onDidEditorUnpin", {
        get: function () { return this._onDidEditorUnpin.event; },
        enumerable: true,
        configurable: true
    });
    EditorGroup.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.configurationService.onDidChangeConfiguration(function (e) { return _this.onConfigurationUpdated(e); }));
    };
    EditorGroup.prototype.onConfigurationUpdated = function (event) {
        this.editorOpenPositioning = this.configurationService.getValue('workbench.editor.openPositioning');
    };
    Object.defineProperty(EditorGroup.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroup.prototype, "count", {
        get: function () {
            return this.editors.length;
        },
        enumerable: true,
        configurable: true
    });
    EditorGroup.prototype.getEditors = function (mru) {
        return mru ? this.mru.slice(0) : this.editors.slice(0);
    };
    EditorGroup.prototype.getEditor = function (arg1) {
        if (typeof arg1 === 'number') {
            return this.editors[arg1];
        }
        var resource = arg1;
        if (!this.contains(resource)) {
            return null; // fast check for resource opened or not
        }
        for (var i = 0; i < this.editors.length; i++) {
            var editor = this.editors[i];
            var editorResource = toResource(editor, { supportSideBySide: true });
            if (editorResource && editorResource.toString() === resource.toString()) {
                return editor;
            }
        }
        return null;
    };
    Object.defineProperty(EditorGroup.prototype, "activeEditor", {
        get: function () {
            return this.active;
        },
        enumerable: true,
        configurable: true
    });
    EditorGroup.prototype.isActive = function (editor) {
        return this.matches(this.active, editor);
    };
    Object.defineProperty(EditorGroup.prototype, "previewEditor", {
        get: function () {
            return this.preview;
        },
        enumerable: true,
        configurable: true
    });
    EditorGroup.prototype.isPreview = function (editor) {
        return this.matches(this.preview, editor);
    };
    EditorGroup.prototype.openEditor = function (editor, options) {
        var index = this.indexOf(editor);
        var makePinned = options && options.pinned;
        var makeActive = (options && options.active) || !this.activeEditor || (!makePinned && this.matches(this.preview, this.activeEditor));
        // New editor
        if (index === -1) {
            var targetIndex = void 0;
            var indexOfActive = this.indexOf(this.active);
            // Insert into specific position
            if (options && typeof options.index === 'number') {
                targetIndex = options.index;
            }
            // Insert to the BEGINNING
            else if (this.editorOpenPositioning === EditorOpenPositioning.FIRST) {
                targetIndex = 0;
            }
            // Insert to the END
            else if (this.editorOpenPositioning === EditorOpenPositioning.LAST) {
                targetIndex = this.editors.length;
            }
            // Insert to the LEFT of active editor
            else if (this.editorOpenPositioning === EditorOpenPositioning.LEFT) {
                if (indexOfActive === 0 || !this.editors.length) {
                    targetIndex = 0; // to the left becoming first editor in list
                }
                else {
                    targetIndex = indexOfActive; // to the left of active editor
                }
            }
            // Insert to the RIGHT of active editor
            else {
                targetIndex = indexOfActive + 1;
            }
            // Insert into our list of editors if pinned or we have no preview editor
            if (makePinned || !this.preview) {
                this.splice(targetIndex, false, editor);
            }
            // Handle preview
            if (!makePinned) {
                // Replace existing preview with this editor if we have a preview
                if (this.preview) {
                    var indexOfPreview = this.indexOf(this.preview);
                    if (targetIndex > indexOfPreview) {
                        targetIndex--; // accomodate for the fact that the preview editor closes
                    }
                    this.replaceEditor(this.preview, editor, targetIndex, !makeActive);
                }
                this.preview = editor;
            }
            // Listeners
            this.registerEditorListeners(editor);
            // Event
            this._onDidEditorOpen.fire(editor);
            // Handle active
            if (makeActive) {
                this.setActive(editor);
            }
        }
        // Existing editor
        else {
            // Pin it
            if (makePinned) {
                this.pin(editor);
            }
            // Activate it
            if (makeActive) {
                this.setActive(editor);
            }
            // Respect index
            if (options && typeof options.index === 'number') {
                this.moveEditor(editor, options.index);
            }
        }
    };
    EditorGroup.prototype.registerEditorListeners = function (editor) {
        var _this = this;
        var unbind = [];
        // Re-emit disposal of editor input as our own event
        var onceDispose = once(editor.onDispose);
        unbind.push(onceDispose(function () {
            if (_this.indexOf(editor) >= 0) {
                _this._onDidEditorDispose.fire(editor);
            }
        }));
        // Re-Emit dirty state changes
        unbind.push(editor.onDidChangeDirty(function () {
            _this._onDidEditorBecomeDirty.fire(editor);
        }));
        // Re-Emit label changes
        unbind.push(editor.onDidChangeLabel(function () {
            _this._onDidEditorLabelChange.fire(editor);
        }));
        // Clean up dispose listeners once the editor gets closed
        unbind.push(this.onDidEditorClose(function (event) {
            if (event.editor.matches(editor)) {
                dispose(unbind);
            }
        }));
    };
    EditorGroup.prototype.replaceEditor = function (toReplace, replaceWidth, replaceIndex, openNext) {
        if (openNext === void 0) { openNext = true; }
        var event = this.doCloseEditor(toReplace, openNext, true); // optimization to prevent multiple setActive() in one call
        // We want to first add the new editor into our model before emitting the close event because
        // firing the close event can trigger a dispose on the same editor that is now being added.
        // This can lead into opening a disposed editor which is not what we want.
        this.splice(replaceIndex, false, replaceWidth);
        if (event) {
            this._onDidEditorClose.fire(event);
        }
    };
    EditorGroup.prototype.closeEditor = function (editor, openNext) {
        if (openNext === void 0) { openNext = true; }
        var event = this.doCloseEditor(editor, openNext, false);
        if (event) {
            this._onDidEditorClose.fire(event);
            return event.index;
        }
        return void 0;
    };
    EditorGroup.prototype.doCloseEditor = function (editor, openNext, replaced) {
        var index = this.indexOf(editor);
        if (index === -1) {
            return null; // not found
        }
        // Active Editor closed
        if (openNext && this.matches(this.active, editor)) {
            // More than one editor
            if (this.mru.length > 1) {
                this.setActive(this.mru[1]); // active editor is always first in MRU, so pick second editor after as new active
            }
            // One Editor
            else {
                this.active = null;
            }
        }
        // Preview Editor closed
        if (this.matches(this.preview, editor)) {
            this.preview = null;
        }
        // Remove from arrays
        this.splice(index, true);
        // Event
        return { editor: editor, replaced: replaced, index: index, groupId: this.id };
    };
    EditorGroup.prototype.closeEditors = function (except, direction) {
        var _this = this;
        var index = this.indexOf(except);
        if (index === -1) {
            return; // not found
        }
        // Close to the left
        if (direction === 0 /* LEFT */) {
            for (var i = index - 1; i >= 0; i--) {
                this.closeEditor(this.editors[i]);
            }
        }
        // Close to the right
        else if (direction === 1 /* RIGHT */) {
            for (var i = this.editors.length - 1; i > index; i--) {
                this.closeEditor(this.editors[i]);
            }
        }
        // Both directions
        else {
            this.mru.filter(function (e) { return !_this.matches(e, except); }).forEach(function (e) { return _this.closeEditor(e); });
        }
    };
    EditorGroup.prototype.closeAllEditors = function () {
        var _this = this;
        // Optimize: close all non active editors first to produce less upstream work
        this.mru.filter(function (e) { return !_this.matches(e, _this.active); }).forEach(function (e) { return _this.closeEditor(e); });
        this.closeEditor(this.active);
    };
    EditorGroup.prototype.moveEditor = function (editor, toIndex) {
        var index = this.indexOf(editor);
        if (index < 0) {
            return;
        }
        // Move
        this.editors.splice(index, 1);
        this.editors.splice(toIndex, 0, editor);
        // Event
        this._onDidEditorMove.fire(editor);
    };
    EditorGroup.prototype.setActive = function (editor) {
        var index = this.indexOf(editor);
        if (index === -1) {
            return; // not found
        }
        if (this.matches(this.active, editor)) {
            return; // already active
        }
        this.active = editor;
        // Bring to front in MRU list
        this.setMostRecentlyUsed(editor);
        // Event
        this._onDidEditorActivate.fire(editor);
    };
    EditorGroup.prototype.pin = function (editor) {
        var index = this.indexOf(editor);
        if (index === -1) {
            return; // not found
        }
        if (!this.isPreview(editor)) {
            return; // can only pin a preview editor
        }
        // Convert the preview editor to be a pinned editor
        this.preview = null;
        // Event
        this._onDidEditorPin.fire(editor);
    };
    EditorGroup.prototype.unpin = function (editor) {
        var index = this.indexOf(editor);
        if (index === -1) {
            return; // not found
        }
        if (!this.isPinned(editor)) {
            return; // can only unpin a pinned editor
        }
        // Set new
        var oldPreview = this.preview;
        this.preview = editor;
        // Event
        this._onDidEditorUnpin.fire(editor);
        // Close old preview editor if any
        this.closeEditor(oldPreview);
    };
    EditorGroup.prototype.isPinned = function (arg1) {
        var editor;
        var index;
        if (typeof arg1 === 'number') {
            editor = this.editors[arg1];
            index = arg1;
        }
        else {
            editor = arg1;
            index = this.indexOf(editor);
        }
        if (index === -1 || !editor) {
            return false; // editor not found
        }
        if (!this.preview) {
            return true; // no preview editor
        }
        return !this.matches(this.preview, editor);
    };
    EditorGroup.prototype.splice = function (index, del, editor) {
        var editorToDeleteOrReplace = this.editors[index];
        var args = [index, del ? 1 : 0];
        if (editor) {
            args.push(editor);
        }
        // Perform on editors array
        this.editors.splice.apply(this.editors, args);
        // Add
        if (!del && editor) {
            this.mru.push(editor); // make it LRU editor
            this.updateResourceMap(editor, false /* add */); // add new to resource map
        }
        // Remove / Replace
        else {
            var indexInMRU = this.indexOf(editorToDeleteOrReplace, this.mru);
            // Remove
            if (del && !editor) {
                this.mru.splice(indexInMRU, 1); // remove from MRU
                this.updateResourceMap(editorToDeleteOrReplace, true /* delete */); // remove from resource map
            }
            // Replace
            else {
                this.mru.splice(indexInMRU, 1, editor); // replace MRU at location
                this.updateResourceMap(editor, false /* add */); // add new to resource map
                this.updateResourceMap(editorToDeleteOrReplace, true /* delete */); // remove replaced from resource map
            }
        }
    };
    EditorGroup.prototype.updateResourceMap = function (editor, remove) {
        var resource = toResource(editor, { supportSideBySide: true });
        if (resource) {
            // It is possible to have the same resource opened twice (once as normal input and once as diff input)
            // So we need to do ref counting on the resource to provide the correct picture
            var counter = this.mapResourceToEditorCount.get(resource) || 0;
            var newCounter = void 0;
            if (remove) {
                if (counter > 1) {
                    newCounter = counter - 1;
                }
            }
            else {
                newCounter = counter + 1;
            }
            this.mapResourceToEditorCount.set(resource, newCounter);
        }
    };
    EditorGroup.prototype.indexOf = function (candidate, editors) {
        if (editors === void 0) { editors = this.editors; }
        if (!candidate) {
            return -1;
        }
        for (var i = 0; i < editors.length; i++) {
            if (this.matches(editors[i], candidate)) {
                return i;
            }
        }
        return -1;
    };
    EditorGroup.prototype.contains = function (editorOrResource, supportSideBySide) {
        if (editorOrResource instanceof EditorInput) {
            var index = this.indexOf(editorOrResource);
            if (index >= 0) {
                return true;
            }
            if (supportSideBySide && editorOrResource instanceof SideBySideEditorInput) {
                var index_1 = this.indexOf(editorOrResource.master);
                if (index_1 >= 0) {
                    return true;
                }
            }
            return false;
        }
        var counter = this.mapResourceToEditorCount.get(editorOrResource);
        return typeof counter === 'number' && counter > 0;
    };
    EditorGroup.prototype.setMostRecentlyUsed = function (editor) {
        var index = this.indexOf(editor);
        if (index === -1) {
            return; // editor not found
        }
        var mruIndex = this.indexOf(editor, this.mru);
        // Remove old index
        this.mru.splice(mruIndex, 1);
        // Set editor to front
        this.mru.unshift(editor);
    };
    EditorGroup.prototype.matches = function (editorA, editorB) {
        return !!editorA && !!editorB && editorA.matches(editorB);
    };
    EditorGroup.prototype.clone = function () {
        var group = this.instantiationService.createInstance(EditorGroup, void 0);
        group.editors = this.editors.slice(0);
        group.mru = this.mru.slice(0);
        group.mapResourceToEditorCount = this.mapResourceToEditorCount.clone();
        group.preview = this.preview;
        group.active = this.active;
        group.editorOpenPositioning = this.editorOpenPositioning;
        return group;
    };
    EditorGroup.prototype.serialize = function () {
        var _this = this;
        var registry = Registry.as(Extensions.EditorInputFactories);
        // Serialize all editor inputs so that we can store them.
        // Editors that cannot be serialized need to be ignored
        // from mru, active and preview if any.
        var serializableEditors = [];
        var serializedEditors = [];
        var serializablePreviewIndex;
        this.editors.forEach(function (e) {
            var factory = registry.getEditorInputFactory(e.getTypeId());
            if (factory) {
                var value = factory.serialize(e);
                if (typeof value === 'string') {
                    serializedEditors.push({ id: e.getTypeId(), value: value });
                    serializableEditors.push(e);
                    if (_this.preview === e) {
                        serializablePreviewIndex = serializableEditors.length - 1;
                    }
                }
            }
        });
        var serializableMru = this.mru.map(function (e) { return _this.indexOf(e, serializableEditors); }).filter(function (i) { return i >= 0; });
        return {
            id: this.id,
            editors: serializedEditors,
            mru: serializableMru,
            preview: serializablePreviewIndex,
        };
    };
    EditorGroup.prototype.deserialize = function (data) {
        var _this = this;
        var registry = Registry.as(Extensions.EditorInputFactories);
        if (typeof data.id === 'number') {
            this._id = data.id;
            EditorGroup.IDS = Math.max(data.id + 1, EditorGroup.IDS); // make sure our ID generator is always larger
        }
        else {
            this._id = EditorGroup.IDS++; // backwards compatibility
        }
        this.editors = data.editors.map(function (e) {
            var factory = registry.getEditorInputFactory(e.id);
            if (factory) {
                var editor = factory.deserialize(_this.instantiationService, e.value);
                _this.registerEditorListeners(editor);
                _this.updateResourceMap(editor, false /* add */);
                return editor;
            }
            return null;
        }).filter(function (e) { return !!e; });
        this.mru = data.mru.map(function (i) { return _this.editors[i]; });
        this.active = this.mru[0];
        this.preview = this.editors[data.preview];
    };
    EditorGroup.IDS = 0;
    EditorGroup = __decorate([
        __param(1, IInstantiationService),
        __param(2, IConfigurationService)
    ], EditorGroup);
    return EditorGroup;
}(Disposable));
export { EditorGroup };

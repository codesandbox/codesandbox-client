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
import * as errors from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { Extensions as EditorExtensions, EditorInput, toResource, Extensions as EditorInputExtensions } from '../../../common/editor.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { FileChangesEvent, IFileService, FILES_EXCLUDE_CONFIG } from '../../../../platform/files/common/files.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { dispose, Disposable } from '../../../../base/common/lifecycle.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { once, debounceEvent } from '../../../../base/common/event.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEditorGroupsService } from '../../group/common/editorGroupsService.js';
import { IWindowsService } from '../../../../platform/windows/common/windows.js';
import { getCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { getExcludes } from '../../../../platform/search/common/search.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ResourceGlobMatcher } from '../../../electron-browser/resources.js';
import { IPartService } from '../../part/common/partService.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
/**
 * Stores the selection & view state of an editor and allows to compare it to other selection states.
 */
var TextEditorState = /** @class */ (function () {
    function TextEditorState(_editorInput, _selection) {
        this._editorInput = _editorInput;
        this._selection = _selection;
        this.textEditorSelection = Selection.isISelection(_selection) ? {
            startLineNumber: _selection.startLineNumber,
            startColumn: _selection.startColumn
        } : void 0;
    }
    Object.defineProperty(TextEditorState.prototype, "editorInput", {
        get: function () {
            return this._editorInput;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextEditorState.prototype, "selection", {
        get: function () {
            return this.textEditorSelection;
        },
        enumerable: true,
        configurable: true
    });
    TextEditorState.prototype.justifiesNewPushState = function (other, event) {
        if (event && event.source === 'api') {
            return true; // always let API source win (e.g. "Go to definition" should add a history entry)
        }
        if (!this._editorInput.matches(other._editorInput)) {
            return true; // different editor inputs
        }
        if (!Selection.isISelection(this._selection) || !Selection.isISelection(other._selection)) {
            return true; // unknown selections
        }
        var thisLineNumber = Math.min(this._selection.selectionStartLineNumber, this._selection.positionLineNumber);
        var otherLineNumber = Math.min(other._selection.selectionStartLineNumber, other._selection.positionLineNumber);
        if (Math.abs(thisLineNumber - otherLineNumber) < TextEditorState.EDITOR_SELECTION_THRESHOLD) {
            return false; // ignore selection changes in the range of EditorState.EDITOR_SELECTION_THRESHOLD lines
        }
        return true;
    };
    TextEditorState.EDITOR_SELECTION_THRESHOLD = 10; // number of lines to move in editor to justify for new state
    return TextEditorState;
}());
export { TextEditorState };
var HistoryService = /** @class */ (function (_super) {
    __extends(HistoryService, _super);
    function HistoryService(editorService, editorGroupService, contextService, storageService, configurationService, lifecycleService, fileService, windowService, instantiationService, partService, contextKeyService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        _this.contextService = contextService;
        _this.storageService = storageService;
        _this.configurationService = configurationService;
        _this.lifecycleService = lifecycleService;
        _this.fileService = fileService;
        _this.windowService = windowService;
        _this.instantiationService = instantiationService;
        _this.partService = partService;
        _this.contextKeyService = contextKeyService;
        _this.activeEditorListeners = [];
        _this.canNavigateBackContextKey = (new RawContextKey('canNavigateBack', false)).bindTo(_this.contextKeyService);
        _this.canNavigateForwardContextKey = (new RawContextKey('canNavigateForward', false)).bindTo(_this.contextKeyService);
        _this.fileInputFactory = Registry.as(EditorInputExtensions.EditorInputFactories).getFileInputFactory();
        _this.index = -1;
        _this.lastIndex = -1;
        _this.stack = [];
        _this.recentlyClosedFiles = [];
        _this.loaded = false;
        _this.resourceFilter = _this._register(instantiationService.createInstance(ResourceGlobMatcher, function (root) { return _this.getExcludes(root); }, function (event) { return event.affectsConfiguration(FILES_EXCLUDE_CONFIG) || event.affectsConfiguration('search.exclude'); }));
        _this.registerListeners();
        return _this;
    }
    HistoryService.prototype.getExcludes = function (root) {
        var scope = root ? { resource: root } : void 0;
        return getExcludes(this.configurationService.getValue(scope));
    };
    HistoryService.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.editorService.onDidActiveEditorChange(function () { return _this.onActiveEditorChanged(); }));
        this._register(this.editorService.onDidOpenEditorFail(function (event) { return _this.remove(event.editor); }));
        this._register(this.editorService.onDidCloseEditor(function (event) { return _this.onEditorClosed(event); }));
        this._register(this.lifecycleService.onShutdown(function (reason) { return _this.saveHistory(); }));
        this._register(this.fileService.onFileChanges(function (event) { return _this.onFileChanges(event); }));
        this._register(this.resourceFilter.onExpressionChange(function () { return _this.handleExcludesChange(); }));
    };
    HistoryService.prototype.onActiveEditorChanged = function () {
        var _this = this;
        var activeControl = this.editorService.activeControl;
        if (this.lastActiveEditor && this.matchesEditor(this.lastActiveEditor, activeControl)) {
            return; // return if the active editor is still the same
        }
        // Remember as last active editor (can be undefined if none opened)
        this.lastActiveEditor = activeControl ? { editor: activeControl.input, groupId: activeControl.group.id } : void 0;
        // Dispose old listeners
        dispose(this.activeEditorListeners);
        this.activeEditorListeners = [];
        // Propagate to history
        this.handleActiveEditorChange(activeControl);
        // Apply listener for selection changes if this is a text editor
        var activeTextEditorWidget = getCodeEditor(this.editorService.activeTextEditorWidget);
        var activeEditor = this.editorService.activeEditor;
        if (activeTextEditorWidget) {
            // Debounce the event with a timeout of 0ms so that multiple calls to
            // editor.setSelection() are folded into one. We do not want to record
            // subsequent history navigations for such API calls.
            this.activeEditorListeners.push(debounceEvent(activeTextEditorWidget.onDidChangeCursorPosition, function (last, event) { return event; }, 0)((function (event) {
                _this.handleEditorSelectionChangeEvent(activeControl, event);
            })));
            // Track the last edit location by tracking model content change events
            // Use a debouncer to make sure to capture the correct cursor position
            // after the model content has changed.
            this.activeEditorListeners.push(debounceEvent(activeTextEditorWidget.onDidChangeModelContent, function (last, event) { return event; }, 0)((function (event) {
                _this.lastEditLocation = { input: activeEditor };
                var position = activeTextEditorWidget.getPosition();
                if (position) {
                    _this.lastEditLocation.selection = {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column
                    };
                }
            })));
        }
    };
    HistoryService.prototype.matchesEditor = function (identifier, editor) {
        if (!editor || !editor.group) {
            return false;
        }
        if (identifier.groupId !== editor.group.id) {
            return false;
        }
        return identifier.editor.matches(editor.input);
    };
    HistoryService.prototype.onFileChanges = function (e) {
        if (e.gotDeleted()) {
            this.remove(e); // remove from history files that got deleted or moved
        }
    };
    HistoryService.prototype.onEditorClosed = function (event) {
        // Track closing of editor to support to reopen closed editors (unless editor was replaced)
        if (!event.replaced) {
            var resource = event.editor ? event.editor.getResource() : void 0;
            var supportsReopen = resource && this.fileService.canHandleResource(resource); // we only support file'ish things to reopen
            if (supportsReopen) {
                // Remove all inputs matching and add as last recently closed
                this.removeFromRecentlyClosedFiles(event.editor);
                this.recentlyClosedFiles.push({ resource: resource, index: event.index });
                // Bounding
                if (this.recentlyClosedFiles.length > HistoryService.MAX_RECENTLY_CLOSED_EDITORS) {
                    this.recentlyClosedFiles.shift();
                }
            }
        }
    };
    HistoryService.prototype.reopenLastClosedEditor = function () {
        this.ensureHistoryLoaded();
        var lastClosedFile = this.recentlyClosedFiles.pop();
        while (lastClosedFile && this.isFileOpened(lastClosedFile.resource, this.editorGroupService.activeGroup)) {
            lastClosedFile = this.recentlyClosedFiles.pop(); // pop until we find a file that is not opened
        }
        if (lastClosedFile) {
            this.editorService.openEditor({ resource: lastClosedFile.resource, options: { pinned: true, index: lastClosedFile.index } });
        }
    };
    HistoryService.prototype.openLastEditLocation = function () {
        if (this.lastEditLocation) {
            this.doNavigate(this.lastEditLocation, true);
        }
    };
    HistoryService.prototype.forward = function (acrossEditors) {
        if (this.stack.length > this.index + 1) {
            if (acrossEditors) {
                this.doForwardAcrossEditors();
            }
            else {
                this.doForwardInEditors();
            }
        }
    };
    HistoryService.prototype.doForwardInEditors = function () {
        this.setIndex(this.index + 1);
        this.navigate();
    };
    HistoryService.prototype.setIndex = function (value) {
        this.lastIndex = this.index;
        this.index = value;
        this.updateContextKeys();
    };
    HistoryService.prototype.doForwardAcrossEditors = function () {
        var currentIndex = this.index;
        var currentEntry = this.stack[this.index];
        // Find the next entry that does not match our current entry
        while (this.stack.length > currentIndex + 1) {
            currentIndex++;
            var previousEntry = this.stack[currentIndex];
            if (!this.matches(currentEntry.input, previousEntry.input)) {
                this.setIndex(currentIndex);
                this.navigate(true /* across editors */);
                break;
            }
        }
    };
    HistoryService.prototype.back = function (acrossEditors) {
        if (this.index > 0) {
            if (acrossEditors) {
                this.doBackAcrossEditors();
            }
            else {
                this.doBackInEditors();
            }
        }
    };
    HistoryService.prototype.last = function () {
        if (this.lastIndex === -1) {
            this.back();
        }
        else {
            this.setIndex(this.lastIndex);
            this.navigate();
        }
    };
    HistoryService.prototype.doBackInEditors = function () {
        this.setIndex(this.index - 1);
        this.navigate();
    };
    HistoryService.prototype.doBackAcrossEditors = function () {
        var currentIndex = this.index;
        var currentEntry = this.stack[this.index];
        // Find the next previous entry that does not match our current entry
        while (currentIndex > 0) {
            currentIndex--;
            var previousEntry = this.stack[currentIndex];
            if (!this.matches(currentEntry.input, previousEntry.input)) {
                this.setIndex(currentIndex);
                this.navigate(true /* across editors */);
                break;
            }
        }
    };
    HistoryService.prototype.clear = function () {
        this.ensureHistoryLoaded();
        // Navigation (next, previous)
        this.index = -1;
        this.lastIndex = -1;
        this.stack.splice(0);
        // Closed files
        this.recentlyClosedFiles = [];
        // History
        this.clearRecentlyOpened();
        this.updateContextKeys();
    };
    HistoryService.prototype.clearRecentlyOpened = function () {
        this.history = [];
    };
    HistoryService.prototype.updateContextKeys = function () {
        this.canNavigateBackContextKey.set(this.stack.length > 0 && this.index > 0);
        this.canNavigateForwardContextKey.set(this.stack.length > 0 && this.index < this.stack.length - 1);
    };
    HistoryService.prototype.navigate = function (acrossEditors) {
        var _this = this;
        this.navigatingInStack = true;
        this.doNavigate(this.stack[this.index], !acrossEditors).then(function () {
            _this.navigatingInStack = false;
        }, function (error) {
            _this.navigatingInStack = false;
            errors.onUnexpectedError(error);
        });
    };
    HistoryService.prototype.doNavigate = function (location, withSelection) {
        var options = {
            revealIfOpened: true // support to navigate across editor groups
        };
        // Unless we navigate across editors, support selection and
        // minimize scrolling by setting revealInCenterIfOutsideViewport
        if (location.selection && withSelection) {
            options.selection = location.selection;
            options.revealInCenterIfOutsideViewport = true;
        }
        if (location.input instanceof EditorInput) {
            return this.editorService.openEditor(location.input, options);
        }
        return this.editorService.openEditor({ resource: location.input.resource, options: options });
    };
    HistoryService.prototype.handleEditorSelectionChangeEvent = function (editor, event) {
        this.handleEditorEventInStack(editor, event);
    };
    HistoryService.prototype.handleActiveEditorChange = function (editor) {
        this.handleEditorEventInHistory(editor);
        this.handleEditorEventInStack(editor);
    };
    HistoryService.prototype.handleEditorEventInHistory = function (editor) {
        var _this = this;
        var input = editor ? editor.input : void 0;
        // Ensure we have at least a name to show and not configured to exclude input
        if (!input || !input.getName() || !this.include(input)) {
            return;
        }
        this.ensureHistoryLoaded();
        var historyInput = this.preferResourceInput(input);
        // Remove any existing entry and add to the beginning
        this.removeFromHistory(input);
        this.history.unshift(historyInput);
        // Respect max entries setting
        if (this.history.length > HistoryService.MAX_HISTORY_ITEMS) {
            this.history.pop();
        }
        // Remove this from the history unless the history input is a resource
        // that can easily be restored even when the input gets disposed
        if (historyInput instanceof EditorInput) {
            once(historyInput.onDispose)(function () { return _this.removeFromHistory(input); });
        }
    };
    HistoryService.prototype.include = function (input) {
        if (input instanceof EditorInput) {
            return true; // include any non files
        }
        var resourceInput = input;
        return !this.resourceFilter.matches(resourceInput.resource);
    };
    HistoryService.prototype.handleExcludesChange = function () {
        this.removeExcludedFromHistory();
    };
    HistoryService.prototype.remove = function (arg1) {
        this.removeFromHistory(arg1);
        this.removeFromStack(arg1);
        this.removeFromRecentlyClosedFiles(arg1);
        this.removeFromRecentlyOpened(arg1);
    };
    HistoryService.prototype.removeExcludedFromHistory = function () {
        var _this = this;
        this.ensureHistoryLoaded();
        this.history = this.history.filter(function (e) { return _this.include(e); });
    };
    HistoryService.prototype.removeFromHistory = function (arg1) {
        var _this = this;
        this.ensureHistoryLoaded();
        this.history = this.history.filter(function (e) { return !_this.matches(arg1, e); });
    };
    HistoryService.prototype.handleEditorEventInStack = function (control, event) {
        var codeEditor = control ? getCodeEditor(control.getControl()) : void 0;
        // treat editor changes that happen as part of stack navigation specially
        // we do not want to add a new stack entry as a matter of navigating the
        // stack but we need to keep our currentTextEditorState up to date with
        // the navigtion that occurs.
        if (this.navigatingInStack) {
            if (codeEditor && control.input) {
                this.currentTextEditorState = new TextEditorState(control.input, codeEditor.getSelection());
            }
            else {
                this.currentTextEditorState = null; // we navigated to a non text editor
            }
        }
        // normal navigation not part of history navigation
        else {
            // navigation inside text editor
            if (codeEditor && control.input) {
                this.handleTextEditorEvent(control, codeEditor, event);
            }
            // navigation to non-text editor
            else {
                this.currentTextEditorState = null; // at this time we have no active text editor view state
                if (control && control.input) {
                    this.handleNonTextEditorEvent(control);
                }
            }
        }
    };
    HistoryService.prototype.handleTextEditorEvent = function (editor, editorControl, event) {
        var stateCandidate = new TextEditorState(editor.input, editorControl.getSelection());
        // Add to stack if we dont have a current state or this new state justifies a push
        if (!this.currentTextEditorState || this.currentTextEditorState.justifiesNewPushState(stateCandidate, event)) {
            this.add(editor.input, stateCandidate.selection);
        }
        // Otherwise we replace the current stack entry with this one
        else {
            this.replace(editor.input, stateCandidate.selection);
        }
        // Update our current text editor state
        this.currentTextEditorState = stateCandidate;
    };
    HistoryService.prototype.handleNonTextEditorEvent = function (editor) {
        var currentStack = this.stack[this.index];
        if (currentStack && this.matches(editor.input, currentStack.input)) {
            return; // do not push same editor input again
        }
        this.add(editor.input);
    };
    HistoryService.prototype.add = function (input, selection) {
        if (!this.navigatingInStack) {
            this.addOrReplaceInStack(input, selection);
        }
    };
    HistoryService.prototype.replace = function (input, selection) {
        if (!this.navigatingInStack) {
            this.addOrReplaceInStack(input, selection, true /* force replace */);
        }
    };
    HistoryService.prototype.addOrReplaceInStack = function (input, selection, forceReplace) {
        var _this = this;
        // Overwrite an entry in the stack if we have a matching input that comes
        // with editor options to indicate that this entry is more specific. Also
        // prevent entries that have the exact same options. Finally, Overwrite
        // entries if we detect that the change came in very fast which indicates
        // that it was not coming in from a user change but rather rapid programmatic
        // changes. We just take the last of the changes to not cause too many entries
        // on the stack.
        // We can also be instructed to force replace the last entry.
        var replace = false;
        var currentEntry = this.stack[this.index];
        if (currentEntry) {
            if (forceReplace) {
                replace = true; // replace if we are forced to
            }
            else if (this.matches(input, currentEntry.input) && this.sameSelection(currentEntry.selection, selection)) {
                replace = true; // replace if the input is the same as the current one and the selection as well
            }
        }
        var stackInput = this.preferResourceInput(input);
        var entry = { input: stackInput, selection: selection };
        // Replace at current position
        if (replace) {
            this.stack[this.index] = entry;
        }
        // Add to stack at current position
        else {
            // If we are not at the end of history, we remove anything after
            if (this.stack.length > this.index + 1) {
                this.stack = this.stack.slice(0, this.index + 1);
            }
            this.stack.splice(this.index + 1, 0, entry);
            // Check for limit
            if (this.stack.length > HistoryService.MAX_STACK_ITEMS) {
                this.stack.shift(); // remove first and dispose
                if (this.lastIndex >= 0) {
                    this.lastIndex--;
                }
            }
            else {
                this.setIndex(this.index + 1);
            }
        }
        // Remove this from the stack unless the stack input is a resource
        // that can easily be restored even when the input gets disposed
        if (stackInput instanceof EditorInput) {
            once(stackInput.onDispose)(function () { return _this.removeFromStack(input); });
        }
        // Context
        this.updateContextKeys();
    };
    HistoryService.prototype.preferResourceInput = function (input) {
        if (this.fileInputFactory.isFileInput(input)) {
            return { resource: input.getResource() };
        }
        return input;
    };
    HistoryService.prototype.sameSelection = function (selectionA, selectionB) {
        if (!selectionA && !selectionB) {
            return true;
        }
        if ((!selectionA && selectionB) || (selectionA && !selectionB)) {
            return false;
        }
        return selectionA.startLineNumber === selectionB.startLineNumber; // we consider the history entry same if we are on the same line
    };
    HistoryService.prototype.removeFromStack = function (arg1) {
        var _this = this;
        this.stack = this.stack.filter(function (e) { return !_this.matches(arg1, e.input); });
        this.index = this.stack.length - 1; // reset index
        this.lastIndex = -1;
        this.updateContextKeys();
    };
    HistoryService.prototype.removeFromRecentlyClosedFiles = function (arg1) {
        var _this = this;
        this.recentlyClosedFiles = this.recentlyClosedFiles.filter(function (e) { return !_this.matchesFile(e.resource, arg1); });
    };
    HistoryService.prototype.removeFromRecentlyOpened = function (arg1) {
        if (arg1 instanceof EditorInput || arg1 instanceof FileChangesEvent) {
            return; // for now do not delete from file events since recently open are likely out of workspace files for which there are no delete events
        }
        var input = arg1;
        this.windowService.removeFromRecentlyOpened([input.resource]);
    };
    HistoryService.prototype.isFileOpened = function (resource, group) {
        var _this = this;
        if (!group) {
            return false;
        }
        if (!this.editorService.isOpen({ resource: resource }, group)) {
            return false; // fast check
        }
        return group.editors.some(function (e) { return _this.matchesFile(resource, e); });
    };
    HistoryService.prototype.matches = function (arg1, inputB) {
        if (arg1 instanceof FileChangesEvent) {
            if (inputB instanceof EditorInput) {
                return false; // we only support this for IResourceInput
            }
            var resourceInputB_1 = inputB;
            return arg1.contains(resourceInputB_1.resource, 2 /* DELETED */);
        }
        if (arg1 instanceof EditorInput && inputB instanceof EditorInput) {
            return arg1.matches(inputB);
        }
        if (arg1 instanceof EditorInput) {
            return this.matchesFile(inputB.resource, arg1);
        }
        if (inputB instanceof EditorInput) {
            return this.matchesFile(arg1.resource, inputB);
        }
        var resourceInputA = arg1;
        var resourceInputB = inputB;
        return resourceInputA && resourceInputB && resourceInputA.resource.toString() === resourceInputB.resource.toString();
    };
    HistoryService.prototype.matchesFile = function (resource, arg2) {
        if (arg2 instanceof FileChangesEvent) {
            return arg2.contains(resource, 2 /* DELETED */);
        }
        if (arg2 instanceof EditorInput) {
            var inputResource = arg2.getResource();
            if (!inputResource) {
                return false;
            }
            if (this.partService.isCreated() && !this.fileService.canHandleResource(inputResource)) {
                return false; // make sure to only check this when workbench has started (for https://github.com/Microsoft/vscode/issues/48275)
            }
            return inputResource.toString() === resource.toString();
        }
        var resourceInput = arg2;
        return resourceInput && resourceInput.resource.toString() === resource.toString();
    };
    HistoryService.prototype.getHistory = function () {
        this.ensureHistoryLoaded();
        return this.history.slice(0);
    };
    HistoryService.prototype.ensureHistoryLoaded = function () {
        if (!this.loaded) {
            this.loadHistory();
        }
        this.loaded = true;
    };
    HistoryService.prototype.saveHistory = function () {
        if (!this.history) {
            return; // nothing to save because history was not used
        }
        var registry = Registry.as(EditorExtensions.EditorInputFactories);
        var entries = this.history.map(function (input) {
            // Editor input: try via factory
            if (input instanceof EditorInput) {
                var factory = registry.getEditorInputFactory(input.getTypeId());
                if (factory) {
                    var deserialized = factory.serialize(input);
                    if (deserialized) {
                        return { editorInputJSON: { typeId: input.getTypeId(), deserialized: deserialized } };
                    }
                }
            }
            // File resource: via URI.toJSON()
            else {
                return { resourceJSON: input.resource.toJSON() };
            }
            return void 0;
        }).filter(function (serialized) { return !!serialized; });
        this.storageService.store(HistoryService.STORAGE_KEY, JSON.stringify(entries), 1 /* WORKSPACE */);
    };
    HistoryService.prototype.loadHistory = function () {
        var _this = this;
        var entries = [];
        var entriesRaw = this.storageService.get(HistoryService.STORAGE_KEY, 1 /* WORKSPACE */);
        if (entriesRaw) {
            entries = JSON.parse(entriesRaw).filter(function (entry) { return !!entry; });
        }
        var registry = Registry.as(EditorExtensions.EditorInputFactories);
        this.history = entries.map(function (entry) {
            var serializedEditorHistoryEntry = entry;
            // File resource: via URI.revive()
            if (serializedEditorHistoryEntry.resourceJSON) {
                return { resource: URI.revive(serializedEditorHistoryEntry.resourceJSON) };
            }
            // Editor input: via factory
            var editorInputJSON = serializedEditorHistoryEntry.editorInputJSON;
            if (editorInputJSON && editorInputJSON.deserialized) {
                var factory = registry.getEditorInputFactory(editorInputJSON.typeId);
                if (factory) {
                    var input_1 = factory.deserialize(_this.instantiationService, editorInputJSON.deserialized);
                    if (input_1) {
                        once(input_1.onDispose)(function () { return _this.removeFromHistory(input_1); }); // remove from history once disposed
                    }
                    return input_1;
                }
            }
            return void 0;
        }).filter(function (input) { return !!input; });
    };
    HistoryService.prototype.getLastActiveWorkspaceRoot = function (schemeFilter) {
        // No Folder: return early
        var folders = this.contextService.getWorkspace().folders;
        if (folders.length === 0) {
            return void 0;
        }
        // Single Folder: return early
        if (folders.length === 1) {
            var resource = folders[0].uri;
            if (!schemeFilter || resource.scheme === schemeFilter) {
                return resource;
            }
            return void 0;
        }
        // Multiple folders: find the last active one
        var history = this.getHistory();
        for (var i = 0; i < history.length; i++) {
            var input = history[i];
            if (input instanceof EditorInput) {
                continue;
            }
            var resourceInput = input;
            if (schemeFilter && resourceInput.resource.scheme !== schemeFilter) {
                continue;
            }
            var resourceWorkspace = this.contextService.getWorkspaceFolder(resourceInput.resource);
            if (resourceWorkspace) {
                return resourceWorkspace.uri;
            }
        }
        // fallback to first workspace matching scheme filter if any
        for (var i = 0; i < folders.length; i++) {
            var resource = folders[i].uri;
            if (!schemeFilter || resource.scheme === schemeFilter) {
                return resource;
            }
        }
        return void 0;
    };
    HistoryService.prototype.getLastActiveFile = function (schemeFilter) {
        var history = this.getHistory();
        for (var i = 0; i < history.length; i++) {
            var resource = void 0;
            var input = history[i];
            if (input instanceof EditorInput) {
                resource = toResource(input, { filter: schemeFilter });
            }
            else {
                resource = input.resource;
            }
            if (resource && resource.scheme === schemeFilter) {
                return resource;
            }
        }
        return void 0;
    };
    HistoryService.STORAGE_KEY = 'history.entries';
    HistoryService.MAX_HISTORY_ITEMS = 200;
    HistoryService.MAX_STACK_ITEMS = 20;
    HistoryService.MAX_RECENTLY_CLOSED_EDITORS = 20;
    HistoryService = __decorate([
        __param(0, IEditorService),
        __param(1, IEditorGroupsService),
        __param(2, IWorkspaceContextService),
        __param(3, IStorageService),
        __param(4, IConfigurationService),
        __param(5, ILifecycleService),
        __param(6, IFileService),
        __param(7, IWindowsService),
        __param(8, IInstantiationService),
        __param(9, IPartService),
        __param(10, IContextKeyService)
    ], HistoryService);
    return HistoryService;
}(Disposable));
export { HistoryService };

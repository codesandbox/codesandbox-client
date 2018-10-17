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
import * as nls from '../../nls';
import * as objects from '../../base/common/objects';
import * as arrays from '../../base/common/arrays';
import * as strings from '../../base/common/strings';
import * as types from '../../base/common/types';
import { Registry } from '../../platform/registry/common/platform';
import { Action } from '../../base/common/actions';
import { QuickOpenEntry, QuickOpenEntryGroup } from '../../base/parts/quickopen/browser/quickOpenModel';
import { EditorOptions, EditorInput } from '../common/editor';
import { IQuickOpenService } from '../../platform/quickOpen/common/quickOpen';
import { SIDE_GROUP, ACTIVE_GROUP } from '../services/editor/common/editorService';
export var CLOSE_ON_FOCUS_LOST_CONFIG = 'workbench.quickOpen.closeOnFocusLost';
export var PREFILL_CONFIG = 'workbench.quickOpen.prefill';
export var SEARCH_EDITOR_HISTORY = 'search.quickOpen.includeHistory';
var QuickOpenHandler = /** @class */ (function () {
    function QuickOpenHandler() {
    }
    /**
     * A quick open handler returns results for a given input string. The resolved promise
     * returns an instance of quick open model. It is up to the handler to keep and reuse an
     * instance of the same model across multiple calls. This helps in situations where the user is
     * narrowing down a search and the model is just filtering some items out.
     *
     * As such, returning the same model instance across multiple searches will yield best
     * results in terms of performance when many items are shown.
     */
    QuickOpenHandler.prototype.getResults = function (searchValue, token) {
        return Promise.resolve(null);
    };
    /**
     * The ARIA label to apply when this quick open handler is active in quick open.
     */
    QuickOpenHandler.prototype.getAriaLabel = function () {
        return null;
    };
    /**
     * Extra CSS class name to add to the quick open widget to do custom styling of entries.
     */
    QuickOpenHandler.prototype.getClass = function () {
        return null;
    };
    /**
     * Indicates if the handler can run in the current environment. Return a string if the handler cannot run but has
     * a good message to show in this case.
     */
    QuickOpenHandler.prototype.canRun = function () {
        return true;
    };
    /**
     * Hints to the outside that this quick open handler typically returns results fast.
     */
    QuickOpenHandler.prototype.hasShortResponseTime = function () {
        return false;
    };
    /**
     * Indicates if the handler wishes the quick open widget to automatically select the first result entry or an entry
     * based on a specific prefix match.
     */
    QuickOpenHandler.prototype.getAutoFocus = function (searchValue, context) {
        return {};
    };
    /**
     * Indicates to the handler that the quick open widget has been opened.
     */
    QuickOpenHandler.prototype.onOpen = function () {
        return;
    };
    /**
     * Indicates to the handler that the quick open widget has been closed. Allows to free up any resources as needed.
     * The parameter canceled indicates if the quick open widget was closed with an entry being run or not.
     */
    QuickOpenHandler.prototype.onClose = function (canceled) {
        return;
    };
    /**
     * Allows to return a label that will be placed to the side of the results from this handler or null if none.
     */
    QuickOpenHandler.prototype.getGroupLabel = function () {
        return null;
    };
    /**
     * Allows to return a label that will be used when there are no results found
     */
    QuickOpenHandler.prototype.getEmptyLabel = function (searchString) {
        if (searchString.length > 0) {
            return nls.localize('noResultsMatching', "No results matching");
        }
        return nls.localize('noResultsFound2', "No results found");
    };
    return QuickOpenHandler;
}());
export { QuickOpenHandler };
/**
 * A lightweight descriptor of a quick open handler.
 */
var QuickOpenHandlerDescriptor = /** @class */ (function () {
    function QuickOpenHandlerDescriptor(ctor, id, prefix, contextKey, param, instantProgress) {
        if (instantProgress === void 0) { instantProgress = false; }
        this.ctor = ctor;
        this.id = id;
        this.prefix = prefix;
        this.contextKey = contextKey;
        this.instantProgress = instantProgress;
        if (types.isString(param)) {
            this.description = param;
        }
        else {
            this.helpEntries = param;
        }
    }
    QuickOpenHandlerDescriptor.prototype.getId = function () {
        return this.id;
    };
    QuickOpenHandlerDescriptor.prototype.instantiate = function (instantiationService) {
        return instantiationService.createInstance(this.ctor);
    };
    return QuickOpenHandlerDescriptor;
}());
export { QuickOpenHandlerDescriptor };
export var Extensions = {
    Quickopen: 'workbench.contributions.quickopen'
};
var QuickOpenRegistry = /** @class */ (function () {
    function QuickOpenRegistry() {
        this.handlers = [];
    }
    QuickOpenRegistry.prototype.registerQuickOpenHandler = function (descriptor) {
        this.handlers.push(descriptor);
        // sort the handlers by decreasing prefix length, such that longer
        // prefixes take priority: 'ext' vs 'ext install' - the latter should win
        this.handlers.sort(function (h1, h2) { return h2.prefix.length - h1.prefix.length; });
    };
    QuickOpenRegistry.prototype.registerDefaultQuickOpenHandler = function (descriptor) {
        this.defaultHandler = descriptor;
    };
    QuickOpenRegistry.prototype.getQuickOpenHandlers = function () {
        return this.handlers.slice(0);
    };
    QuickOpenRegistry.prototype.getQuickOpenHandler = function (text) {
        return text ? arrays.first(this.handlers, function (h) { return strings.startsWith(text, h.prefix); }, null) : null;
    };
    QuickOpenRegistry.prototype.getDefaultQuickOpenHandler = function () {
        return this.defaultHandler;
    };
    return QuickOpenRegistry;
}());
Registry.add(Extensions.Quickopen, new QuickOpenRegistry());
/**
 * A subclass of quick open entry that will open an editor with input and options when running.
 */
var EditorQuickOpenEntry = /** @class */ (function (_super) {
    __extends(EditorQuickOpenEntry, _super);
    function EditorQuickOpenEntry(_editorService) {
        var _this = _super.call(this) || this;
        _this._editorService = _editorService;
        return _this;
    }
    Object.defineProperty(EditorQuickOpenEntry.prototype, "editorService", {
        get: function () {
            return this._editorService;
        },
        enumerable: true,
        configurable: true
    });
    EditorQuickOpenEntry.prototype.getInput = function () {
        return null;
    };
    EditorQuickOpenEntry.prototype.getOptions = function () {
        return null;
    };
    EditorQuickOpenEntry.prototype.run = function (mode, context) {
        var hideWidget = (mode === 1 /* OPEN */);
        if (mode === 1 /* OPEN */ || mode === 2 /* OPEN_IN_BACKGROUND */) {
            var sideBySide = context.keymods.ctrlCmd;
            var openOptions = void 0;
            if (mode === 2 /* OPEN_IN_BACKGROUND */) {
                openOptions = { pinned: true, preserveFocus: true };
            }
            else if (context.keymods.alt) {
                openOptions = { pinned: true };
            }
            var input = this.getInput();
            if (input instanceof EditorInput) {
                var opts = this.getOptions();
                if (opts) {
                    opts = objects.mixin(opts, openOptions, true);
                }
                else if (openOptions) {
                    opts = EditorOptions.create(openOptions);
                }
                this.editorService.openEditor(input, opts, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
            }
            else {
                var resourceInput = input;
                if (openOptions) {
                    resourceInput.options = objects.assign(resourceInput.options || Object.create(null), openOptions);
                }
                this.editorService.openEditor(resourceInput, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
            }
        }
        return hideWidget;
    };
    return EditorQuickOpenEntry;
}(QuickOpenEntry));
export { EditorQuickOpenEntry };
/**
 * A subclass of quick open entry group that provides access to editor input and options.
 */
var EditorQuickOpenEntryGroup = /** @class */ (function (_super) {
    __extends(EditorQuickOpenEntryGroup, _super);
    function EditorQuickOpenEntryGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditorQuickOpenEntryGroup.prototype.getInput = function () {
        return null;
    };
    EditorQuickOpenEntryGroup.prototype.getOptions = function () {
        return null;
    };
    return EditorQuickOpenEntryGroup;
}(QuickOpenEntryGroup));
export { EditorQuickOpenEntryGroup };
var QuickOpenAction = /** @class */ (function (_super) {
    __extends(QuickOpenAction, _super);
    function QuickOpenAction(id, label, prefix, quickOpenService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickOpenService = quickOpenService;
        _this.prefix = prefix;
        _this.enabled = !!_this.quickOpenService;
        return _this;
    }
    QuickOpenAction.prototype.run = function (context) {
        // Show with prefix
        this.quickOpenService.show(this.prefix);
        return Promise.resolve(null);
    };
    QuickOpenAction = __decorate([
        __param(3, IQuickOpenService)
    ], QuickOpenAction);
    return QuickOpenAction;
}(Action));
export { QuickOpenAction };

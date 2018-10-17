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
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { QuickOpenModel, QuickOpenEntryGroup } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { Extensions, QuickOpenHandler, QuickOpenHandlerDescriptor } from '../../../browser/quickopen.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
export var HELP_PREFIX = '?';
var HelpEntry = /** @class */ (function (_super) {
    __extends(HelpEntry, _super);
    function HelpEntry(prefix, description, quickOpenService, openOnPreview) {
        var _this = _super.call(this) || this;
        if (!prefix) {
            _this.prefix = '';
            _this.prefixLabel = '\u2026' /* ... */;
        }
        else {
            _this.prefix = _this.prefixLabel = prefix;
        }
        _this.description = description;
        _this.quickOpenService = quickOpenService;
        _this.openOnPreview = openOnPreview;
        return _this;
    }
    HelpEntry.prototype.getLabel = function () {
        return this.prefixLabel;
    };
    HelpEntry.prototype.getAriaLabel = function () {
        return nls.localize('entryAriaLabel', "{0}, picker help", this.getLabel());
    };
    HelpEntry.prototype.getDescription = function () {
        return this.description;
    };
    HelpEntry.prototype.run = function (mode, context) {
        if (mode === 1 /* OPEN */ || this.openOnPreview) {
            this.quickOpenService.show(this.prefix);
        }
        return false;
    };
    return HelpEntry;
}(QuickOpenEntryGroup));
var HelpHandler = /** @class */ (function (_super) {
    __extends(HelpHandler, _super);
    function HelpHandler(quickOpenService) {
        var _this = _super.call(this) || this;
        _this.quickOpenService = quickOpenService;
        return _this;
    }
    HelpHandler.prototype.getResults = function (searchValue, token) {
        var _this = this;
        searchValue = searchValue.trim();
        var registry = (Registry.as(Extensions.Quickopen));
        var handlerDescriptors = registry.getQuickOpenHandlers();
        var defaultHandler = registry.getDefaultQuickOpenHandler();
        if (defaultHandler) {
            handlerDescriptors.push(defaultHandler);
        }
        var workbenchScoped = [];
        var editorScoped = [];
        var matchingHandlers = [];
        handlerDescriptors.sort(function (h1, h2) { return h1.prefix.localeCompare(h2.prefix); }).forEach(function (handlerDescriptor) {
            if (handlerDescriptor.prefix !== HELP_PREFIX) {
                // Descriptor has multiple help entries
                if (types.isArray(handlerDescriptor.helpEntries)) {
                    for (var j = 0; j < handlerDescriptor.helpEntries.length; j++) {
                        var helpEntry = handlerDescriptor.helpEntries[j];
                        if (helpEntry.prefix.indexOf(searchValue) === 0) {
                            matchingHandlers.push(helpEntry);
                        }
                    }
                }
                // Single Help entry for descriptor
                else if (handlerDescriptor.prefix.indexOf(searchValue) === 0) {
                    matchingHandlers.push(handlerDescriptor);
                }
            }
        });
        matchingHandlers.forEach(function (handler) {
            if (handler instanceof QuickOpenHandlerDescriptor) {
                workbenchScoped.push(new HelpEntry(handler.prefix, handler.description, _this.quickOpenService, matchingHandlers.length === 1));
            }
            else {
                var entry = new HelpEntry(handler.prefix, handler.description, _this.quickOpenService, matchingHandlers.length === 1);
                if (handler.needsEditor) {
                    editorScoped.push(entry);
                }
                else {
                    workbenchScoped.push(entry);
                }
            }
        });
        // Add separator for workbench scoped handlers
        if (workbenchScoped.length > 0) {
            workbenchScoped[0].setGroupLabel(nls.localize('globalCommands', "global commands"));
        }
        // Add separator for editor scoped handlers
        if (editorScoped.length > 0) {
            editorScoped[0].setGroupLabel(nls.localize('editorCommands', "editor commands"));
            if (workbenchScoped.length > 0) {
                editorScoped[0].setShowBorder(true);
            }
        }
        return TPromise.as(new QuickOpenModel(workbenchScoped.concat(editorScoped)));
    };
    HelpHandler.prototype.getAutoFocus = function (searchValue) {
        searchValue = searchValue.trim();
        return {
            autoFocusFirstEntry: searchValue.length > 0,
            autoFocusPrefixMatch: searchValue
        };
    };
    HelpHandler.ID = 'workbench.picker.help';
    HelpHandler = __decorate([
        __param(0, IQuickOpenService)
    ], HelpHandler);
    return HelpHandler;
}(QuickOpenHandler));
export { HelpHandler };

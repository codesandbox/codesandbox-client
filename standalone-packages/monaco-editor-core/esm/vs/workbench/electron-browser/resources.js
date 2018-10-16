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
import { URI } from '../../base/common/uri';
import * as objects from '../../base/common/objects';
import { IWorkspaceContextService } from '../../platform/workspace/common/workspace';
import { Disposable } from '../../base/common/lifecycle';
import { Emitter } from '../../base/common/event';
import { IConfigurationService } from '../../platform/configuration/common/configuration';
import { parse } from '../../base/common/glob';
import { relative } from '../../../path';
import { normalize } from '../../base/common/paths';
var ResourceGlobMatcher = /** @class */ (function (_super) {
    __extends(ResourceGlobMatcher, _super);
    function ResourceGlobMatcher(globFn, shouldUpdate, contextService, configurationService) {
        var _this = _super.call(this) || this;
        _this.globFn = globFn;
        _this.shouldUpdate = shouldUpdate;
        _this.contextService = contextService;
        _this.configurationService = configurationService;
        _this._onExpressionChange = _this._register(new Emitter());
        _this.mapRootToParsedExpression = new Map();
        _this.mapRootToExpressionConfig = new Map();
        _this.updateExcludes(false);
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(ResourceGlobMatcher.prototype, "onExpressionChange", {
        get: function () { return this._onExpressionChange.event; },
        enumerable: true,
        configurable: true
    });
    ResourceGlobMatcher.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.configurationService.onDidChangeConfiguration(function (e) {
            if (_this.shouldUpdate(e)) {
                _this.updateExcludes(true);
            }
        }));
        this._register(this.contextService.onDidChangeWorkspaceFolders(function () { return _this.updateExcludes(true); }));
    };
    ResourceGlobMatcher.prototype.updateExcludes = function (fromEvent) {
        var _this = this;
        var changed = false;
        // Add excludes per workspaces that got added
        this.contextService.getWorkspace().folders.forEach(function (folder) {
            var rootExcludes = _this.globFn(folder.uri);
            if (!_this.mapRootToExpressionConfig.has(folder.uri.toString()) || !objects.equals(_this.mapRootToExpressionConfig.get(folder.uri.toString()), rootExcludes)) {
                changed = true;
                _this.mapRootToParsedExpression.set(folder.uri.toString(), parse(rootExcludes));
                _this.mapRootToExpressionConfig.set(folder.uri.toString(), objects.deepClone(rootExcludes));
            }
        });
        // Remove excludes per workspace no longer present
        this.mapRootToExpressionConfig.forEach(function (value, root) {
            if (root === ResourceGlobMatcher.NO_ROOT) {
                return; // always keep this one
            }
            if (!_this.contextService.getWorkspaceFolder(URI.parse(root))) {
                _this.mapRootToParsedExpression.delete(root);
                _this.mapRootToExpressionConfig.delete(root);
                changed = true;
            }
        });
        // Always set for resources outside root as well
        var globalExcludes = this.globFn();
        if (!this.mapRootToExpressionConfig.has(ResourceGlobMatcher.NO_ROOT) || !objects.equals(this.mapRootToExpressionConfig.get(ResourceGlobMatcher.NO_ROOT), globalExcludes)) {
            changed = true;
            this.mapRootToParsedExpression.set(ResourceGlobMatcher.NO_ROOT, parse(globalExcludes));
            this.mapRootToExpressionConfig.set(ResourceGlobMatcher.NO_ROOT, objects.deepClone(globalExcludes));
        }
        if (fromEvent && changed) {
            this._onExpressionChange.fire();
        }
    };
    ResourceGlobMatcher.prototype.matches = function (resource) {
        var folder = this.contextService.getWorkspaceFolder(resource);
        var expressionForRoot;
        if (folder && this.mapRootToParsedExpression.has(folder.uri.toString())) {
            expressionForRoot = this.mapRootToParsedExpression.get(folder.uri.toString());
        }
        else {
            expressionForRoot = this.mapRootToParsedExpression.get(ResourceGlobMatcher.NO_ROOT);
        }
        // If the resource if from a workspace, convert its absolute path to a relative
        // path so that glob patterns have a higher probability to match. For example
        // a glob pattern of "src/**" will not match on an absolute path "/folder/src/file.txt"
        // but can match on "src/file.txt"
        var resourcePathToMatch;
        if (folder) {
            resourcePathToMatch = normalize(relative(folder.uri.fsPath, resource.fsPath));
        }
        else {
            resourcePathToMatch = resource.fsPath;
        }
        return !!expressionForRoot(resourcePathToMatch);
    };
    ResourceGlobMatcher.NO_ROOT = null;
    ResourceGlobMatcher = __decorate([
        __param(2, IWorkspaceContextService),
        __param(3, IConfigurationService)
    ], ResourceGlobMatcher);
    return ResourceGlobMatcher;
}(Disposable));
export { ResourceGlobMatcher };

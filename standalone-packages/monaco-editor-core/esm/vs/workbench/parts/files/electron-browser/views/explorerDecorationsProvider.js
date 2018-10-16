/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter } from '../../../../../base/common/event';
import { localize } from '../../../../../nls';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace';
import { listInvalidItemForeground } from '../../../../../platform/theme/common/colorRegistry';
import { dispose } from '../../../../../base/common/lifecycle';
var ExplorerDecorationsProvider = /** @class */ (function () {
    function ExplorerDecorationsProvider(model, contextService) {
        var _this = this;
        this.model = model;
        this.label = localize('label', "Explorer");
        this._onDidChange = new Emitter();
        this.toDispose = [];
        this.toDispose.push(contextService.onDidChangeWorkspaceFolders(function (e) {
            _this._onDidChange.fire(e.changed.concat(e.added).map(function (wf) { return wf.uri; }));
        }));
    }
    Object.defineProperty(ExplorerDecorationsProvider.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    ExplorerDecorationsProvider.prototype.changed = function (uris) {
        this._onDidChange.fire(uris);
    };
    ExplorerDecorationsProvider.prototype.provideDecorations = function (resource) {
        var fileStat = this.model.findClosest(resource);
        if (fileStat && fileStat.isRoot && fileStat.isError) {
            return {
                tooltip: localize('canNotResolve', "Can not resolve workspace folder"),
                letter: '!',
                color: listInvalidItemForeground,
            };
        }
        if (fileStat && fileStat.isSymbolicLink) {
            return {
                tooltip: localize('symbolicLlink', "Symbolic Link"),
                letter: '\u2937'
            };
        }
        return undefined;
    };
    ExplorerDecorationsProvider.prototype.dispose = function () {
        return dispose(this.toDispose);
    };
    ExplorerDecorationsProvider = __decorate([
        __param(1, IWorkspaceContextService)
    ], ExplorerDecorationsProvider);
    return ExplorerDecorationsProvider;
}());
export { ExplorerDecorationsProvider };

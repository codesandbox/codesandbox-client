/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as types from '../../base/common/types';
/**
 * A memento provides access to a datastructure that is persisted and restored as part of the workbench lifecycle.
 */
var Memento = /** @class */ (function () {
    function Memento(id) {
        this.id = Memento.COMMON_PREFIX + id.toLowerCase();
    }
    /**
     * Returns a JSON Object that represents the data of this memento. The optional
     * parameter scope allows to specify the scope of the memento to load. If not
     * provided, the scope will be global, Memento.Scope.WORKSPACE can be used to
     * scope the memento to the workspace.
     */
    Memento.prototype.getMemento = function (storageService, scope) {
        if (scope === void 0) { scope = 0 /* GLOBAL */; }
        // Scope by Workspace
        if (scope === 1 /* WORKSPACE */) {
            var workspaceMemento = Memento.workspaceMementos[this.id];
            if (!workspaceMemento) {
                workspaceMemento = new ScopedMemento(this.id, scope, storageService);
                Memento.workspaceMementos[this.id] = workspaceMemento;
            }
            return workspaceMemento.getMemento();
        }
        // Use global scope
        var globalMemento = Memento.globalMementos[this.id];
        if (!globalMemento) {
            globalMemento = new ScopedMemento(this.id, scope, storageService);
            Memento.globalMementos[this.id] = globalMemento;
        }
        return globalMemento.getMemento();
    };
    /**
     * Saves all data of the mementos that have been loaded to the local storage. This includes
     * global and workspace scope.
     */
    Memento.prototype.saveMemento = function () {
        // Global
        var globalMemento = Memento.globalMementos[this.id];
        if (globalMemento) {
            globalMemento.save();
        }
        // Workspace
        var workspaceMemento = Memento.workspaceMementos[this.id];
        if (workspaceMemento) {
            workspaceMemento.save();
        }
    };
    // Mementos are static to ensure that for a given component with an id only ever one memento gets loaded
    Memento.globalMementos = {};
    Memento.workspaceMementos = {};
    Memento.COMMON_PREFIX = 'memento/';
    return Memento;
}());
export { Memento };
var ScopedMemento = /** @class */ (function () {
    function ScopedMemento(id, scope, storageService) {
        this.storageService = storageService;
        this.id = id;
        this.scope = scope;
        this.mementoObj = this.loadMemento();
    }
    ScopedMemento.prototype.getMemento = function () {
        return this.mementoObj;
    };
    ScopedMemento.prototype.loadMemento = function () {
        var storageScope = this.scope === 0 /* GLOBAL */ ? 0 /* GLOBAL */ : 1 /* WORKSPACE */;
        var memento = this.storageService.get(this.id, storageScope);
        if (memento) {
            return JSON.parse(memento);
        }
        return {};
    };
    ScopedMemento.prototype.save = function () {
        var storageScope = this.scope === 0 /* GLOBAL */ ? 0 /* GLOBAL */ : 1 /* WORKSPACE */;
        if (!types.isEmptyObject(this.mementoObj)) {
            this.storageService.store(this.id, JSON.stringify(this.mementoObj), storageScope);
        }
        else {
            this.storageService.remove(this.id, storageScope);
        }
    };
    return ScopedMemento;
}());

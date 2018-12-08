/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isEmptyObject } from '../../base/common/types.js';
var Memento = /** @class */ (function () {
    function Memento(id, storageService) {
        this.storageService = storageService;
        this.id = Memento.COMMON_PREFIX + id.toLowerCase();
    }
    Memento.prototype.getMemento = function (scope) {
        // Scope by Workspace
        if (scope === 1 /* WORKSPACE */) {
            var workspaceMemento = Memento.workspaceMementos[this.id];
            if (!workspaceMemento) {
                workspaceMemento = new ScopedMemento(this.id, scope, this.storageService);
                Memento.workspaceMementos[this.id] = workspaceMemento;
            }
            return workspaceMemento.getMemento();
        }
        // Scope Global
        var globalMemento = Memento.globalMementos[this.id];
        if (!globalMemento) {
            globalMemento = new ScopedMemento(this.id, scope, this.storageService);
            Memento.globalMementos[this.id] = globalMemento;
        }
        return globalMemento.getMemento();
    };
    Memento.prototype.saveMemento = function () {
        // Workspace
        var workspaceMemento = Memento.workspaceMementos[this.id];
        if (workspaceMemento) {
            workspaceMemento.save();
        }
        // Global
        var globalMemento = Memento.globalMementos[this.id];
        if (globalMemento) {
            globalMemento.save();
        }
    };
    Memento.globalMementos = Object.create(null);
    Memento.workspaceMementos = Object.create(null);
    Memento.COMMON_PREFIX = 'memento/';
    return Memento;
}());
export { Memento };
var ScopedMemento = /** @class */ (function () {
    function ScopedMemento(id, scope, storageService) {
        this.id = id;
        this.scope = scope;
        this.storageService = storageService;
        this.mementoObj = this.load();
    }
    ScopedMemento.prototype.getMemento = function () {
        return this.mementoObj;
    };
    ScopedMemento.prototype.load = function () {
        var memento = this.storageService.get(this.id, this.scope);
        if (memento) {
            return JSON.parse(memento);
        }
        return {};
    };
    ScopedMemento.prototype.save = function () {
        if (!isEmptyObject(this.mementoObj)) {
            this.storageService.store(this.id, JSON.stringify(this.mementoObj), this.scope);
        }
        else {
            this.storageService.remove(this.id, this.scope);
        }
    };
    return ScopedMemento;
}());

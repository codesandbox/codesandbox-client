/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as Types from '../../../../base/common/types';
import * as Objects from '../../../../base/common/objects';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey';
export var TASK_RUNNING_STATE = new RawContextKey('taskRunning', false);
export var ShellQuoting;
(function (ShellQuoting) {
    /**
     * Use character escaping.
     */
    ShellQuoting[ShellQuoting["Escape"] = 1] = "Escape";
    /**
     * Use strong quoting
     */
    ShellQuoting[ShellQuoting["Strong"] = 2] = "Strong";
    /**
     * Use weak quoting.
     */
    ShellQuoting[ShellQuoting["Weak"] = 3] = "Weak";
})(ShellQuoting || (ShellQuoting = {}));
(function (ShellQuoting) {
    function from(value) {
        if (!value) {
            return ShellQuoting.Strong;
        }
        switch (value.toLowerCase()) {
            case 'escape':
                return ShellQuoting.Escape;
            case 'strong':
                return ShellQuoting.Strong;
            case 'weak':
                return ShellQuoting.Weak;
            default:
                return ShellQuoting.Strong;
        }
    }
    ShellQuoting.from = from;
})(ShellQuoting || (ShellQuoting = {}));
export var RevealKind;
(function (RevealKind) {
    /**
     * Always brings the terminal to front if the task is executed.
     */
    RevealKind[RevealKind["Always"] = 1] = "Always";
    /**
     * Only brings the terminal to front if a problem is detected executing the task
     * (e.g. the task couldn't be started because).
     */
    RevealKind[RevealKind["Silent"] = 2] = "Silent";
    /**
     * The terminal never comes to front when the task is executed.
     */
    RevealKind[RevealKind["Never"] = 3] = "Never";
})(RevealKind || (RevealKind = {}));
(function (RevealKind) {
    function fromString(value) {
        switch (value.toLowerCase()) {
            case 'always':
                return RevealKind.Always;
            case 'silent':
                return RevealKind.Silent;
            case 'never':
                return RevealKind.Never;
            default:
                return RevealKind.Always;
        }
    }
    RevealKind.fromString = fromString;
})(RevealKind || (RevealKind = {}));
export var PanelKind;
(function (PanelKind) {
    /**
     * Shares a panel with other tasks. This is the default.
     */
    PanelKind[PanelKind["Shared"] = 1] = "Shared";
    /**
     * Uses a dedicated panel for this tasks. The panel is not
     * shared with other tasks.
     */
    PanelKind[PanelKind["Dedicated"] = 2] = "Dedicated";
    /**
     * Creates a new panel whenever this task is executed.
     */
    PanelKind[PanelKind["New"] = 3] = "New";
})(PanelKind || (PanelKind = {}));
(function (PanelKind) {
    function fromString(value) {
        switch (value.toLowerCase()) {
            case 'shared':
                return PanelKind.Shared;
            case 'dedicated':
                return PanelKind.Dedicated;
            case 'new':
                return PanelKind.New;
            default:
                return PanelKind.Shared;
        }
    }
    PanelKind.fromString = fromString;
})(PanelKind || (PanelKind = {}));
export var RuntimeType;
(function (RuntimeType) {
    RuntimeType[RuntimeType["Shell"] = 1] = "Shell";
    RuntimeType[RuntimeType["Process"] = 2] = "Process";
})(RuntimeType || (RuntimeType = {}));
(function (RuntimeType) {
    function fromString(value) {
        switch (value.toLowerCase()) {
            case 'shell':
                return RuntimeType.Shell;
            case 'process':
                return RuntimeType.Process;
            default:
                return RuntimeType.Process;
        }
    }
    RuntimeType.fromString = fromString;
})(RuntimeType || (RuntimeType = {}));
export var CommandString;
(function (CommandString) {
    function value(value) {
        if (Types.isString(value)) {
            return value;
        }
        else {
            return value.value;
        }
    }
    CommandString.value = value;
})(CommandString || (CommandString = {}));
export var TaskGroup;
(function (TaskGroup) {
    TaskGroup.Clean = 'clean';
    TaskGroup.Build = 'build';
    TaskGroup.Rebuild = 'rebuild';
    TaskGroup.Test = 'test';
    function is(value) {
        return value === TaskGroup.Clean || value === TaskGroup.Build || value === TaskGroup.Rebuild || value === TaskGroup.Test;
    }
    TaskGroup.is = is;
})(TaskGroup || (TaskGroup = {}));
export var TaskSourceKind;
(function (TaskSourceKind) {
    TaskSourceKind.Workspace = 'workspace';
    TaskSourceKind.Extension = 'extension';
    TaskSourceKind.InMemory = 'inMemory';
})(TaskSourceKind || (TaskSourceKind = {}));
export var CustomTask;
(function (CustomTask) {
    function is(value) {
        var candidate = value;
        return candidate && candidate.type === 'custom';
    }
    CustomTask.is = is;
    function getDefinition(task) {
        var type;
        if (task.command !== void 0) {
            type = task.command.runtime === RuntimeType.Shell ? 'shell' : 'process';
        }
        else {
            type = '$composite';
        }
        var result = {
            type: type,
            _key: task._id,
            id: task._id
        };
        return result;
    }
    CustomTask.getDefinition = getDefinition;
    function customizes(task) {
        if (task._source && task._source.customizes) {
            return task._source.customizes;
        }
        return undefined;
    }
    CustomTask.customizes = customizes;
})(CustomTask || (CustomTask = {}));
export var ConfiguringTask;
(function (ConfiguringTask) {
    function is(value) {
        var candidate = value;
        return candidate && candidate.configures && Types.isString(candidate.configures.type) && value.command === void 0;
    }
    ConfiguringTask.is = is;
})(ConfiguringTask || (ConfiguringTask = {}));
export var ContributedTask;
(function (ContributedTask) {
    function is(value) {
        var candidate = value;
        return candidate && candidate.defines && Types.isString(candidate.defines.type) && candidate.command !== void 0;
    }
    ContributedTask.is = is;
})(ContributedTask || (ContributedTask = {}));
export var InMemoryTask;
(function (InMemoryTask) {
    function is(value) {
        var candidate = value;
        return candidate && candidate._source && candidate._source.kind === TaskSourceKind.InMemory;
    }
    InMemoryTask.is = is;
})(InMemoryTask || (InMemoryTask = {}));
export var Task;
(function (Task) {
    function getRecentlyUsedKey(task) {
        if (InMemoryTask.is(task)) {
            return undefined;
        }
        if (CustomTask.is(task)) {
            var workspaceFolder = task._source.config.workspaceFolder;
            if (!workspaceFolder) {
                return undefined;
            }
            var key = { type: 'custom', folder: workspaceFolder.uri.toString(), id: task.identifier };
            return JSON.stringify(key);
        }
        if (ContributedTask.is(task)) {
            var key = { type: 'contributed', scope: task._source.scope, id: task._id };
            if (task._source.scope === 3 /* Folder */ && task._source.workspaceFolder) {
                key.folder = task._source.workspaceFolder.uri.toString();
            }
            return JSON.stringify(key);
        }
        return undefined;
    }
    Task.getRecentlyUsedKey = getRecentlyUsedKey;
    function getMapKey(task) {
        if (CustomTask.is(task)) {
            var workspaceFolder = task._source.config.workspaceFolder;
            return workspaceFolder ? workspaceFolder.uri.toString() + "|" + task._id : task._id;
        }
        else if (ContributedTask.is(task)) {
            var workspaceFolder = task._source.workspaceFolder;
            return workspaceFolder
                ? task._source.scope.toString() + "|" + workspaceFolder.uri.toString() + "|" + task._id
                : task._source.scope.toString() + "|" + task._id;
        }
        else {
            return task._id;
        }
    }
    Task.getMapKey = getMapKey;
    function getWorkspaceFolder(task) {
        if (CustomTask.is(task)) {
            return task._source.config.workspaceFolder;
        }
        else if (ContributedTask.is(task)) {
            return task._source.workspaceFolder;
        }
        else {
            return undefined;
        }
    }
    Task.getWorkspaceFolder = getWorkspaceFolder;
    function clone(task) {
        return Objects.assign({}, task);
    }
    Task.clone = clone;
    function getTelemetryKind(task) {
        if (ContributedTask.is(task)) {
            return 'extension';
        }
        else if (CustomTask.is(task)) {
            if (task._source.customizes) {
                return 'workspace>extension';
            }
            else {
                return 'workspace';
            }
        }
        else if (InMemoryTask.is(task)) {
            return 'composite';
        }
        else {
            return 'unknown';
        }
    }
    Task.getTelemetryKind = getTelemetryKind;
    function matches(task, key, compareId) {
        if (compareId === void 0) { compareId = false; }
        if (key === void 0) {
            return false;
        }
        if (Types.isString(key)) {
            return key === task._label || key === task.identifier || (compareId && key === task._id);
        }
        var identifier = Task.getTaskDefinition(task, true);
        return identifier !== void 0 && identifier._key === key._key;
    }
    Task.matches = matches;
    function getQualifiedLabel(task) {
        var workspaceFolder = getWorkspaceFolder(task);
        if (workspaceFolder) {
            return task._label + " (" + workspaceFolder.name + ")";
        }
        else {
            return task._label;
        }
    }
    Task.getQualifiedLabel = getQualifiedLabel;
    function getTaskDefinition(task, useSource) {
        if (useSource === void 0) { useSource = false; }
        if (ContributedTask.is(task)) {
            return task.defines;
        }
        else if (CustomTask.is(task)) {
            if (useSource && task._source.customizes !== void 0) {
                return task._source.customizes;
            }
            else {
                return CustomTask.getDefinition(task);
            }
        }
        else {
            return undefined;
        }
    }
    Task.getTaskDefinition = getTaskDefinition;
    function getTaskExecution(task) {
        var result = {
            id: task._id,
            task: task
        };
        return result;
    }
    Task.getTaskExecution = getTaskExecution;
})(Task || (Task = {}));
export var ExecutionEngine;
(function (ExecutionEngine) {
    ExecutionEngine[ExecutionEngine["Process"] = 1] = "Process";
    ExecutionEngine[ExecutionEngine["Terminal"] = 2] = "Terminal";
})(ExecutionEngine || (ExecutionEngine = {}));
(function (ExecutionEngine) {
    ExecutionEngine._default = ExecutionEngine.Terminal;
})(ExecutionEngine || (ExecutionEngine = {}));
var TaskSorter = /** @class */ (function () {
    function TaskSorter(workspaceFolders) {
        this._order = new Map();
        for (var i = 0; i < workspaceFolders.length; i++) {
            this._order.set(workspaceFolders[i].uri.toString(), i);
        }
    }
    TaskSorter.prototype.compare = function (a, b) {
        var aw = Task.getWorkspaceFolder(a);
        var bw = Task.getWorkspaceFolder(b);
        if (aw && bw) {
            var ai = this._order.get(aw.uri.toString());
            ai = ai === void 0 ? 0 : ai + 1;
            var bi = this._order.get(bw.uri.toString());
            bi = bi === void 0 ? 0 : bi + 1;
            if (ai === bi) {
                return a._label.localeCompare(b._label);
            }
            else {
                return ai - bi;
            }
        }
        else if (!aw && bw) {
            return -1;
        }
        else if (aw && !bw) {
            return +1;
        }
        else {
            return 0;
        }
    };
    return TaskSorter;
}());
export { TaskSorter };
export var TaskEvent;
(function (TaskEvent) {
    function create(kind, task, processIdOrExitCode) {
        if (task) {
            var result = {
                kind: kind,
                taskId: task._id,
                taskName: task.name,
                runType: task.isBackground ? "background" /* Background */ : "singleRun" /* SingleRun */,
                group: task.group,
                processId: undefined,
                exitCode: undefined,
                __task: task,
            };
            if (kind === "processStarted" /* ProcessStarted */) {
                result.processId = processIdOrExitCode;
            }
            else if (kind === "processEnded" /* ProcessEnded */) {
                result.exitCode = processIdOrExitCode;
            }
            return Object.freeze(result);
        }
        else {
            return Object.freeze({ kind: "changed" /* Changed */ });
        }
    }
    TaskEvent.create = create;
})(TaskEvent || (TaskEvent = {}));

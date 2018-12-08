/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from '../../../../path.js';
import { URI } from '../../../base/common/uri.js';
import * as nls from '../../../nls.js';
import * as Objects from '../../../base/common/objects.js';
import { asThenable } from '../../../base/common/async.js';
import { Emitter } from '../../../base/common/event.js';
import { win32 } from '../../../base/node/processes.js';
import * as tasks from '../../parts/tasks/common/tasks.js';
import { MainContext } from './extHost.protocol.js';
import * as types from './extHostTypes.js';
import { ExtHostVariableResolverService } from './extHostDebugService.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
/*
namespace ProblemPattern {
    export function from(value: vscode.ProblemPattern | vscode.MultiLineProblemPattern): Problems.ProblemPattern | Problems.MultiLineProblemPattern {
        if (value === void 0 || value === null) {
            return undefined;
        }
        if (Array.isArray(value)) {
            let result: Problems.ProblemPattern[] = [];
            for (let pattern of value) {
                let converted = fromSingle(pattern);
                if (!converted) {
                    return undefined;
                }
                result.push(converted);
            }
            return result;
        } else {
            return fromSingle(value);
        }
    }

    function copyProperty(target: Problems.ProblemPattern, source: vscode.ProblemPattern, tk: keyof Problems.ProblemPattern) {
        let sk: keyof vscode.ProblemPattern = tk;
        let value = source[sk];
        if (typeof value === 'number') {
            target[tk] = value;
        }
    }

    function getValue(value: number, defaultValue: number): number {
        if (value !== void 0 && value === null) {
            return value;
        }
        return defaultValue;
    }

    function fromSingle(problemPattern: vscode.ProblemPattern): Problems.ProblemPattern {
        if (problemPattern === void 0 || problemPattern === null || !(problemPattern.regexp instanceof RegExp)) {
            return undefined;
        }
        let result: Problems.ProblemPattern = {
            regexp: problemPattern.regexp
        };
        copyProperty(result, problemPattern, 'file');
        copyProperty(result, problemPattern, 'location');
        copyProperty(result, problemPattern, 'line');
        copyProperty(result, problemPattern, 'character');
        copyProperty(result, problemPattern, 'endLine');
        copyProperty(result, problemPattern, 'endCharacter');
        copyProperty(result, problemPattern, 'severity');
        copyProperty(result, problemPattern, 'code');
        copyProperty(result, problemPattern, 'message');
        if (problemPattern.loop === true || problemPattern.loop === false) {
            result.loop = problemPattern.loop;
        }
        if (result.location) {
            result.file = getValue(result.file, 1);
            result.message = getValue(result.message, 0);
        } else {
            result.file = getValue(result.file, 1);
            result.line = getValue(result.line, 2);
            result.character = getValue(result.character, 3);
            result.message = getValue(result.message, 0);
        }
        return result;
    }
}

namespace ApplyTo {
    export function from(value: vscode.ApplyToKind): Problems.ApplyToKind {
        if (value === void 0 || value === null) {
            return Problems.ApplyToKind.allDocuments;
        }
        switch (value) {
            case types.ApplyToKind.OpenDocuments:
                return Problems.ApplyToKind.openDocuments;
            case types.ApplyToKind.ClosedDocuments:
                return Problems.ApplyToKind.closedDocuments;
        }
        return Problems.ApplyToKind.allDocuments;
    }
}

namespace FileLocation {
    export function from(value: vscode.FileLocationKind | string): { kind: Problems.FileLocationKind; prefix?: string } {
        if (value === void 0 || value === null) {
            return { kind: Problems.FileLocationKind.Auto };
        }
        if (typeof value === 'string') {
            return { kind: Problems.FileLocationKind.Relative, prefix: value };
        }
        switch (value) {
            case types.FileLocationKind.Absolute:
                return { kind: Problems.FileLocationKind.Absolute };
            case types.FileLocationKind.Relative:
                return { kind: Problems.FileLocationKind.Relative, prefix: '${workspaceFolder}' };
        }
        return { kind: Problems.FileLocationKind.Auto };
    }
}

namespace WatchingPattern {
    export function from(value: RegExp | vscode.BackgroundPattern): Problems.WatchingPattern {
        if (value === void 0 || value === null) {
            return undefined;
        }
        if (value instanceof RegExp) {
            return { regexp: value };
        }
        if (!(value.regexp instanceof RegExp)) {
            return undefined;
        }
        let result: Problems.WatchingPattern = {
            regexp: value.regexp
        };
        if (typeof value.file === 'number') {
            result.file = value.file;
        }
        return result;
    }
}

namespace BackgroundMonitor {
    export function from(value: vscode.BackgroundMonitor): Problems.WatchingMatcher {
        if (value === void 0 || value === null) {
            return undefined;
        }
        let result: Problems.WatchingMatcher = {
            activeOnStart: !!value.activeOnStart,
            beginsPattern: WatchingPattern.from(value.beginsPattern),
            endsPattern: WatchingPattern.from(value.endsPattern)
        };
        return result;
    }
}

namespace ProblemMatcher {
    export function from(values: (string | vscode.ProblemMatcher)[]): (string | Problems.ProblemMatcher)[] {
        if (values === void 0 || values === null) {
            return undefined;
        }
        let result: (string | Problems.ProblemMatcher)[] = [];
        for (let value of values) {
            let converted = typeof value === 'string' ? value : fromSingle(value);
            if (converted) {
                result.push(converted);
            }
        }
        return result;
    }

    function fromSingle(problemMatcher: vscode.ProblemMatcher): Problems.ProblemMatcher {
        if (problemMatcher === void 0 || problemMatcher === null) {
            return undefined;
        }

        let location = FileLocation.from(problemMatcher.fileLocation);
        let result: Problems.ProblemMatcher = {
            owner: typeof problemMatcher.owner === 'string' ? problemMatcher.owner : UUID.generateUuid(),
            applyTo: ApplyTo.from(problemMatcher.applyTo),
            fileLocation: location.kind,
            filePrefix: location.prefix,
            pattern: ProblemPattern.from(problemMatcher.pattern),
            severity: fromDiagnosticSeverity(problemMatcher.severity),
        };
        return result;
    }
}
*/
var TaskRevealKind;
(function (TaskRevealKind) {
    function from(value) {
        if (value === void 0 || value === null) {
            return tasks.RevealKind.Always;
        }
        switch (value) {
            case types.TaskRevealKind.Silent:
                return tasks.RevealKind.Silent;
            case types.TaskRevealKind.Never:
                return tasks.RevealKind.Never;
        }
        return tasks.RevealKind.Always;
    }
    TaskRevealKind.from = from;
})(TaskRevealKind || (TaskRevealKind = {}));
var TaskPanelKind;
(function (TaskPanelKind) {
    function from(value) {
        if (value === void 0 || value === null) {
            return tasks.PanelKind.Shared;
        }
        switch (value) {
            case types.TaskPanelKind.Dedicated:
                return tasks.PanelKind.Dedicated;
            case types.TaskPanelKind.New:
                return tasks.PanelKind.New;
            default:
                return tasks.PanelKind.Shared;
        }
    }
    TaskPanelKind.from = from;
})(TaskPanelKind || (TaskPanelKind = {}));
var PresentationOptions;
(function (PresentationOptions) {
    function from(value) {
        if (value === void 0 || value === null) {
            return { reveal: tasks.RevealKind.Always, echo: true, focus: false, panel: tasks.PanelKind.Shared, showReuseMessage: true, clear: false };
        }
        return {
            reveal: TaskRevealKind.from(value.reveal),
            echo: value.echo === void 0 ? true : !!value.echo,
            focus: !!value.focus,
            panel: TaskPanelKind.from(value.panel),
            showReuseMessage: value.showReuseMessage === void 0 ? true : !!value.showReuseMessage,
            clear: value.clear === void 0 ? false : !!value.clear,
        };
    }
    PresentationOptions.from = from;
})(PresentationOptions || (PresentationOptions = {}));
var Strings;
(function (Strings) {
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var element = value_1[_i];
            if (typeof element !== 'string') {
                return [];
            }
        }
        return value;
    }
    Strings.from = from;
})(Strings || (Strings = {}));
var CommandOptions;
(function (CommandOptions) {
    function isShellConfiguration(value) {
        return value && typeof value.executable === 'string';
    }
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        var result = {};
        if (typeof value.cwd === 'string') {
            result.cwd = value.cwd;
        }
        if (value.env) {
            result.env = Object.create(null);
            Object.keys(value.env).forEach(function (key) {
                var envValue = value.env[key];
                if (typeof envValue === 'string') {
                    result.env[key] = envValue;
                }
            });
        }
        if (isShellConfiguration(value)) {
            result.shell = ShellConfiguration.from(value);
        }
        return result;
    }
    CommandOptions.from = from;
})(CommandOptions || (CommandOptions = {}));
var ShellQuoteOptions;
(function (ShellQuoteOptions) {
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return {
            escape: value.escape,
            strong: value.strong,
            weak: value.strong
        };
    }
    ShellQuoteOptions.from = from;
})(ShellQuoteOptions || (ShellQuoteOptions = {}));
var ShellConfiguration;
(function (ShellConfiguration) {
    function from(value) {
        if (value === void 0 || value === null || !value.executable) {
            return undefined;
        }
        var result = {
            executable: value.executable,
            args: Strings.from(value.shellArgs),
            quoting: ShellQuoteOptions.from(value.quotes)
        };
        return result;
    }
    ShellConfiguration.from = from;
})(ShellConfiguration || (ShellConfiguration = {}));
var ShellString;
(function (ShellString) {
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value.slice(0);
    }
    ShellString.from = from;
})(ShellString || (ShellString = {}));
var Tasks;
(function (Tasks) {
    function from(tasks, rootFolder, extension) {
        if (tasks === void 0 || tasks === null) {
            return [];
        }
        var result = [];
        for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
            var task = tasks_1[_i];
            var converted = fromSingle(task, rootFolder, extension);
            if (converted) {
                result.push(converted);
            }
        }
        return result;
    }
    Tasks.from = from;
    function fromSingle(task, rootFolder, extension) {
        if (typeof task.name !== 'string') {
            return undefined;
        }
        var command;
        var execution = task.execution;
        if (execution instanceof types.ProcessExecution) {
            command = getProcessCommand(execution);
        }
        else if (execution instanceof types.ShellExecution) {
            command = getShellCommand(execution);
        }
        else {
            return undefined;
        }
        if (command === void 0) {
            return undefined;
        }
        command.presentation = PresentationOptions.from(task.presentationOptions);
        var taskScope = task.scope;
        var workspaceFolder;
        var scope;
        // For backwards compatibility
        if (taskScope === void 0) {
            scope = 3 /* Folder */;
            workspaceFolder = rootFolder;
        }
        else if (taskScope === types.TaskScope.Global) {
            scope = 1 /* Global */;
        }
        else if (taskScope === types.TaskScope.Workspace) {
            scope = 2 /* Workspace */;
        }
        else {
            scope = 3 /* Folder */;
            workspaceFolder = taskScope;
        }
        var source = {
            kind: tasks.TaskSourceKind.Extension,
            label: typeof task.source === 'string' ? task.source : extension.name,
            extension: extension.id,
            scope: scope,
            workspaceFolder: undefined
        };
        // We can't transfer a workspace folder object from the extension host to main since they differ
        // in shape and we don't have backwards converting function. So transfer the URI and resolve the
        // workspace folder on the main side.
        source.__workspaceFolder = workspaceFolder ? workspaceFolder.uri : undefined;
        source.__definition = task.definition;
        var label = nls.localize('task.label', '{0}: {1}', source.label, task.name);
        // The definition id will be prefix on the main side since we compute it there.
        var id = "" + extension.id;
        var result = {
            _id: id,
            _source: source,
            _label: label,
            type: task.definition.type,
            defines: undefined,
            name: task.name,
            identifier: label,
            group: task.group ? task.group.id : undefined,
            command: command,
            isBackground: !!task.isBackground,
            problemMatchers: task.problemMatchers.slice(),
            hasDefinedMatchers: task.hasDefinedMatchers
        };
        return result;
    }
    function getProcessCommand(value) {
        if (typeof value.process !== 'string') {
            return undefined;
        }
        var result = {
            name: value.process,
            args: Strings.from(value.args),
            runtime: tasks.RuntimeType.Process,
            suppressTaskName: true,
            presentation: undefined
        };
        if (value.options) {
            result.options = CommandOptions.from(value.options);
        }
        return result;
    }
    function getShellCommand(value) {
        if (value.args) {
            if (typeof value.command !== 'string' && typeof value.command.value !== 'string') {
                return undefined;
            }
            var result = {
                name: value.command,
                args: ShellString.from(value.args),
                runtime: tasks.RuntimeType.Shell,
                presentation: undefined
            };
            if (value.options) {
                result.options = CommandOptions.from(value.options);
            }
            return result;
        }
        else {
            if (typeof value.commandLine !== 'string') {
                return undefined;
            }
            var result = {
                name: value.commandLine,
                runtime: tasks.RuntimeType.Shell,
                presentation: undefined
            };
            if (value.options) {
                result.options = CommandOptions.from(value.options);
            }
            return result;
        }
    }
})(Tasks || (Tasks = {}));
var TaskDefinitionDTO;
(function (TaskDefinitionDTO) {
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    TaskDefinitionDTO.from = from;
    function to(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    TaskDefinitionDTO.to = to;
})(TaskDefinitionDTO || (TaskDefinitionDTO = {}));
var TaskPresentationOptionsDTO;
(function (TaskPresentationOptionsDTO) {
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    TaskPresentationOptionsDTO.from = from;
    function to(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    TaskPresentationOptionsDTO.to = to;
})(TaskPresentationOptionsDTO || (TaskPresentationOptionsDTO = {}));
var ProcessExecutionOptionsDTO;
(function (ProcessExecutionOptionsDTO) {
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    ProcessExecutionOptionsDTO.from = from;
    function to(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    ProcessExecutionOptionsDTO.to = to;
})(ProcessExecutionOptionsDTO || (ProcessExecutionOptionsDTO = {}));
var ProcessExecutionDTO;
(function (ProcessExecutionDTO) {
    function is(value) {
        var candidate = value;
        return candidate && !!candidate.process;
    }
    ProcessExecutionDTO.is = is;
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        var result = {
            process: value.process,
            args: value.args
        };
        if (value.options) {
            result.options = ProcessExecutionOptionsDTO.from(value.options);
        }
        return result;
    }
    ProcessExecutionDTO.from = from;
    function to(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return new types.ProcessExecution(value.process, value.args, value.options);
    }
    ProcessExecutionDTO.to = to;
})(ProcessExecutionDTO || (ProcessExecutionDTO = {}));
var ShellExecutionOptionsDTO;
(function (ShellExecutionOptionsDTO) {
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    ShellExecutionOptionsDTO.from = from;
    function to(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        return value;
    }
    ShellExecutionOptionsDTO.to = to;
})(ShellExecutionOptionsDTO || (ShellExecutionOptionsDTO = {}));
var ShellExecutionDTO;
(function (ShellExecutionDTO) {
    function is(value) {
        var candidate = value;
        return candidate && (!!candidate.commandLine || !!candidate.command);
    }
    ShellExecutionDTO.is = is;
    function from(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        var result = {};
        if (value.commandLine !== void 0) {
            result.commandLine = value.commandLine;
        }
        else {
            result.command = value.command;
            result.args = value.args;
        }
        if (value.options) {
            result.options = ShellExecutionOptionsDTO.from(value.options);
        }
        return result;
    }
    ShellExecutionDTO.from = from;
    function to(value) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        if (value.commandLine) {
            return new types.ShellExecution(value.commandLine, value.options);
        }
        else {
            return new types.ShellExecution(value.command, value.args ? value.args : [], value.options);
        }
    }
    ShellExecutionDTO.to = to;
})(ShellExecutionDTO || (ShellExecutionDTO = {}));
var TaskHandleDTO;
(function (TaskHandleDTO) {
    function from(value) {
        var folder;
        if (value.scope !== void 0 && typeof value.scope !== 'number') {
            folder = value.scope.uri;
        }
        return {
            id: value._id,
            workspaceFolder: folder
        };
    }
    TaskHandleDTO.from = from;
})(TaskHandleDTO || (TaskHandleDTO = {}));
var TaskDTO;
(function (TaskDTO) {
    function from(value, extension) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        var execution;
        if (value.execution instanceof types.ProcessExecution) {
            execution = ProcessExecutionDTO.from(value.execution);
        }
        else if (value.execution instanceof types.ShellExecution) {
            execution = ShellExecutionDTO.from(value.execution);
        }
        var definition = TaskDefinitionDTO.from(value.definition);
        var scope;
        if (value.scope) {
            if (typeof value.scope === 'number') {
                scope = value.scope;
            }
            else {
                scope = value.scope.uri;
            }
        }
        if (!definition || !scope) {
            return undefined;
        }
        var group = value.group ? value.group.id : undefined;
        var result = {
            _id: value._id,
            definition: definition,
            name: value.name,
            source: {
                extensionId: extension.id,
                label: value.source,
                scope: scope
            },
            execution: execution,
            isBackground: value.isBackground,
            group: group,
            presentationOptions: TaskPresentationOptionsDTO.from(value.presentationOptions),
            problemMatchers: value.problemMatchers,
            hasDefinedMatchers: value.hasDefinedMatchers
        };
        return result;
    }
    TaskDTO.from = from;
    function to(value, workspace) {
        if (value === void 0 || value === null) {
            return undefined;
        }
        var execution;
        if (ProcessExecutionDTO.is(value.execution)) {
            execution = ProcessExecutionDTO.to(value.execution);
        }
        else if (ShellExecutionDTO.is(value.execution)) {
            execution = ShellExecutionDTO.to(value.execution);
        }
        var definition = TaskDefinitionDTO.to(value.definition);
        var scope;
        if (value.source) {
            if (value.source.scope !== void 0) {
                if (typeof value.source.scope === 'number') {
                    scope = value.source.scope;
                }
                else {
                    scope = workspace.resolveWorkspaceFolder(URI.revive(value.source.scope));
                }
            }
            else {
                scope = types.TaskScope.Workspace;
            }
        }
        if (!definition || !scope) {
            return undefined;
        }
        var result = new types.Task(definition, scope, value.name, value.source.label, execution, value.problemMatchers);
        if (value.isBackground !== void 0) {
            result.isBackground = value.isBackground;
        }
        if (value.group !== void 0) {
            result.group = types.TaskGroup.from(value.group);
        }
        if (value.presentationOptions) {
            result.presentationOptions = TaskPresentationOptionsDTO.to(value.presentationOptions);
        }
        if (value._id) {
            result._id = value._id;
        }
        return result;
    }
    TaskDTO.to = to;
})(TaskDTO || (TaskDTO = {}));
var TaskFilterDTO;
(function (TaskFilterDTO) {
    function from(value) {
        return value;
    }
    TaskFilterDTO.from = from;
    function to(value) {
        if (!value) {
            return undefined;
        }
        return Objects.assign(Object.create(null), value);
    }
    TaskFilterDTO.to = to;
})(TaskFilterDTO || (TaskFilterDTO = {}));
var TaskExecutionImpl = /** @class */ (function () {
    function TaskExecutionImpl(_tasks, _id, _task) {
        this._tasks = _tasks;
        this._id = _id;
        this._task = _task;
    }
    Object.defineProperty(TaskExecutionImpl.prototype, "task", {
        get: function () {
            return this._task;
        },
        enumerable: true,
        configurable: true
    });
    TaskExecutionImpl.prototype.terminate = function () {
        this._tasks.terminateTask(this);
    };
    TaskExecutionImpl.prototype.fireDidStartProcess = function (value) {
    };
    TaskExecutionImpl.prototype.fireDidEndProcess = function (value) {
    };
    return TaskExecutionImpl;
}());
var TaskExecutionDTO;
(function (TaskExecutionDTO) {
    function to(value, tasks) {
        return new TaskExecutionImpl(tasks, value.id, TaskDTO.to(value.task, tasks.extHostWorkspace));
    }
    TaskExecutionDTO.to = to;
    function from(value) {
        return {
            id: value._id,
            task: undefined
        };
    }
    TaskExecutionDTO.from = from;
})(TaskExecutionDTO || (TaskExecutionDTO = {}));
var ExtHostTask = /** @class */ (function () {
    function ExtHostTask(mainContext, workspaceService, editorService, configurationService) {
        this._onDidExecuteTask = new Emitter();
        this._onDidTerminateTask = new Emitter();
        this._onDidTaskProcessStarted = new Emitter();
        this._onDidTaskProcessEnded = new Emitter();
        this._proxy = mainContext.getProxy(MainContext.MainThreadTask);
        this._workspaceService = workspaceService;
        this._editorService = editorService;
        this._configurationService = configurationService;
        this._handleCounter = 0;
        this._handlers = new Map();
        this._taskExecutions = new Map();
    }
    Object.defineProperty(ExtHostTask.prototype, "extHostWorkspace", {
        get: function () {
            return this._workspaceService;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTask.prototype.registerTaskProvider = function (extension, provider) {
        var _this = this;
        if (!provider) {
            return new types.Disposable(function () { });
        }
        var handle = this.nextHandle();
        this._handlers.set(handle, { provider: provider, extension: extension });
        this._proxy.$registerTaskProvider(handle);
        return new types.Disposable(function () {
            _this._handlers.delete(handle);
            _this._proxy.$unregisterTaskProvider(handle);
        });
    };
    ExtHostTask.prototype.registerTaskSystem = function (scheme, info) {
        this._proxy.$registerTaskSystem(scheme, info);
    };
    ExtHostTask.prototype.fetchTasks = function (filter) {
        var _this = this;
        return this._proxy.$fetchTasks(TaskFilterDTO.from(filter)).then(function (values) {
            var result = [];
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                var task = TaskDTO.to(value, _this._workspaceService);
                if (task) {
                    result.push(task);
                }
            }
            return result;
        });
    };
    ExtHostTask.prototype.executeTask = function (extension, task) {
        var _this = this;
        var tTask = task;
        // We have a preserved ID. So the task didn't change.
        if (tTask._id !== void 0) {
            return this._proxy.$executeTask(TaskHandleDTO.from(tTask)).then(function (value) { return _this.getTaskExecution(value, task); });
        }
        else {
            var dto = TaskDTO.from(task, extension);
            if (dto === void 0) {
                return Promise.reject(new Error('Task is not valid'));
            }
            return this._proxy.$executeTask(dto).then(function (value) { return _this.getTaskExecution(value, task); });
        }
    };
    Object.defineProperty(ExtHostTask.prototype, "taskExecutions", {
        get: function () {
            var result = [];
            this._taskExecutions.forEach(function (value) { return result.push(value); });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTask.prototype.terminateTask = function (execution) {
        if (!(execution instanceof TaskExecutionImpl)) {
            throw new Error('No valid task execution provided');
        }
        return this._proxy.$terminateTask(execution._id);
    };
    Object.defineProperty(ExtHostTask.prototype, "onDidStartTask", {
        get: function () {
            return this._onDidExecuteTask.event;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTask.prototype.$onDidStartTask = function (execution) {
        this._onDidExecuteTask.fire({
            execution: this.getTaskExecution(execution)
        });
    };
    Object.defineProperty(ExtHostTask.prototype, "onDidEndTask", {
        get: function () {
            return this._onDidTerminateTask.event;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTask.prototype.$OnDidEndTask = function (execution) {
        var _execution = this.getTaskExecution(execution);
        this._taskExecutions.delete(execution.id);
        this._onDidTerminateTask.fire({
            execution: _execution
        });
    };
    Object.defineProperty(ExtHostTask.prototype, "onDidStartTaskProcess", {
        get: function () {
            return this._onDidTaskProcessStarted.event;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTask.prototype.$onDidStartTaskProcess = function (value) {
        var execution = this.getTaskExecution(value.id);
        if (execution) {
            this._onDidTaskProcessStarted.fire({
                execution: execution,
                processId: value.processId
            });
        }
    };
    Object.defineProperty(ExtHostTask.prototype, "onDidEndTaskProcess", {
        get: function () {
            return this._onDidTaskProcessEnded.event;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTask.prototype.$onDidEndTaskProcess = function (value) {
        var execution = this.getTaskExecution(value.id);
        if (execution) {
            this._onDidTaskProcessEnded.fire({
                execution: execution,
                exitCode: value.exitCode
            });
        }
    };
    ExtHostTask.prototype.$provideTasks = function (handle, validTypes) {
        var _this = this;
        var handler = this._handlers.get(handle);
        if (!handler) {
            return Promise.reject(new Error('no handler found'));
        }
        return asThenable(function () { return handler.provider.provideTasks(CancellationToken.None); }).then(function (value) {
            var sanitized = [];
            for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                var task = value_2[_i];
                if (task.definition && validTypes[task.definition.type] === true) {
                    sanitized.push(task);
                }
                else {
                    sanitized.push(task);
                    console.warn("The task [" + task.source + ", " + task.name + "] uses an undefined task type. The task will be ignored in the future.");
                }
            }
            var workspaceFolders = _this._workspaceService.getWorkspaceFolders();
            return {
                tasks: Tasks.from(sanitized, workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0] : undefined, handler.extension),
                extension: handler.extension
            };
        });
    };
    ExtHostTask.prototype.$resolveVariables = function (uriComponents, toResolve) {
        var uri = URI.revive(uriComponents);
        var result = {
            process: undefined,
            variables: Object.create(null)
        };
        var workspaceFolder = this._workspaceService.resolveWorkspaceFolder(uri);
        var resolver = new ExtHostVariableResolverService(this._workspaceService, this._editorService, this._configurationService);
        var ws = {
            uri: workspaceFolder.uri,
            name: workspaceFolder.name,
            index: workspaceFolder.index,
            toResource: function () {
                throw new Error('Not implemented');
            }
        };
        for (var _i = 0, _a = toResolve.variables; _i < _a.length; _i++) {
            var variable = _a[_i];
            result.variables[variable] = resolver.resolve(ws, variable);
        }
        if (toResolve.process !== void 0) {
            var paths = undefined;
            if (toResolve.process.path !== void 0) {
                paths = toResolve.process.path.split(path.delimiter);
                for (var i = 0; i < paths.length; i++) {
                    paths[i] = resolver.resolve(ws, paths[i]);
                }
            }
            result.process = win32.findExecutable(resolver.resolve(ws, toResolve.process.name), toResolve.process.cwd !== void 0 ? resolver.resolve(ws, toResolve.process.cwd) : undefined, paths);
        }
        return Promise.resolve(result);
    };
    ExtHostTask.prototype.nextHandle = function () {
        return this._handleCounter++;
    };
    ExtHostTask.prototype.getTaskExecution = function (execution, task) {
        if (typeof execution === 'string') {
            return this._taskExecutions.get(execution);
        }
        var result = this._taskExecutions.get(execution.id);
        if (result) {
            return result;
        }
        result = new TaskExecutionImpl(this, execution.id, task ? task : TaskDTO.to(execution.task, this._workspaceService));
        this._taskExecutions.set(execution.id, result);
        return result;
    };
    return ExtHostTask;
}());
export { ExtHostTask };

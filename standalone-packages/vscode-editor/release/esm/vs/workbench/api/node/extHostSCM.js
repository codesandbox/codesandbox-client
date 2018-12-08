/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { URI } from '../../../base/common/uri.js';
import { Emitter, once } from '../../../base/common/event.js';
import { debounce } from '../../../base/common/decorators.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { asThenable } from '../../../base/common/async.js';
import { MainContext } from './extHost.protocol.js';
import { sortedDiff } from '../../../base/common/arrays.js';
import { comparePaths } from '../../../base/common/comparers.js';
import { ILogService } from '../../../platform/log/common/log.js';
function getIconPath(decorations) {
    if (!decorations) {
        return undefined;
    }
    else if (typeof decorations.iconPath === 'string') {
        return URI.file(decorations.iconPath).toString();
    }
    else if (decorations.iconPath) {
        return "" + decorations.iconPath;
    }
    return undefined;
}
function compareResourceThemableDecorations(a, b) {
    if (!a.iconPath && !b.iconPath) {
        return 0;
    }
    else if (!a.iconPath) {
        return -1;
    }
    else if (!b.iconPath) {
        return 1;
    }
    var aPath = typeof a.iconPath === 'string' ? a.iconPath : a.iconPath.fsPath;
    var bPath = typeof b.iconPath === 'string' ? b.iconPath : b.iconPath.fsPath;
    return comparePaths(aPath, bPath);
}
function compareResourceStatesDecorations(a, b) {
    var result = 0;
    if (a.strikeThrough !== b.strikeThrough) {
        return a.strikeThrough ? 1 : -1;
    }
    if (a.faded !== b.faded) {
        return a.faded ? 1 : -1;
    }
    if (a.tooltip !== b.tooltip) {
        return (a.tooltip || '').localeCompare(b.tooltip);
    }
    result = compareResourceThemableDecorations(a, b);
    if (result !== 0) {
        return result;
    }
    if (a.light && b.light) {
        result = compareResourceThemableDecorations(a.light, b.light);
    }
    else if (a.light) {
        return 1;
    }
    else if (b.light) {
        return -1;
    }
    if (result !== 0) {
        return result;
    }
    if (a.dark && b.dark) {
        result = compareResourceThemableDecorations(a.dark, b.dark);
    }
    else if (a.dark) {
        return 1;
    }
    else if (b.dark) {
        return -1;
    }
    return result;
}
function compareResourceStates(a, b) {
    var result = comparePaths(a.resourceUri.fsPath, b.resourceUri.fsPath, true);
    if (result !== 0) {
        return result;
    }
    if (a.decorations && b.decorations) {
        result = compareResourceStatesDecorations(a.decorations, b.decorations);
    }
    else if (a.decorations) {
        return 1;
    }
    else if (b.decorations) {
        return -1;
    }
    return result;
}
function compareArgs(a, b) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
function commandEquals(a, b) {
    return a.command === b.command
        && a.title === b.title
        && a.tooltip === b.tooltip
        && (a.arguments && b.arguments ? compareArgs(a.arguments, b.arguments) : a.arguments === b.arguments);
}
function commandListEquals(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        if (!commandEquals(a[i], b[i])) {
            return false;
        }
    }
    return true;
}
var ExtHostSCMInputBox = /** @class */ (function () {
    function ExtHostSCMInputBox(_extension, _proxy, _sourceControlHandle) {
        this._extension = _extension;
        this._proxy = _proxy;
        this._sourceControlHandle = _sourceControlHandle;
        this._value = '';
        this._onDidChange = new Emitter();
        this._placeholder = '';
        this._visible = true;
        // noop
    }
    Object.defineProperty(ExtHostSCMInputBox.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._proxy.$setInputBoxValue(this._sourceControlHandle, value);
            this.updateValue(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSCMInputBox.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSCMInputBox.prototype, "placeholder", {
        get: function () {
            return this._placeholder;
        },
        set: function (placeholder) {
            this._proxy.$setInputBoxPlaceholder(this._sourceControlHandle, placeholder);
            this._placeholder = placeholder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSCMInputBox.prototype, "validateInput", {
        get: function () {
            if (!this._extension.enableProposedApi) {
                throw new Error("[" + this._extension.id + "]: Proposed API is only available when running out of dev or with the following command line switch: --enable-proposed-api " + this._extension.id);
            }
            return this._validateInput;
        },
        set: function (fn) {
            if (!this._extension.enableProposedApi) {
                throw new Error("[" + this._extension.id + "]: Proposed API is only available when running out of dev or with the following command line switch: --enable-proposed-api " + this._extension.id);
            }
            if (fn && typeof fn !== 'function') {
                console.warn('Invalid SCM input box validation function');
                return;
            }
            this._validateInput = fn;
            this._proxy.$setValidationProviderIsEnabled(this._sourceControlHandle, !!fn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSCMInputBox.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (visible) {
            visible = !!visible;
            this._visible = visible;
            this._proxy.$setInputBoxVisibility(this._sourceControlHandle, visible);
        },
        enumerable: true,
        configurable: true
    });
    ExtHostSCMInputBox.prototype.$onInputBoxValueChange = function (value) {
        this.updateValue(value);
    };
    ExtHostSCMInputBox.prototype.updateValue = function (value) {
        this._value = value;
        this._onDidChange.fire(value);
    };
    return ExtHostSCMInputBox;
}());
export { ExtHostSCMInputBox };
var ExtHostSourceControlResourceGroup = /** @class */ (function () {
    function ExtHostSourceControlResourceGroup(_proxy, _commands, _sourceControlHandle, _id, _label) {
        this._proxy = _proxy;
        this._commands = _commands;
        this._sourceControlHandle = _sourceControlHandle;
        this._id = _id;
        this._label = _label;
        this._resourceHandlePool = 0;
        this._resourceStates = [];
        this._resourceStatesMap = new Map();
        this._resourceStatesCommandsMap = new Map();
        this._onDidUpdateResourceStates = new Emitter();
        this.onDidUpdateResourceStates = this._onDidUpdateResourceStates.event;
        this._onDidDispose = new Emitter();
        this.onDidDispose = this._onDidDispose.event;
        this._handlesSnapshot = [];
        this._resourceSnapshot = [];
        this._hideWhenEmpty = undefined;
        this.handle = ExtHostSourceControlResourceGroup._handlePool++;
        this._disposables = [];
        this._proxy.$registerGroup(_sourceControlHandle, this.handle, _id, _label);
    }
    Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "label", {
        get: function () { return this._label; },
        set: function (label) {
            this._label = label;
            this._proxy.$updateGroupLabel(this._sourceControlHandle, this.handle, label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "hideWhenEmpty", {
        get: function () { return this._hideWhenEmpty; },
        set: function (hideWhenEmpty) {
            this._hideWhenEmpty = hideWhenEmpty;
            this._proxy.$updateGroup(this._sourceControlHandle, this.handle, { hideWhenEmpty: hideWhenEmpty });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "resourceStates", {
        get: function () { return this._resourceStates.slice(); },
        set: function (resources) {
            this._resourceStates = resources.slice();
            this._onDidUpdateResourceStates.fire();
        },
        enumerable: true,
        configurable: true
    });
    ExtHostSourceControlResourceGroup.prototype.getResourceState = function (handle) {
        return this._resourceStatesMap.get(handle);
    };
    ExtHostSourceControlResourceGroup.prototype.$executeResourceCommand = function (handle) {
        var _this = this;
        var command = this._resourceStatesCommandsMap.get(handle);
        if (!command) {
            return Promise.resolve(null);
        }
        return asThenable(function () {
            var _a;
            return (_a = _this._commands).executeCommand.apply(_a, [command.command].concat(command.arguments));
        });
    };
    ExtHostSourceControlResourceGroup.prototype._takeResourceStateSnapshot = function () {
        var _this = this;
        var _a;
        var snapshot = this._resourceStates.slice().sort(compareResourceStates);
        var diffs = sortedDiff(this._resourceSnapshot, snapshot, compareResourceStates);
        var splices = diffs.map(function (diff) {
            var toInsert = diff.toInsert.map(function (r) {
                var handle = _this._resourceHandlePool++;
                _this._resourceStatesMap.set(handle, r);
                var sourceUri = r.resourceUri;
                var iconPath = getIconPath(r.decorations);
                var lightIconPath = r.decorations && getIconPath(r.decorations.light) || iconPath;
                var darkIconPath = r.decorations && getIconPath(r.decorations.dark) || iconPath;
                var icons = [];
                if (r.command) {
                    _this._resourceStatesCommandsMap.set(handle, r.command);
                }
                if (lightIconPath || darkIconPath) {
                    icons.push(lightIconPath);
                }
                if (darkIconPath !== lightIconPath) {
                    icons.push(darkIconPath);
                }
                var tooltip = (r.decorations && r.decorations.tooltip) || '';
                var strikeThrough = r.decorations && !!r.decorations.strikeThrough;
                var faded = r.decorations && !!r.decorations.faded;
                var source = r.decorations && r.decorations.source || undefined;
                var letter = r.decorations && r.decorations.letter || undefined;
                var color = r.decorations && r.decorations.color || undefined;
                var rawResource = [handle, sourceUri, icons, tooltip, strikeThrough, faded, source, letter, color];
                return { rawResource: rawResource, handle: handle };
            });
            return { start: diff.start, deleteCount: diff.deleteCount, toInsert: toInsert };
        });
        var rawResourceSplices = splices
            .map(function (_a) {
            var start = _a.start, deleteCount = _a.deleteCount, toInsert = _a.toInsert;
            return [start, deleteCount, toInsert.map(function (i) { return i.rawResource; })];
        });
        var reverseSplices = splices.reverse();
        for (var _i = 0, reverseSplices_1 = reverseSplices; _i < reverseSplices_1.length; _i++) {
            var _b = reverseSplices_1[_i], start = _b.start, deleteCount = _b.deleteCount, toInsert = _b.toInsert;
            var handles = toInsert.map(function (i) { return i.handle; });
            var handlesToDelete = (_a = this._handlesSnapshot).splice.apply(_a, [start, deleteCount].concat(handles));
            for (var _c = 0, handlesToDelete_1 = handlesToDelete; _c < handlesToDelete_1.length; _c++) {
                var handle = handlesToDelete_1[_c];
                this._resourceStatesMap.delete(handle);
                this._resourceStatesCommandsMap.delete(handle);
            }
        }
        this._resourceSnapshot = snapshot;
        return rawResourceSplices;
    };
    ExtHostSourceControlResourceGroup.prototype.dispose = function () {
        this._proxy.$unregisterGroup(this._sourceControlHandle, this.handle);
        this._disposables = dispose(this._disposables);
        this._onDidDispose.fire();
    };
    ExtHostSourceControlResourceGroup._handlePool = 0;
    return ExtHostSourceControlResourceGroup;
}());
var ExtHostSourceControl = /** @class */ (function () {
    function ExtHostSourceControl(_extension, _proxy, _commands, _id, _label, _rootUri) {
        this._proxy = _proxy;
        this._commands = _commands;
        this._id = _id;
        this._label = _label;
        this._rootUri = _rootUri;
        this._groups = new Map();
        this._count = undefined;
        this._quickDiffProvider = undefined;
        this._commitTemplate = undefined;
        this._acceptInputCommand = undefined;
        this._statusBarCommands = undefined;
        this._selected = false;
        this._onDidChangeSelection = new Emitter();
        this.onDidChangeSelection = this._onDidChangeSelection.event;
        this.handle = ExtHostSourceControl._handlePool++;
        this.updatedResourceGroups = new Set();
        this._inputBox = new ExtHostSCMInputBox(_extension, this._proxy, this.handle);
        this._proxy.$registerSourceControl(this.handle, _id, _label, _rootUri);
    }
    Object.defineProperty(ExtHostSourceControl.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "rootUri", {
        get: function () {
            return this._rootUri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "inputBox", {
        get: function () { return this._inputBox; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "count", {
        get: function () {
            return this._count;
        },
        set: function (count) {
            if (this._count === count) {
                return;
            }
            this._count = count;
            this._proxy.$updateSourceControl(this.handle, { count: count });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "quickDiffProvider", {
        get: function () {
            return this._quickDiffProvider;
        },
        set: function (quickDiffProvider) {
            this._quickDiffProvider = quickDiffProvider;
            this._proxy.$updateSourceControl(this.handle, { hasQuickDiffProvider: !!quickDiffProvider });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "commitTemplate", {
        get: function () {
            return this._commitTemplate;
        },
        set: function (commitTemplate) {
            this._commitTemplate = commitTemplate;
            this._proxy.$updateSourceControl(this.handle, { commitTemplate: commitTemplate });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "acceptInputCommand", {
        get: function () {
            return this._acceptInputCommand;
        },
        set: function (acceptInputCommand) {
            this._acceptInputCommand = acceptInputCommand;
            var internal = this._commands.converter.toInternal(acceptInputCommand);
            this._proxy.$updateSourceControl(this.handle, { acceptInputCommand: internal });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "statusBarCommands", {
        get: function () {
            return this._statusBarCommands;
        },
        set: function (statusBarCommands) {
            var _this = this;
            if (this._statusBarCommands && statusBarCommands && commandListEquals(this._statusBarCommands, statusBarCommands)) {
                return;
            }
            this._statusBarCommands = statusBarCommands;
            var internal = (statusBarCommands || []).map(function (c) { return _this._commands.converter.toInternal(c); });
            this._proxy.$updateSourceControl(this.handle, { statusBarCommands: internal });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostSourceControl.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostSourceControl.prototype.createResourceGroup = function (id, label) {
        var _this = this;
        var group = new ExtHostSourceControlResourceGroup(this._proxy, this._commands, this.handle, id, label);
        var updateListener = group.onDidUpdateResourceStates(function () {
            _this.updatedResourceGroups.add(group);
            _this.eventuallyUpdateResourceStates();
        });
        once(group.onDidDispose)(function () {
            _this.updatedResourceGroups.delete(group);
            updateListener.dispose();
            _this._groups.delete(group.handle);
        });
        this._groups.set(group.handle, group);
        return group;
    };
    ExtHostSourceControl.prototype.eventuallyUpdateResourceStates = function () {
        var splices = [];
        this.updatedResourceGroups.forEach(function (group) {
            var snapshot = group._takeResourceStateSnapshot();
            if (snapshot.length === 0) {
                return;
            }
            splices.push([group.handle, snapshot]);
        });
        if (splices.length > 0) {
            this._proxy.$spliceResourceStates(this.handle, splices);
        }
        this.updatedResourceGroups.clear();
    };
    ExtHostSourceControl.prototype.getResourceGroup = function (handle) {
        return this._groups.get(handle);
    };
    ExtHostSourceControl.prototype.setSelectionState = function (selected) {
        this._selected = selected;
        this._onDidChangeSelection.fire(selected);
    };
    ExtHostSourceControl.prototype.dispose = function () {
        this._groups.forEach(function (group) { return group.dispose(); });
        this._proxy.$unregisterSourceControl(this.handle);
    };
    ExtHostSourceControl._handlePool = 0;
    __decorate([
        debounce(100)
    ], ExtHostSourceControl.prototype, "eventuallyUpdateResourceStates", null);
    return ExtHostSourceControl;
}());
var ExtHostSCM = /** @class */ (function () {
    function ExtHostSCM(mainContext, _commands, logService) {
        var _this = this;
        this._commands = _commands;
        this.logService = logService;
        this._sourceControls = new Map();
        this._sourceControlsByExtension = new Map();
        this._onDidChangeActiveProvider = new Emitter();
        this._selectedSourceControlHandles = new Set();
        this._proxy = mainContext.getProxy(MainContext.MainThreadSCM);
        _commands.registerArgumentProcessor({
            processArgument: function (arg) {
                if (arg && arg.$mid === 3) {
                    var sourceControl = _this._sourceControls.get(arg.sourceControlHandle);
                    if (!sourceControl) {
                        return arg;
                    }
                    var group = sourceControl.getResourceGroup(arg.groupHandle);
                    if (!group) {
                        return arg;
                    }
                    return group.getResourceState(arg.handle);
                }
                else if (arg && arg.$mid === 4) {
                    var sourceControl = _this._sourceControls.get(arg.sourceControlHandle);
                    if (!sourceControl) {
                        return arg;
                    }
                    return sourceControl.getResourceGroup(arg.groupHandle);
                }
                else if (arg && arg.$mid === 5) {
                    var sourceControl = _this._sourceControls.get(arg.handle);
                    if (!sourceControl) {
                        return arg;
                    }
                    return sourceControl;
                }
                return arg;
            }
        });
    }
    Object.defineProperty(ExtHostSCM.prototype, "onDidChangeActiveProvider", {
        get: function () { return this._onDidChangeActiveProvider.event; },
        enumerable: true,
        configurable: true
    });
    ExtHostSCM.prototype.createSourceControl = function (extension, id, label, rootUri) {
        this.logService.trace('ExtHostSCM#createSourceControl', extension.id, id, label, rootUri);
        var handle = ExtHostSCM._handlePool++;
        var sourceControl = new ExtHostSourceControl(extension, this._proxy, this._commands, id, label, rootUri);
        this._sourceControls.set(handle, sourceControl);
        var sourceControls = this._sourceControlsByExtension.get(extension.id) || [];
        sourceControls.push(sourceControl);
        this._sourceControlsByExtension.set(extension.id, sourceControls);
        return sourceControl;
    };
    // Deprecated
    ExtHostSCM.prototype.getLastInputBox = function (extension) {
        this.logService.trace('ExtHostSCM#getLastInputBox', extension.id);
        var sourceControls = this._sourceControlsByExtension.get(extension.id);
        var sourceControl = sourceControls && sourceControls[sourceControls.length - 1];
        var inputBox = sourceControl && sourceControl.inputBox;
        return inputBox;
    };
    ExtHostSCM.prototype.$provideOriginalResource = function (sourceControlHandle, uriComponents, token) {
        var uri = URI.revive(uriComponents);
        this.logService.trace('ExtHostSCM#$provideOriginalResource', sourceControlHandle, uri.toString());
        var sourceControl = this._sourceControls.get(sourceControlHandle);
        if (!sourceControl || !sourceControl.quickDiffProvider) {
            return Promise.resolve(null);
        }
        return asThenable(function () { return sourceControl.quickDiffProvider.provideOriginalResource(uri, token); });
    };
    ExtHostSCM.prototype.$onInputBoxValueChange = function (sourceControlHandle, value) {
        this.logService.trace('ExtHostSCM#$onInputBoxValueChange', sourceControlHandle);
        var sourceControl = this._sourceControls.get(sourceControlHandle);
        if (!sourceControl) {
            return Promise.resolve(null);
        }
        sourceControl.inputBox.$onInputBoxValueChange(value);
        return Promise.resolve(null);
    };
    ExtHostSCM.prototype.$executeResourceCommand = function (sourceControlHandle, groupHandle, handle) {
        this.logService.trace('ExtHostSCM#$executeResourceCommand', sourceControlHandle, groupHandle, handle);
        var sourceControl = this._sourceControls.get(sourceControlHandle);
        if (!sourceControl) {
            return Promise.resolve(null);
        }
        var group = sourceControl.getResourceGroup(groupHandle);
        if (!group) {
            return Promise.resolve(null);
        }
        return group.$executeResourceCommand(handle);
    };
    ExtHostSCM.prototype.$validateInput = function (sourceControlHandle, value, cursorPosition) {
        this.logService.trace('ExtHostSCM#$validateInput', sourceControlHandle);
        var sourceControl = this._sourceControls.get(sourceControlHandle);
        if (!sourceControl) {
            return Promise.resolve(undefined);
        }
        if (!sourceControl.inputBox.validateInput) {
            return Promise.resolve(undefined);
        }
        return asThenable(function () { return sourceControl.inputBox.validateInput(value, cursorPosition); }).then(function (result) {
            if (!result) {
                return Promise.resolve(undefined);
            }
            return Promise.resolve([result.message, result.type]);
        });
    };
    ExtHostSCM.prototype.$setSelectedSourceControls = function (selectedSourceControlHandles) {
        var _this = this;
        this.logService.trace('ExtHostSCM#$setSelectedSourceControls', selectedSourceControlHandles);
        var set = new Set();
        for (var _i = 0, selectedSourceControlHandles_1 = selectedSourceControlHandles; _i < selectedSourceControlHandles_1.length; _i++) {
            var handle = selectedSourceControlHandles_1[_i];
            set.add(handle);
        }
        set.forEach(function (handle) {
            if (!_this._selectedSourceControlHandles.has(handle)) {
                var sourceControl = _this._sourceControls.get(handle);
                if (!sourceControl) {
                    return;
                }
                sourceControl.setSelectionState(true);
            }
        });
        this._selectedSourceControlHandles.forEach(function (handle) {
            if (!set.has(handle)) {
                var sourceControl = _this._sourceControls.get(handle);
                if (!sourceControl) {
                    return;
                }
                sourceControl.setSelectionState(false);
            }
        });
        this._selectedSourceControlHandles = set;
        return Promise.resolve(null);
    };
    ExtHostSCM._handlePool = 0;
    ExtHostSCM = __decorate([
        __param(2, ILogService)
    ], ExtHostSCM);
    return ExtHostSCM;
}());
export { ExtHostSCM };

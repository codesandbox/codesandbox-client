/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import { localize } from '../../../../nls';
import { URI } from '../../../../base/common/uri';
import { TPromise } from '../../../../base/common/winjs.base';
import { isArray } from '../../../../base/common/types';
import { Queue } from '../../../../base/common/async';
import { Disposable } from '../../../../base/common/lifecycle';
import * as json from '../../../../base/common/json';
import { setProperty } from '../../../../base/common/jsonEdit';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { EditOperation } from '../../../../editor/common/core/editOperation';
import { Range } from '../../../../editor/common/core/range';
import { Selection } from '../../../../editor/common/core/selection';
import { IEnvironmentService } from '../../../../platform/environment/common/environment';
import { ITextModelService } from '../../../../editor/common/services/resolverService';
import { ITextFileService } from '../../textfile/common/textfiles';
import { IFileService } from '../../../../platform/files/common/files';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
export var IKeybindingEditingService = createDecorator('keybindingEditingService');
var KeybindingsEditingService = /** @class */ (function (_super) {
    __extends(KeybindingsEditingService, _super);
    function KeybindingsEditingService(textModelResolverService, textFileService, fileService, configurationService, environmentService) {
        var _this = _super.call(this) || this;
        _this.textModelResolverService = textModelResolverService;
        _this.textFileService = textFileService;
        _this.fileService = fileService;
        _this.configurationService = configurationService;
        _this.environmentService = environmentService;
        _this.resource = URI.file(_this.environmentService.appKeybindingsPath);
        _this.queue = new Queue();
        return _this;
    }
    KeybindingsEditingService.prototype.editKeybinding = function (key, keybindingItem) {
        var _this = this;
        return this.queue.queue(function () { return _this.doEditKeybinding(key, keybindingItem); }); // queue up writes to prevent race conditions
    };
    KeybindingsEditingService.prototype.resetKeybinding = function (keybindingItem) {
        var _this = this;
        return this.queue.queue(function () { return _this.doResetKeybinding(keybindingItem); }); // queue up writes to prevent race conditions
    };
    KeybindingsEditingService.prototype.removeKeybinding = function (keybindingItem) {
        var _this = this;
        return this.queue.queue(function () { return _this.doRemoveKeybinding(keybindingItem); }); // queue up writes to prevent race conditions
    };
    KeybindingsEditingService.prototype.doEditKeybinding = function (key, keybindingItem) {
        var _this = this;
        return this.resolveAndValidate()
            .then(function (reference) {
            var model = reference.object.textEditorModel;
            var userKeybindingEntries = json.parse(model.getValue());
            var userKeybindingEntryIndex = _this.findUserKeybindingEntryIndex(keybindingItem, userKeybindingEntries);
            _this.updateKeybinding(key, keybindingItem, model, userKeybindingEntryIndex);
            if (keybindingItem.isDefault && keybindingItem.resolvedKeybinding) {
                _this.removeDefaultKeybinding(keybindingItem, model);
            }
            return _this.save().then(function () { return reference.dispose(); });
        });
    };
    KeybindingsEditingService.prototype.doRemoveKeybinding = function (keybindingItem) {
        var _this = this;
        return this.resolveAndValidate()
            .then(function (reference) {
            var model = reference.object.textEditorModel;
            if (keybindingItem.isDefault) {
                _this.removeDefaultKeybinding(keybindingItem, model);
            }
            else {
                _this.removeUserKeybinding(keybindingItem, model);
            }
            return _this.save().then(function () { return reference.dispose(); });
        });
    };
    KeybindingsEditingService.prototype.doResetKeybinding = function (keybindingItem) {
        var _this = this;
        return this.resolveAndValidate()
            .then(function (reference) {
            var model = reference.object.textEditorModel;
            if (!keybindingItem.isDefault) {
                _this.removeUserKeybinding(keybindingItem, model);
                _this.removeUnassignedDefaultKeybinding(keybindingItem, model);
            }
            return _this.save().then(function () { return reference.dispose(); });
        });
    };
    KeybindingsEditingService.prototype.save = function () {
        return this.textFileService.save(this.resource);
    };
    KeybindingsEditingService.prototype.updateKeybinding = function (newKey, keybindingItem, model, userKeybindingEntryIndex) {
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var eol = model.getEOL();
        if (userKeybindingEntryIndex !== -1) {
            // Update the keybinding with new key
            this.applyEditsToBuffer(setProperty(model.getValue(), [userKeybindingEntryIndex, 'key'], newKey, { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol })[0], model);
        }
        else {
            // Add the new keybinding with new key
            this.applyEditsToBuffer(setProperty(model.getValue(), [-1], this.asObject(newKey, keybindingItem.command, keybindingItem.when, false), { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol })[0], model);
        }
    };
    KeybindingsEditingService.prototype.removeUserKeybinding = function (keybindingItem, model) {
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var eol = model.getEOL();
        var userKeybindingEntries = json.parse(model.getValue());
        var userKeybindingEntryIndex = this.findUserKeybindingEntryIndex(keybindingItem, userKeybindingEntries);
        if (userKeybindingEntryIndex !== -1) {
            this.applyEditsToBuffer(setProperty(model.getValue(), [userKeybindingEntryIndex], void 0, { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol })[0], model);
        }
    };
    KeybindingsEditingService.prototype.removeDefaultKeybinding = function (keybindingItem, model) {
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var eol = model.getEOL();
        this.applyEditsToBuffer(setProperty(model.getValue(), [-1], this.asObject(keybindingItem.resolvedKeybinding.getUserSettingsLabel(), keybindingItem.command, keybindingItem.when, true), { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol })[0], model);
    };
    KeybindingsEditingService.prototype.removeUnassignedDefaultKeybinding = function (keybindingItem, model) {
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var eol = model.getEOL();
        var userKeybindingEntries = json.parse(model.getValue());
        var indices = this.findUnassignedDefaultKeybindingEntryIndex(keybindingItem, userKeybindingEntries).reverse();
        for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
            var index = indices_1[_i];
            this.applyEditsToBuffer(setProperty(model.getValue(), [index], void 0, { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol })[0], model);
        }
    };
    KeybindingsEditingService.prototype.findUserKeybindingEntryIndex = function (keybindingItem, userKeybindingEntries) {
        for (var index = 0; index < userKeybindingEntries.length; index++) {
            var keybinding = userKeybindingEntries[index];
            if (keybinding.command === keybindingItem.command) {
                if (!keybinding.when && !keybindingItem.when) {
                    return index;
                }
                if (keybinding.when && keybindingItem.when) {
                    if (ContextKeyExpr.deserialize(keybinding.when).serialize() === keybindingItem.when.serialize()) {
                        return index;
                    }
                }
            }
        }
        return -1;
    };
    KeybindingsEditingService.prototype.findUnassignedDefaultKeybindingEntryIndex = function (keybindingItem, userKeybindingEntries) {
        var indices = [];
        for (var index = 0; index < userKeybindingEntries.length; index++) {
            if (userKeybindingEntries[index].command === "-" + keybindingItem.command) {
                indices.push(index);
            }
        }
        return indices;
    };
    KeybindingsEditingService.prototype.asObject = function (key, command, when, negate) {
        var object = { key: key };
        object['command'] = negate ? "-" + command : command;
        if (when) {
            object['when'] = when.serialize();
        }
        return object;
    };
    KeybindingsEditingService.prototype.applyEditsToBuffer = function (edit, model) {
        var startPosition = model.getPositionAt(edit.offset);
        var endPosition = model.getPositionAt(edit.offset + edit.length);
        var range = new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
        var currentText = model.getValueInRange(range);
        var editOperation = currentText ? EditOperation.replace(range, edit.content) : EditOperation.insert(startPosition, edit.content);
        model.pushEditOperations([new Selection(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column)], [editOperation], function () { return []; });
    };
    KeybindingsEditingService.prototype.resolveModelReference = function () {
        var _this = this;
        return this.fileService.existsFile(this.resource)
            .then(function (exists) {
            var EOL = _this.configurationService.getValue('files', { overrideIdentifier: 'json' })['eol'];
            var result = exists ? TPromise.as(null) : _this.fileService.updateContent(_this.resource, _this.getEmptyContent(EOL), { encoding: 'utf8' });
            return result.then(function () { return _this.textModelResolverService.createModelReference(_this.resource); });
        });
    };
    KeybindingsEditingService.prototype.resolveAndValidate = function () {
        var _this = this;
        // Target cannot be dirty if not writing into buffer
        if (this.textFileService.isDirty(this.resource)) {
            return TPromise.wrapError(new Error(localize('errorKeybindingsFileDirty', "Unable to write because the keybindings configuration file is dirty. Please save it first and then try again.")));
        }
        return this.resolveModelReference()
            .then(function (reference) {
            var model = reference.object.textEditorModel;
            var EOL = model.getEOL();
            if (model.getValue()) {
                var parsed = _this.parse(model);
                if (parsed.parseErrors.length) {
                    return TPromise.wrapError(new Error(localize('parseErrors', "Unable to write to the keybindings configuration file. Please open it to correct errors/warnings in the file and try again.")));
                }
                if (parsed.result) {
                    if (!isArray(parsed.result)) {
                        return TPromise.wrapError(new Error(localize('errorInvalidConfiguration', "Unable to write to the keybindings configuration file. It has an object which is not of type Array. Please open the file to clean up and try again.")));
                    }
                }
                else {
                    var content = EOL + '[]';
                    _this.applyEditsToBuffer({ content: content, length: content.length, offset: model.getValue().length }, model);
                }
            }
            else {
                var content = _this.getEmptyContent(EOL);
                _this.applyEditsToBuffer({ content: content, length: content.length, offset: 0 }, model);
            }
            return reference;
        });
    };
    KeybindingsEditingService.prototype.parse = function (model) {
        var parseErrors = [];
        var result = json.parse(model.getValue(), parseErrors);
        return { result: result, parseErrors: parseErrors };
    };
    KeybindingsEditingService.prototype.getEmptyContent = function (EOL) {
        return '// ' + localize('emptyKeybindingsHeader', "Place your key bindings in this file to overwrite the defaults") + EOL + '[]';
    };
    KeybindingsEditingService = __decorate([
        __param(0, ITextModelService),
        __param(1, ITextFileService),
        __param(2, IFileService),
        __param(3, IConfigurationService),
        __param(4, IEnvironmentService)
    ], KeybindingsEditingService);
    return KeybindingsEditingService;
}(Disposable));
export { KeybindingsEditingService };

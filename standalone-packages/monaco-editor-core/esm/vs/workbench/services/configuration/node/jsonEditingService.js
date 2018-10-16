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
import * as nls from '../../../../nls';
import { TPromise } from '../../../../base/common/winjs.base';
import * as json from '../../../../base/common/json';
import * as encoding from '../../../../base/node/encoding';
import * as strings from '../../../../base/common/strings';
import { setProperty } from '../../../../base/common/jsonEdit';
import { Queue } from '../../../../base/common/async';
import { EditOperation } from '../../../../editor/common/core/editOperation';
import { Range } from '../../../../editor/common/core/range';
import { Selection } from '../../../../editor/common/core/selection';
import { ITextFileService } from '../../textfile/common/textfiles';
import { IFileService } from '../../../../platform/files/common/files';
import { ITextModelService } from '../../../../editor/common/services/resolverService';
import { JSONEditingError } from '../common/jsonEditing';
var JSONEditingService = /** @class */ (function () {
    function JSONEditingService(fileService, textModelResolverService, textFileService) {
        this.fileService = fileService;
        this.textModelResolverService = textModelResolverService;
        this.textFileService = textFileService;
        this.queue = new Queue();
    }
    JSONEditingService.prototype.write = function (resource, value, save) {
        var _this = this;
        return this.queue.queue(function () { return _this.doWriteConfiguration(resource, value, save); }); // queue up writes to prevent race conditions
    };
    JSONEditingService.prototype.doWriteConfiguration = function (resource, value, save) {
        var _this = this;
        return this.resolveAndValidate(resource, save)
            .then(function (reference) { return _this.writeToBuffer(reference.object.textEditorModel, value)
            .then(function () { return reference.dispose(); }); });
    };
    JSONEditingService.prototype.writeToBuffer = function (model, value) {
        var edit = this.getEdits(model, value)[0];
        if (this.applyEditsToBuffer(edit, model)) {
            return this.textFileService.save(model.uri);
        }
        return TPromise.as(null);
    };
    JSONEditingService.prototype.applyEditsToBuffer = function (edit, model) {
        var startPosition = model.getPositionAt(edit.offset);
        var endPosition = model.getPositionAt(edit.offset + edit.length);
        var range = new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
        var currentText = model.getValueInRange(range);
        if (edit.content !== currentText) {
            var editOperation = currentText ? EditOperation.replace(range, edit.content) : EditOperation.insert(startPosition, edit.content);
            model.pushEditOperations([new Selection(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column)], [editOperation], function () { return []; });
            return true;
        }
        return false;
    };
    JSONEditingService.prototype.getEdits = function (model, configurationValue) {
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var eol = model.getEOL();
        var key = configurationValue.key, value = configurationValue.value;
        // Without key, the entire settings file is being replaced, so we just use JSON.stringify
        if (!key) {
            var content = JSON.stringify(value, null, insertSpaces ? strings.repeat(' ', tabSize) : '\t');
            return [{
                    content: content,
                    length: content.length,
                    offset: 0
                }];
        }
        return setProperty(model.getValue(), [key], value, { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol });
    };
    JSONEditingService.prototype.resolveModelReference = function (resource) {
        var _this = this;
        return this.fileService.existsFile(resource)
            .then(function (exists) {
            var result = exists ? TPromise.as(null) : _this.fileService.updateContent(resource, '{}', { encoding: encoding.UTF8 });
            return result.then(function () { return _this.textModelResolverService.createModelReference(resource); });
        });
    };
    JSONEditingService.prototype.hasParseErrors = function (model) {
        var parseErrors = [];
        json.parse(model.getValue(), parseErrors);
        return parseErrors.length > 0;
    };
    JSONEditingService.prototype.resolveAndValidate = function (resource, checkDirty) {
        var _this = this;
        return this.resolveModelReference(resource)
            .then(function (reference) {
            var model = reference.object.textEditorModel;
            if (_this.hasParseErrors(model)) {
                return _this.wrapError(1 /* ERROR_INVALID_FILE */);
            }
            // Target cannot be dirty if not writing into buffer
            if (checkDirty && _this.textFileService.isDirty(resource)) {
                return _this.wrapError(0 /* ERROR_FILE_DIRTY */);
            }
            return reference;
        });
    };
    JSONEditingService.prototype.wrapError = function (code) {
        var message = this.toErrorMessage(code);
        return TPromise.wrapError(new JSONEditingError(message, code));
    };
    JSONEditingService.prototype.toErrorMessage = function (error) {
        switch (error) {
            // User issues
            case 1 /* ERROR_INVALID_FILE */: {
                return nls.localize('errorInvalidFile', "Unable to write into the file. Please open the file to correct errors/warnings in the file and try again.");
            }
            case 0 /* ERROR_FILE_DIRTY */: {
                return nls.localize('errorFileDirty', "Unable to write into the file because the file is dirty. Please save the file and try again.");
            }
        }
    };
    JSONEditingService = __decorate([
        __param(0, IFileService),
        __param(1, ITextModelService),
        __param(2, ITextFileService)
    ], JSONEditingService);
    return JSONEditingService;
}());
export { JSONEditingService };

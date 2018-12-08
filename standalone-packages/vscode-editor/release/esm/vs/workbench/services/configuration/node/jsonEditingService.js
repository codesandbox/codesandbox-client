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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as nls from '../../../../nls.js';
import * as json from '../../../../base/common/json.js';
import * as encoding from '../../../../base/node/encoding.js';
import * as strings from '../../../../base/common/strings.js';
import { setProperty } from '../../../../base/common/jsonEdit.js';
import { Queue } from '../../../../base/common/async.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { JSONEditingError } from '../common/jsonEditing.js';
var JSONEditingService = /** @class */ (function () {
    function JSONEditingService(fileService, textModelResolverService, textFileService) {
        this.fileService = fileService;
        this.textModelResolverService = textModelResolverService;
        this.textFileService = textFileService;
        this.queue = new Queue();
    }
    JSONEditingService.prototype.write = function (resource, value, save) {
        var _this = this;
        return Promise.resolve(this.queue.queue(function () { return _this.doWriteConfiguration(resource, value, save); })); // queue up writes to prevent race conditions
    };
    JSONEditingService.prototype.doWriteConfiguration = function (resource, value, save) {
        var _this = this;
        return this.resolveAndValidate(resource, save)
            .then(function (reference) { return _this.writeToBuffer(reference.object.textEditorModel, value)
            .then(function () { return reference.dispose(); }); });
    };
    JSONEditingService.prototype.writeToBuffer = function (model, value) {
        return __awaiter(this, void 0, void 0, function () {
            var edit;
            return __generator(this, function (_a) {
                edit = this.getEdits(model, value)[0];
                if (this.applyEditsToBuffer(edit, model)) {
                    return [2 /*return*/, this.textFileService.save(model.uri)];
                }
                return [2 /*return*/];
            });
        });
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
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fileService.existsFile(resource)];
                    case 1:
                        exists = _a.sent();
                        if (!!exists) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fileService.updateContent(resource, '{}', { encoding: encoding.UTF8 })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.textModelResolverService.createModelReference(resource)];
                }
            });
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
        return Promise.reject(new JSONEditingError(message, code));
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

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
import * as nls from '../../../../nls.js';
import * as errors from '../../../../base/common/errors.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as network from '../../../../base/common/network.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IReplaceService } from '../common/replace.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { Match, FileMatch, ISearchWorkbenchService } from '../common/searchModel.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../editor/common/model/textModel.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IBulkEditService } from '../../../../editor/browser/services/bulkEditService.js';
import { Range } from '../../../../editor/common/core/range.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { mergeSort } from '../../../../base/common/arrays.js';
var REPLACE_PREVIEW = 'replacePreview';
var toReplaceResource = function (fileResource) {
    return fileResource.with({ scheme: network.Schemas.internal, fragment: REPLACE_PREVIEW, query: JSON.stringify({ scheme: fileResource.scheme }) });
};
var toFileResource = function (replaceResource) {
    return replaceResource.with({ scheme: JSON.parse(replaceResource.query)['scheme'], fragment: '', query: '' });
};
var ReplacePreviewContentProvider = /** @class */ (function () {
    function ReplacePreviewContentProvider(instantiationService, textModelResolverService) {
        this.instantiationService = instantiationService;
        this.textModelResolverService = textModelResolverService;
        this.textModelResolverService.registerTextModelContentProvider(network.Schemas.internal, this);
    }
    ReplacePreviewContentProvider.prototype.provideTextContent = function (uri) {
        if (uri.fragment === REPLACE_PREVIEW) {
            return this.instantiationService.createInstance(ReplacePreviewModel).resolve(uri);
        }
        return null;
    };
    ReplacePreviewContentProvider = __decorate([
        __param(0, IInstantiationService),
        __param(1, ITextModelService)
    ], ReplacePreviewContentProvider);
    return ReplacePreviewContentProvider;
}());
export { ReplacePreviewContentProvider };
var ReplacePreviewModel = /** @class */ (function (_super) {
    __extends(ReplacePreviewModel, _super);
    function ReplacePreviewModel(modelService, modeService, textModelResolverService, replaceService, searchWorkbenchService) {
        var _this = _super.call(this) || this;
        _this.modelService = modelService;
        _this.modeService = modeService;
        _this.textModelResolverService = textModelResolverService;
        _this.replaceService = replaceService;
        _this.searchWorkbenchService = searchWorkbenchService;
        return _this;
    }
    ReplacePreviewModel.prototype.resolve = function (replacePreviewUri) {
        var _this = this;
        var fileResource = toFileResource(replacePreviewUri);
        var fileMatch = this.searchWorkbenchService.searchModel.searchResult.matches().filter(function (match) { return match.resource().toString() === fileResource.toString(); })[0];
        return this.textModelResolverService.createModelReference(fileResource).then(function (ref) {
            ref = _this._register(ref);
            var sourceModel = ref.object.textEditorModel;
            var sourceModelModeId = sourceModel.getLanguageIdentifier().language;
            var replacePreviewModel = _this.modelService.createModel(createTextBufferFactoryFromSnapshot(sourceModel.createSnapshot()), _this.modeService.getOrCreateMode(sourceModelModeId), replacePreviewUri);
            _this._register(fileMatch.onChange(function (modelChange) { return _this.update(sourceModel, replacePreviewModel, fileMatch, modelChange); }));
            _this._register(_this.searchWorkbenchService.searchModel.onReplaceTermChanged(function () { return _this.update(sourceModel, replacePreviewModel, fileMatch); }));
            _this._register(fileMatch.onDispose(function () { return replacePreviewModel.dispose(); })); // TODO@Sandeep we should not dispose a model directly but rather the reference (depends on https://github.com/Microsoft/vscode/issues/17073)
            _this._register(replacePreviewModel.onWillDispose(function () { return _this.dispose(); }));
            _this._register(sourceModel.onWillDispose(function () { return _this.dispose(); }));
            return replacePreviewModel;
        });
    };
    ReplacePreviewModel.prototype.update = function (sourceModel, replacePreviewModel, fileMatch, override) {
        if (override === void 0) { override = false; }
        if (!sourceModel.isDisposed() && !replacePreviewModel.isDisposed()) {
            this.replaceService.updateReplacePreview(fileMatch, override);
        }
    };
    ReplacePreviewModel = __decorate([
        __param(0, IModelService),
        __param(1, IModeService),
        __param(2, ITextModelService),
        __param(3, IReplaceService),
        __param(4, ISearchWorkbenchService)
    ], ReplacePreviewModel);
    return ReplacePreviewModel;
}(Disposable));
var ReplaceService = /** @class */ (function () {
    function ReplaceService(textFileService, editorService, textModelResolverService, bulkEditorService) {
        this.textFileService = textFileService;
        this.editorService = editorService;
        this.textModelResolverService = textModelResolverService;
        this.bulkEditorService = bulkEditorService;
    }
    ReplaceService.prototype.replace = function (arg, progress, resource) {
        var _this = this;
        if (progress === void 0) { progress = null; }
        if (resource === void 0) { resource = null; }
        var edits = this.createEdits(arg, resource);
        return this.bulkEditorService.apply({ edits: edits }, { progress: progress }).then(function () { return _this.textFileService.saveAll(edits.map(function (e) { return e.resource; })); });
    };
    ReplaceService.prototype.openReplacePreview = function (element, preserveFocus, sideBySide, pinned) {
        var _this = this;
        var fileMatch = element instanceof Match ? element.parent() : element;
        return this.editorService.openEditor({
            leftResource: fileMatch.resource(),
            rightResource: toReplaceResource(fileMatch.resource()),
            label: nls.localize('fileReplaceChanges', "{0} ↔ {1} (Replace Preview)", fileMatch.name(), fileMatch.name()),
            options: {
                preserveFocus: preserveFocus,
                pinned: pinned,
                revealIfVisible: true
            }
        }).then(function (editor) {
            var disposable = fileMatch.onDispose(function () {
                if (editor && editor.input) {
                    editor.input.dispose();
                }
                disposable.dispose();
            });
            _this.updateReplacePreview(fileMatch).then(function () {
                var editorControl = editor.getControl();
                if (element instanceof Match) {
                    editorControl.revealLineInCenter(element.range().startLineNumber, 1 /* Immediate */);
                }
            });
        }, errors.onUnexpectedError);
    };
    ReplaceService.prototype.updateReplacePreview = function (fileMatch, override) {
        var _this = this;
        if (override === void 0) { override = false; }
        var replacePreviewUri = toReplaceResource(fileMatch.resource());
        return TPromise.join([this.textModelResolverService.createModelReference(fileMatch.resource()), this.textModelResolverService.createModelReference(replacePreviewUri)])
            .then(function (_a) {
            var sourceModelRef = _a[0], replaceModelRef = _a[1];
            var sourceModel = sourceModelRef.object.textEditorModel;
            var replaceModel = replaceModelRef.object.textEditorModel;
            var returnValue = TPromise.wrap(null);
            // If model is disposed do not update
            if (sourceModel && replaceModel) {
                if (override) {
                    replaceModel.setValue(sourceModel.getValue());
                }
                else {
                    replaceModel.undo();
                }
                _this.applyEditsToPreview(fileMatch, replaceModel);
            }
            return returnValue.then(function () {
                sourceModelRef.dispose();
                replaceModelRef.dispose();
            });
        });
    };
    ReplaceService.prototype.applyEditsToPreview = function (fileMatch, replaceModel) {
        var resourceEdits = this.createEdits(fileMatch, replaceModel.uri);
        var modelEdits = [];
        for (var _i = 0, resourceEdits_1 = resourceEdits; _i < resourceEdits_1.length; _i++) {
            var resourceEdit = resourceEdits_1[_i];
            for (var _a = 0, _b = resourceEdit.edits; _a < _b.length; _a++) {
                var edit = _b[_a];
                var range = Range.lift(edit.range);
                modelEdits.push(EditOperation.replaceMove(range, edit.text));
            }
        }
        replaceModel.pushEditOperations([], mergeSort(modelEdits, function (a, b) { return Range.compareRangesUsingStarts(a.range, b.range); }), function () { return []; });
    };
    ReplaceService.prototype.createEdits = function (arg, resource) {
        var _this = this;
        if (resource === void 0) { resource = null; }
        var edits = [];
        if (arg instanceof Match) {
            var match = arg;
            edits.push(this.createEdit(match, match.replaceString, resource));
        }
        if (arg instanceof FileMatch) {
            arg = [arg];
        }
        if (arg instanceof Array) {
            arg.forEach(function (element) {
                var fileMatch = element;
                if (fileMatch.count() > 0) {
                    edits.push.apply(edits, fileMatch.matches().map(function (match) { return _this.createEdit(match, match.replaceString, resource); }));
                }
            });
        }
        return edits;
    };
    ReplaceService.prototype.createEdit = function (match, text, resource) {
        if (resource === void 0) { resource = null; }
        var fileMatch = match.parent();
        var resourceEdit = {
            resource: resource !== null ? resource : fileMatch.resource(),
            edits: [{
                    range: match.range(),
                    text: text
                }]
        };
        return resourceEdit;
    };
    ReplaceService = __decorate([
        __param(0, ITextFileService),
        __param(1, IEditorService),
        __param(2, ITextModelService),
        __param(3, IBulkEditService)
    ], ReplaceService);
    return ReplaceService;
}());
export { ReplaceService };

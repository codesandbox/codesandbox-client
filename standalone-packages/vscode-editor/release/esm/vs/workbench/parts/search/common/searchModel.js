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
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import * as errors from '../../../../base/common/errors.js';
import { anyEvent, Emitter, fromPromise, stopwatch } from '../../../../base/common/event.js';
import { getBaseLabel } from '../../../../base/common/labels.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap, TernarySearchTree, values } from '../../../../base/common/map.js';
import * as objects from '../../../../base/common/objects.js';
import { lcut } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { Range } from '../../../../editor/common/core/range.js';
import { OverviewRulerLane, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ReplacePattern } from '../../../../platform/search/common/replace.js';
import { ISearchService, TextSearchResult } from '../../../../platform/search/common/search.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { overviewRulerFindMatchForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { IReplaceService } from './replace.js';
var Match = /** @class */ (function () {
    function Match(_parent, _result) {
        this._parent = _parent;
        this._range = new Range(_result.range.startLineNumber + 1, _result.range.startColumn + 1, _result.range.endLineNumber + 1, _result.range.endColumn + 1);
        this._rangeInPreviewText = new Range(_result.preview.match.startLineNumber + 1, _result.preview.match.startColumn + 1, _result.preview.match.endLineNumber + 1, _result.preview.match.endColumn + 1);
        this._previewText = _result.preview.text;
        this._id = this._parent.id() + '>' + this._range + this.getMatchString();
    }
    Match.prototype.id = function () {
        return this._id;
    };
    Match.prototype.parent = function () {
        return this._parent;
    };
    Match.prototype.text = function () {
        return this._previewText;
    };
    Match.prototype.range = function () {
        return this._range;
    };
    Match.prototype.preview = function () {
        var before = this._previewText.substring(0, this._rangeInPreviewText.startColumn - 1), inside = this.getMatchString(), after = this._previewText.substring(this._rangeInPreviewText.endColumn - 1);
        before = lcut(before, 26);
        var charsRemaining = Match.MAX_PREVIEW_CHARS - before.length;
        inside = inside.substr(0, charsRemaining);
        charsRemaining -= inside.length;
        after = after.substr(0, charsRemaining);
        return {
            before: before,
            inside: inside,
            after: after,
        };
    };
    Object.defineProperty(Match.prototype, "replaceString", {
        get: function () {
            var searchModel = this.parent().parent().searchModel;
            var matchString = this.getMatchString();
            var replaceString = searchModel.replacePattern.getReplaceString(matchString);
            // If match string is not matching then regex pattern has a lookahead expression
            if (replaceString === null) {
                replaceString = searchModel.replacePattern.getReplaceString(matchString + this._previewText.substring(this._rangeInPreviewText.endColumn - 1));
            }
            // Match string is still not matching. Could be unsupported matches (multi-line).
            if (replaceString === null) {
                replaceString = searchModel.replacePattern.pattern;
            }
            return replaceString;
        },
        enumerable: true,
        configurable: true
    });
    Match.prototype.getMatchString = function () {
        return this._previewText.substring(this._rangeInPreviewText.startColumn - 1, this._rangeInPreviewText.endColumn - 1);
    };
    Match.MAX_PREVIEW_CHARS = 250;
    return Match;
}());
export { Match };
var FileMatch = /** @class */ (function (_super) {
    __extends(FileMatch, _super);
    function FileMatch(_query, _previewOptions, _maxResults, _parent, rawMatch, modelService, replaceService) {
        var _this = _super.call(this) || this;
        _this._query = _query;
        _this._previewOptions = _previewOptions;
        _this._maxResults = _maxResults;
        _this._parent = _parent;
        _this.rawMatch = rawMatch;
        _this.modelService = modelService;
        _this.replaceService = replaceService;
        _this._onChange = _this._register(new Emitter());
        _this.onChange = _this._onChange.event;
        _this._onDispose = _this._register(new Emitter());
        _this.onDispose = _this._onDispose.event;
        _this._modelDecorations = [];
        _this._resource = _this.rawMatch.resource;
        _this._matches = new Map();
        _this._removedMatches = new Set();
        _this._updateScheduler = new RunOnceScheduler(_this.updateMatchesForModel.bind(_this), 250);
        _this.createMatches();
        _this.registerListeners();
        return _this;
    }
    FileMatch.getDecorationOption = function (selected) {
        return (selected ? FileMatch._CURRENT_FIND_MATCH : FileMatch._FIND_MATCH);
    };
    FileMatch.prototype.createMatches = function () {
        var _this = this;
        var model = this.modelService.getModel(this._resource);
        if (model) {
            this.bindModel(model);
            this.updateMatchesForModel();
        }
        else {
            this.rawMatch.matches.forEach(function (rawLineMatch) {
                var match = new Match(_this, rawLineMatch);
                _this.add(match);
            });
        }
    };
    FileMatch.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.modelService.onModelAdded(function (model) {
            if (model.uri.toString() === _this._resource.toString()) {
                _this.bindModel(model);
            }
        }));
    };
    FileMatch.prototype.bindModel = function (model) {
        var _this = this;
        this._model = model;
        this._modelListener = this._model.onDidChangeContent(function () {
            _this._updateScheduler.schedule();
        });
        this._model.onWillDispose(function () { return _this.onModelWillDispose(); });
        this.updateHighlights();
    };
    FileMatch.prototype.onModelWillDispose = function () {
        // Update matches because model might have some dirty changes
        this.updateMatchesForModel();
        this.unbindModel();
    };
    FileMatch.prototype.unbindModel = function () {
        if (this._model) {
            this._updateScheduler.cancel();
            this._model.deltaDecorations(this._modelDecorations, []);
            this._model = null;
            this._modelListener.dispose();
        }
    };
    FileMatch.prototype.updateMatchesForModel = function () {
        // this is called from a timeout and might fire
        // after the model has been disposed
        if (!this._model) {
            return;
        }
        this._matches = new Map();
        var matches = this._model
            .findMatches(this._query.pattern, this._model.getFullModelRange(), this._query.isRegExp, this._query.isCaseSensitive, this._query.isWordMatch ? this._query.wordSeparators : null, false, this._maxResults);
        this.updateMatches(matches, true);
    };
    FileMatch.prototype.updatesMatchesForLineAfterReplace = function (lineNumber, modelChange) {
        var _this = this;
        var range = {
            startLineNumber: lineNumber,
            startColumn: this._model.getLineMinColumn(lineNumber),
            endLineNumber: lineNumber,
            endColumn: this._model.getLineMaxColumn(lineNumber)
        };
        var oldMatches = values(this._matches).filter(function (match) { return match.range().startLineNumber === lineNumber; });
        oldMatches.forEach(function (match) { return _this._matches.delete(match.id()); });
        var matches = this._model.findMatches(this._query.pattern, range, this._query.isRegExp, this._query.isCaseSensitive, this._query.isWordMatch ? this._query.wordSeparators : null, false, this._maxResults);
        this.updateMatches(matches, modelChange);
    };
    FileMatch.prototype.updateMatches = function (matches, modelChange) {
        var _this = this;
        matches.forEach(function (m) {
            var textSearchResult = editorMatchToTextSearchResult(m, _this._model, _this._previewOptions);
            var match = new Match(_this, textSearchResult);
            if (!_this._removedMatches.has(match.id())) {
                _this.add(match);
                if (_this.isMatchSelected(match)) {
                    _this._selectedMatch = match;
                }
            }
        });
        this._onChange.fire(modelChange);
        this.updateHighlights();
    };
    FileMatch.prototype.updateHighlights = function () {
        var _this = this;
        if (!this._model) {
            return;
        }
        if (this.parent().showHighlights) {
            this._modelDecorations = this._model.deltaDecorations(this._modelDecorations, this.matches().map(function (match) { return ({
                range: match.range(),
                options: FileMatch.getDecorationOption(_this.isMatchSelected(match))
            }); }));
        }
        else {
            this._modelDecorations = this._model.deltaDecorations(this._modelDecorations, []);
        }
    };
    FileMatch.prototype.id = function () {
        return this.resource().toString();
    };
    FileMatch.prototype.parent = function () {
        return this._parent;
    };
    FileMatch.prototype.matches = function () {
        return values(this._matches);
    };
    FileMatch.prototype.remove = function (match) {
        this.removeMatch(match);
        this._removedMatches.add(match.id());
        this._onChange.fire(false);
    };
    FileMatch.prototype.replace = function (toReplace) {
        var _this = this;
        return this.replaceService.replace(toReplace)
            .then(function () { return _this.updatesMatchesForLineAfterReplace(toReplace.range().startLineNumber, false); });
    };
    FileMatch.prototype.setSelectedMatch = function (match) {
        if (match) {
            if (!this._matches.has(match.id())) {
                return;
            }
            if (this.isMatchSelected(match)) {
                return;
            }
        }
        this._selectedMatch = match;
        this.updateHighlights();
    };
    FileMatch.prototype.getSelectedMatch = function () {
        return this._selectedMatch;
    };
    FileMatch.prototype.isMatchSelected = function (match) {
        return this._selectedMatch && this._selectedMatch.id() === match.id();
    };
    FileMatch.prototype.count = function () {
        return this.matches().length;
    };
    FileMatch.prototype.resource = function () {
        return this._resource;
    };
    FileMatch.prototype.name = function () {
        return getBaseLabel(this.resource());
    };
    FileMatch.prototype.add = function (match, trigger) {
        this._matches.set(match.id(), match);
        if (trigger) {
            this._onChange.fire(true);
        }
    };
    FileMatch.prototype.removeMatch = function (match) {
        this._matches.delete(match.id());
        if (this.isMatchSelected(match)) {
            this.setSelectedMatch(null);
        }
        else {
            this.updateHighlights();
        }
    };
    FileMatch.prototype.dispose = function () {
        this.setSelectedMatch(null);
        this.unbindModel();
        this._onDispose.fire();
        _super.prototype.dispose.call(this);
    };
    FileMatch._CURRENT_FIND_MATCH = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        zIndex: 13,
        className: 'currentFindMatch',
        overviewRuler: {
            color: themeColorFromId(overviewRulerFindMatchForeground),
            position: OverviewRulerLane.Center
        }
    });
    FileMatch._FIND_MATCH = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'findMatch',
        overviewRuler: {
            color: themeColorFromId(overviewRulerFindMatchForeground),
            position: OverviewRulerLane.Center
        }
    });
    FileMatch = __decorate([
        __param(5, IModelService), __param(6, IReplaceService)
    ], FileMatch);
    return FileMatch;
}(Disposable));
export { FileMatch };
var FolderMatch = /** @class */ (function (_super) {
    __extends(FolderMatch, _super);
    function FolderMatch(_resource, _id, _index, _query, _parent, _searchModel, replaceService, instantiationService) {
        var _this = _super.call(this) || this;
        _this._resource = _resource;
        _this._id = _id;
        _this._index = _index;
        _this._query = _query;
        _this._parent = _parent;
        _this._searchModel = _searchModel;
        _this.replaceService = replaceService;
        _this.instantiationService = instantiationService;
        _this._onChange = _this._register(new Emitter());
        _this.onChange = _this._onChange.event;
        _this._onDispose = _this._register(new Emitter());
        _this.onDispose = _this._onDispose.event;
        _this._replacingAll = false;
        _this._fileMatches = new ResourceMap();
        _this._unDisposedFileMatches = new ResourceMap();
        return _this;
    }
    Object.defineProperty(FolderMatch.prototype, "searchModel", {
        get: function () {
            return this._searchModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FolderMatch.prototype, "showHighlights", {
        get: function () {
            return this._parent.showHighlights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FolderMatch.prototype, "replacingAll", {
        set: function (b) {
            this._replacingAll = b;
        },
        enumerable: true,
        configurable: true
    });
    FolderMatch.prototype.id = function () {
        return this._id;
    };
    FolderMatch.prototype.resource = function () {
        return this._resource;
    };
    FolderMatch.prototype.index = function () {
        return this._index;
    };
    FolderMatch.prototype.name = function () {
        return getBaseLabel(this.resource());
    };
    FolderMatch.prototype.parent = function () {
        return this._parent;
    };
    FolderMatch.prototype.hasResource = function () {
        return !!this._resource;
    };
    FolderMatch.prototype.add = function (raw, silent) {
        var _this = this;
        var changed = [];
        raw.forEach(function (rawFileMatch) {
            if (_this._fileMatches.has(rawFileMatch.resource)) {
                _this._fileMatches.get(rawFileMatch.resource).dispose();
            }
            var fileMatch = _this.instantiationService.createInstance(FileMatch, _this._query.contentPattern, _this._query.previewOptions, _this._query.maxResults, _this, rawFileMatch);
            _this.doAdd(fileMatch);
            changed.push(fileMatch);
            var disposable = fileMatch.onChange(function () { return _this.onFileChange(fileMatch); });
            fileMatch.onDispose(function () { return disposable.dispose(); });
        });
        if (!silent && changed.length) {
            this._onChange.fire({ elements: changed, added: true });
        }
    };
    FolderMatch.prototype.clear = function () {
        var changed = this.matches();
        this.disposeMatches();
        this._onChange.fire({ elements: changed, removed: true });
    };
    FolderMatch.prototype.remove = function (match) {
        this.doRemove(match);
    };
    FolderMatch.prototype.replace = function (match) {
        var _this = this;
        return this.replaceService.replace([match]).then(function () {
            _this.doRemove(match, false, true);
        });
    };
    FolderMatch.prototype.replaceAll = function () {
        var _this = this;
        var matches = this.matches();
        return this.replaceService.replace(matches).then(function () {
            matches.forEach(function (match) { return _this.doRemove(match, false, true); });
        });
    };
    FolderMatch.prototype.matches = function () {
        return this._fileMatches.values();
    };
    FolderMatch.prototype.isEmpty = function () {
        return this.fileCount() === 0;
    };
    FolderMatch.prototype.fileCount = function () {
        return this._fileMatches.size;
    };
    FolderMatch.prototype.count = function () {
        return this.matches().reduce(function (prev, match) { return prev + match.count(); }, 0);
    };
    FolderMatch.prototype.onFileChange = function (fileMatch) {
        var added = false;
        var removed = false;
        if (!this._fileMatches.has(fileMatch.resource())) {
            this.doAdd(fileMatch);
            added = true;
        }
        if (fileMatch.count() === 0) {
            this.doRemove(fileMatch, false, false);
            added = false;
            removed = true;
        }
        if (!this._replacingAll) {
            this._onChange.fire({ elements: [fileMatch], added: added, removed: removed });
        }
    };
    FolderMatch.prototype.doAdd = function (fileMatch) {
        this._fileMatches.set(fileMatch.resource(), fileMatch);
        if (this._unDisposedFileMatches.has(fileMatch.resource())) {
            this._unDisposedFileMatches.delete(fileMatch.resource());
        }
    };
    FolderMatch.prototype.doRemove = function (fileMatch, dispose, trigger) {
        if (dispose === void 0) { dispose = true; }
        if (trigger === void 0) { trigger = true; }
        this._fileMatches.delete(fileMatch.resource());
        if (dispose) {
            fileMatch.dispose();
        }
        else {
            this._unDisposedFileMatches.set(fileMatch.resource(), fileMatch);
        }
        if (trigger) {
            this._onChange.fire({ elements: [fileMatch], removed: true });
        }
    };
    FolderMatch.prototype.disposeMatches = function () {
        this._fileMatches.values().forEach(function (fileMatch) { return fileMatch.dispose(); });
        this._unDisposedFileMatches.values().forEach(function (fileMatch) { return fileMatch.dispose(); });
        this._fileMatches.clear();
        this._unDisposedFileMatches.clear();
    };
    FolderMatch.prototype.dispose = function () {
        this.disposeMatches();
        this._onDispose.fire();
        _super.prototype.dispose.call(this);
    };
    FolderMatch = __decorate([
        __param(6, IReplaceService),
        __param(7, IInstantiationService)
    ], FolderMatch);
    return FolderMatch;
}(Disposable));
export { FolderMatch };
/**
 * Compares instances of the same match type. Different match types should not be siblings
 * and their sort order is undefined.
 */
export function searchMatchComparer(elementA, elementB) {
    if (elementA instanceof FolderMatch && elementB instanceof FolderMatch) {
        return elementA.index() - elementB.index();
    }
    if (elementA instanceof FileMatch && elementB instanceof FileMatch) {
        return elementA.resource().fsPath.localeCompare(elementB.resource().fsPath) || elementA.name().localeCompare(elementB.name());
    }
    if (elementA instanceof Match && elementB instanceof Match) {
        return Range.compareRangesUsingStarts(elementA.range(), elementB.range());
    }
    return undefined;
}
var SearchResult = /** @class */ (function (_super) {
    __extends(SearchResult, _super);
    function SearchResult(_searchModel, replaceService, telemetryService, instantiationService) {
        var _this = _super.call(this) || this;
        _this._searchModel = _searchModel;
        _this.replaceService = replaceService;
        _this.telemetryService = telemetryService;
        _this.instantiationService = instantiationService;
        _this._onChange = _this._register(new Emitter());
        _this.onChange = _this._onChange.event;
        _this._folderMatches = [];
        _this._folderMatchesMap = TernarySearchTree.forPaths();
        _this._rangeHighlightDecorations = _this.instantiationService.createInstance(RangeHighlightDecorations);
        return _this;
    }
    Object.defineProperty(SearchResult.prototype, "query", {
        set: function (query) {
            var _this = this;
            // When updating the query we could change the roots, so ensure we clean up the old roots first.
            this.clear();
            this._folderMatches = (query.folderQueries || [])
                .map(function (fq) { return fq.folder; })
                .map(function (resource, index) { return _this.createFolderMatch(resource, resource.toString(), index, query); });
            this._folderMatches.forEach(function (fm) { return _this._folderMatchesMap.set(fm.resource().toString(), fm); });
            this._otherFilesMatch = this.createFolderMatch(null, 'otherFiles', this._folderMatches.length + 1, query);
        },
        enumerable: true,
        configurable: true
    });
    SearchResult.prototype.createFolderMatch = function (resource, id, index, query) {
        var _this = this;
        var folderMatch = this.instantiationService.createInstance(FolderMatch, resource, id, index, query, this, this._searchModel);
        var disposable = folderMatch.onChange(function (event) { return _this._onChange.fire(event); });
        folderMatch.onDispose(function () { return disposable.dispose(); });
        return folderMatch;
    };
    Object.defineProperty(SearchResult.prototype, "searchModel", {
        get: function () {
            return this._searchModel;
        },
        enumerable: true,
        configurable: true
    });
    SearchResult.prototype.add = function (allRaw, silent) {
        var _this = this;
        if (silent === void 0) { silent = false; }
        // Split up raw into a list per folder so we can do a batch add per folder.
        var rawPerFolder = new ResourceMap();
        var otherFileMatches = [];
        this._folderMatches.forEach(function (folderMatch) { return rawPerFolder.set(folderMatch.resource(), []); });
        allRaw.forEach(function (rawFileMatch) {
            var folderMatch = _this.getFolderMatch(rawFileMatch.resource);
            if (folderMatch.resource()) {
                rawPerFolder.get(folderMatch.resource()).push(rawFileMatch);
            }
            else {
                otherFileMatches.push(rawFileMatch);
            }
        });
        rawPerFolder.forEach(function (raw) {
            if (!raw.length) {
                return;
            }
            var folderMatch = _this.getFolderMatch(raw[0].resource);
            if (folderMatch) {
                folderMatch.add(raw, silent);
            }
        });
        this.otherFiles.add(otherFileMatches, silent);
    };
    SearchResult.prototype.clear = function () {
        this.folderMatches().forEach(function (folderMatch) { return folderMatch.clear(); });
        this.disposeMatches();
    };
    SearchResult.prototype.remove = function (match) {
        if (match instanceof FileMatch) {
            this.getFolderMatch(match.resource()).remove(match);
        }
        else {
            match.clear();
        }
    };
    SearchResult.prototype.replace = function (match) {
        return this.getFolderMatch(match.resource()).replace(match);
    };
    SearchResult.prototype.replaceAll = function (progressRunner) {
        var _this = this;
        this.replacingAll = true;
        var promise = this.replaceService.replace(this.matches(), progressRunner);
        var onDone = stopwatch(fromPromise(promise));
        /* __GDPR__
            "replaceAll.started" : {
                "duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
            }
        */
        onDone(function (duration) { return _this.telemetryService.publicLog('replaceAll.started', { duration: duration }); });
        return promise.then(function () {
            _this.replacingAll = false;
            _this.clear();
        }, function () {
            _this.replacingAll = false;
        });
    };
    SearchResult.prototype.folderMatches = function () {
        return this._otherFilesMatch ?
            this._folderMatches.concat(this._otherFilesMatch) :
            this._folderMatches.concat();
    };
    SearchResult.prototype.matches = function () {
        var matches = [];
        this.folderMatches().forEach(function (folderMatch) {
            matches.push(folderMatch.matches());
        });
        return [].concat.apply([], matches);
    };
    SearchResult.prototype.isEmpty = function () {
        return this.folderMatches().every(function (folderMatch) { return folderMatch.isEmpty(); });
    };
    SearchResult.prototype.fileCount = function () {
        return this.folderMatches().reduce(function (prev, match) { return prev + match.fileCount(); }, 0);
    };
    SearchResult.prototype.count = function () {
        return this.matches().reduce(function (prev, match) { return prev + match.count(); }, 0);
    };
    Object.defineProperty(SearchResult.prototype, "showHighlights", {
        get: function () {
            return this._showHighlights;
        },
        enumerable: true,
        configurable: true
    });
    SearchResult.prototype.toggleHighlights = function (value) {
        if (this._showHighlights === value) {
            return;
        }
        this._showHighlights = value;
        var selectedMatch = null;
        this.matches().forEach(function (fileMatch) {
            fileMatch.updateHighlights();
            if (!selectedMatch) {
                selectedMatch = fileMatch.getSelectedMatch();
            }
        });
        if (this._showHighlights && selectedMatch) {
            this._rangeHighlightDecorations.highlightRange(selectedMatch.parent().resource(), selectedMatch.range());
        }
        else {
            this._rangeHighlightDecorations.removeHighlightRange();
        }
    };
    Object.defineProperty(SearchResult.prototype, "rangeHighlightDecorations", {
        get: function () {
            return this._rangeHighlightDecorations;
        },
        enumerable: true,
        configurable: true
    });
    SearchResult.prototype.getFolderMatch = function (resource) {
        var folderMatch = this._folderMatchesMap.findSubstr(resource.toString());
        return folderMatch ? folderMatch : this.otherFiles;
    };
    Object.defineProperty(SearchResult.prototype, "otherFiles", {
        get: function () {
            return this._otherFilesMatch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchResult.prototype, "replacingAll", {
        set: function (running) {
            this.folderMatches().forEach(function (folderMatch) {
                folderMatch.replacingAll = running;
            });
        },
        enumerable: true,
        configurable: true
    });
    SearchResult.prototype.disposeMatches = function () {
        this.folderMatches().forEach(function (folderMatch) { return folderMatch.dispose(); });
        this._folderMatches = [];
        this._otherFilesMatch = null;
        this._folderMatchesMap = TernarySearchTree.forPaths();
        this._rangeHighlightDecorations.removeHighlightRange();
    };
    SearchResult.prototype.dispose = function () {
        this.disposeMatches();
        this._rangeHighlightDecorations.dispose();
        _super.prototype.dispose.call(this);
    };
    SearchResult = __decorate([
        __param(1, IReplaceService), __param(2, ITelemetryService),
        __param(3, IInstantiationService)
    ], SearchResult);
    return SearchResult;
}(Disposable));
export { SearchResult };
var SearchModel = /** @class */ (function (_super) {
    __extends(SearchModel, _super);
    function SearchModel(searchService, telemetryService, instantiationService) {
        var _this = _super.call(this) || this;
        _this.searchService = searchService;
        _this.telemetryService = telemetryService;
        _this.instantiationService = instantiationService;
        _this._searchQuery = null;
        _this._replaceActive = false;
        _this._replaceString = null;
        _this._replacePattern = null;
        _this._onReplaceTermChanged = _this._register(new Emitter());
        _this.onReplaceTermChanged = _this._onReplaceTermChanged.event;
        _this._searchResult = _this.instantiationService.createInstance(SearchResult, _this);
        return _this;
    }
    SearchModel.prototype.isReplaceActive = function () {
        return this._replaceActive;
    };
    Object.defineProperty(SearchModel.prototype, "replaceActive", {
        set: function (replaceActive) {
            this._replaceActive = replaceActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchModel.prototype, "replacePattern", {
        get: function () {
            return this._replacePattern;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchModel.prototype, "replaceString", {
        get: function () {
            return this._replaceString;
        },
        set: function (replaceString) {
            this._replaceString = replaceString;
            if (this._searchQuery) {
                this._replacePattern = new ReplacePattern(replaceString, this._searchQuery.contentPattern);
            }
            this._onReplaceTermChanged.fire();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchModel.prototype, "searchResult", {
        get: function () {
            return this._searchResult;
        },
        enumerable: true,
        configurable: true
    });
    SearchModel.prototype.search = function (query, onProgress) {
        var _this = this;
        this.cancelSearch();
        this._searchQuery = query;
        this.searchResult.clear();
        this._searchResult.query = this._searchQuery;
        var progressEmitter = new Emitter();
        this._replacePattern = new ReplacePattern(this._replaceString, this._searchQuery.contentPattern);
        var tokenSource = this.currentCancelTokenSource = new CancellationTokenSource();
        var currentRequest = this.searchService.search(this._searchQuery, this.currentCancelTokenSource.token, function (p) {
            progressEmitter.fire();
            _this.onSearchProgress(p);
            if (onProgress) {
                onProgress(p);
            }
        });
        var dispose = function () { return tokenSource.dispose(); };
        currentRequest.then(dispose, dispose);
        var onDone = fromPromise(currentRequest);
        var onFirstRender = anyEvent(onDone, progressEmitter.event);
        var onFirstRenderStopwatch = stopwatch(onFirstRender);
        /* __GDPR__
            "searchResultsFirstRender" : {
                "duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
            }
        */
        onFirstRenderStopwatch(function (duration) { return _this.telemetryService.publicLog('searchResultsFirstRender', { duration: duration }); });
        var onDoneStopwatch = stopwatch(onDone);
        var start = Date.now();
        /* __GDPR__
            "searchResultsFinished" : {
                "duration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
            }
        */
        onDoneStopwatch(function (duration) { return _this.telemetryService.publicLog('searchResultsFinished', { duration: duration }); });
        currentRequest.then(function (value) { return _this.onSearchCompleted(value, Date.now() - start); }, function (e) { return _this.onSearchError(e, Date.now() - start); });
        return currentRequest;
    };
    SearchModel.prototype.onSearchCompleted = function (completed, duration) {
        var options = objects.assign({}, this._searchQuery.contentPattern);
        delete options.pattern;
        var stats = completed && completed.stats;
        var fileSchemeOnly = this._searchQuery.folderQueries.every(function (fq) { return fq.folder.scheme === 'file'; });
        var otherSchemeOnly = this._searchQuery.folderQueries.every(function (fq) { return fq.folder.scheme !== 'file'; });
        var scheme = fileSchemeOnly ? 'file' :
            otherSchemeOnly ? 'other' :
                'mixed';
        /* __GDPR__
            "searchResultsShown" : {
                "count" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "fileCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "options": { "${inline}": [ "${IPatternInfo}" ] },
                "duration": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                "useRipgrep": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "type" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                "scheme" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
            }
        */
        this.telemetryService.publicLog('searchResultsShown', {
            count: this._searchResult.count(),
            fileCount: this._searchResult.fileCount(),
            options: options,
            duration: duration,
            useRipgrep: this._searchQuery.useRipgrep,
            type: stats && stats.type,
            scheme: scheme
        });
        return completed;
    };
    SearchModel.prototype.onSearchError = function (e, duration) {
        if (errors.isPromiseCanceledError(e)) {
            this.onSearchCompleted(null, duration);
        }
    };
    SearchModel.prototype.onSearchProgress = function (p) {
        if (p.resource) {
            this._searchResult.add([p], true);
        }
    };
    SearchModel.prototype.cancelSearch = function () {
        if (this.currentCancelTokenSource) {
            this.currentCancelTokenSource.cancel();
            return true;
        }
        return false;
    };
    SearchModel.prototype.dispose = function () {
        this.cancelSearch();
        this.searchResult.dispose();
        _super.prototype.dispose.call(this);
    };
    SearchModel = __decorate([
        __param(0, ISearchService), __param(1, ITelemetryService), __param(2, IInstantiationService)
    ], SearchModel);
    return SearchModel;
}(Disposable));
export { SearchModel };
var SearchWorkbenchService = /** @class */ (function () {
    function SearchWorkbenchService(instantiationService) {
        this.instantiationService = instantiationService;
    }
    Object.defineProperty(SearchWorkbenchService.prototype, "searchModel", {
        get: function () {
            if (!this._searchModel) {
                this._searchModel = this.instantiationService.createInstance(SearchModel);
            }
            return this._searchModel;
        },
        enumerable: true,
        configurable: true
    });
    SearchWorkbenchService = __decorate([
        __param(0, IInstantiationService)
    ], SearchWorkbenchService);
    return SearchWorkbenchService;
}());
export { SearchWorkbenchService };
export var ISearchWorkbenchService = createDecorator('searchWorkbenchService');
/**
 * Can add a range highlight decoration to a model.
 * It will automatically remove it when the model has its decorations changed.
 */
var RangeHighlightDecorations = /** @class */ (function () {
    function RangeHighlightDecorations(_modelService) {
        this._modelService = _modelService;
        this._decorationId = null;
        this._model = null;
        this._modelDisposables = [];
    }
    RangeHighlightDecorations.prototype.removeHighlightRange = function () {
        if (this._model && this._decorationId) {
            this._model.deltaDecorations([this._decorationId], []);
        }
        this._decorationId = null;
    };
    RangeHighlightDecorations.prototype.highlightRange = function (resource, range, ownerId) {
        if (ownerId === void 0) { ownerId = 0; }
        var model;
        if (URI.isUri(resource)) {
            model = this._modelService.getModel(resource);
        }
        else {
            model = resource;
        }
        if (model) {
            this.doHighlightRange(model, range);
        }
    };
    RangeHighlightDecorations.prototype.doHighlightRange = function (model, range) {
        this.removeHighlightRange();
        this._decorationId = model.deltaDecorations([], [{ range: range, options: RangeHighlightDecorations._RANGE_HIGHLIGHT_DECORATION }])[0];
        this.setModel(model);
    };
    RangeHighlightDecorations.prototype.setModel = function (model) {
        var _this = this;
        if (this._model !== model) {
            this.disposeModelListeners();
            this._model = model;
            this._modelDisposables.push(this._model.onDidChangeDecorations(function (e) {
                _this.disposeModelListeners();
                _this.removeHighlightRange();
                _this._model = null;
            }));
            this._modelDisposables.push(this._model.onWillDispose(function () {
                _this.disposeModelListeners();
                _this.removeHighlightRange();
                _this._model = null;
            }));
        }
    };
    RangeHighlightDecorations.prototype.disposeModelListeners = function () {
        this._modelDisposables.forEach(function (disposable) { return disposable.dispose(); });
        this._modelDisposables = [];
    };
    RangeHighlightDecorations.prototype.dispose = function () {
        if (this._model) {
            this.removeHighlightRange();
            this.disposeModelListeners();
            this._model = null;
        }
    };
    RangeHighlightDecorations._RANGE_HIGHLIGHT_DECORATION = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'rangeHighlight',
        isWholeLine: true
    });
    RangeHighlightDecorations = __decorate([
        __param(0, IModelService)
    ], RangeHighlightDecorations);
    return RangeHighlightDecorations;
}());
export { RangeHighlightDecorations };
/**
 * While search doesn't support multiline matches, collapse editor matches to a single line
 */
export function editorMatchToTextSearchResult(match, model, previewOptions) {
    var endLineNumber = match.range.endLineNumber - 1;
    var endCol = match.range.endColumn - 1;
    if (match.range.endLineNumber !== match.range.startLineNumber) {
        endLineNumber = match.range.startLineNumber - 1;
        endCol = model.getLineLength(match.range.startLineNumber);
    }
    return new TextSearchResult(model.getLineContent(match.range.startLineNumber), new Range(match.range.startLineNumber - 1, match.range.startColumn - 1, endLineNumber, endCol), previewOptions);
}

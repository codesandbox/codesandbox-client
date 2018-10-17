/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../nls.js';
import * as network from '../../../base/common/network.js';
import { Emitter } from '../../../base/common/event.js';
import { MarkdownString } from '../../../base/common/htmlContent.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { IMarkerService, MarkerSeverity, MarkerTag } from '../../../platform/markers/common/markers.js';
import { Range } from '../core/range.js';
import { TextModel, createTextBuffer } from '../model/textModel.js';
import * as platform from '../../../base/common/platform.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { EDITOR_MODEL_DEFAULTS } from '../config/editorOptions.js';
import { PLAINTEXT_LANGUAGE_IDENTIFIER } from '../modes/modesRegistry.js';
import { EditOperation } from '../core/editOperation.js';
import { themeColorFromId } from '../../../platform/theme/common/themeService.js';
import { overviewRulerWarning, overviewRulerError, overviewRulerInfo } from '../view/editorColorRegistry.js';
import { TrackedRangeStickiness, OverviewRulerLane, DefaultEndOfLine, EndOfLineSequence, EndOfLinePreference } from '../model.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { basename } from '../../../base/common/paths.js';
import { isThenable } from '../../../base/common/async.js';
function MODEL_ID(resource) {
    return resource.toString();
}
var ModelData = /** @class */ (function () {
    function ModelData(model, onWillDispose, onDidChangeLanguage) {
        this.model = model;
        this._markerDecorations = [];
        this._modelEventListeners = [];
        this._modelEventListeners.push(model.onWillDispose(function () { return onWillDispose(model); }));
        this._modelEventListeners.push(model.onDidChangeLanguage(function (e) { return onDidChangeLanguage(model, e); }));
    }
    ModelData.prototype.dispose = function () {
        this._markerDecorations = this.model.deltaDecorations(this._markerDecorations, []);
        this._modelEventListeners = dispose(this._modelEventListeners);
        this.model = null;
    };
    ModelData.prototype.acceptMarkerDecorations = function (newDecorations) {
        this._markerDecorations = this.model.deltaDecorations(this._markerDecorations, newDecorations);
    };
    return ModelData;
}());
var ModelMarkerHandler = /** @class */ (function () {
    function ModelMarkerHandler() {
    }
    ModelMarkerHandler.setMarkers = function (modelData, markerService) {
        // Limit to the first 500 errors/warnings
        var markers = markerService.read({ resource: modelData.model.uri, take: 500 });
        var newModelDecorations = markers.map(function (marker) {
            return {
                range: ModelMarkerHandler._createDecorationRange(modelData.model, marker),
                options: ModelMarkerHandler._createDecorationOption(marker)
            };
        });
        modelData.acceptMarkerDecorations(newModelDecorations);
    };
    ModelMarkerHandler._createDecorationRange = function (model, rawMarker) {
        var ret = Range.lift(rawMarker);
        if (rawMarker.severity === MarkerSeverity.Hint) {
            if (!rawMarker.tags || rawMarker.tags.indexOf(MarkerTag.Unnecessary) === -1) {
                // * never render hints on multiple lines
                // * make enough space for three dots
                ret = ret.setEndPosition(ret.startLineNumber, ret.startColumn + 2);
            }
        }
        ret = model.validateRange(ret);
        if (ret.isEmpty()) {
            var word = model.getWordAtPosition(ret.getStartPosition());
            if (word) {
                ret = new Range(ret.startLineNumber, word.startColumn, ret.endLineNumber, word.endColumn);
            }
            else {
                var maxColumn = model.getLineLastNonWhitespaceColumn(ret.startLineNumber) ||
                    model.getLineMaxColumn(ret.startLineNumber);
                if (maxColumn === 1) {
                    // empty line
                    // console.warn('marker on empty line:', marker);
                }
                else if (ret.endColumn >= maxColumn) {
                    // behind eol
                    ret = new Range(ret.startLineNumber, maxColumn - 1, ret.endLineNumber, maxColumn);
                }
                else {
                    // extend marker to width = 1
                    ret = new Range(ret.startLineNumber, ret.startColumn, ret.endLineNumber, ret.endColumn + 1);
                }
            }
        }
        else if (rawMarker.endColumn === Number.MAX_VALUE && rawMarker.startColumn === 1 && ret.startLineNumber === ret.endLineNumber) {
            var minColumn = model.getLineFirstNonWhitespaceColumn(rawMarker.startLineNumber);
            if (minColumn < ret.endColumn) {
                ret = new Range(ret.startLineNumber, minColumn, ret.endLineNumber, ret.endColumn);
                rawMarker.startColumn = minColumn;
            }
        }
        return ret;
    };
    ModelMarkerHandler._createDecorationOption = function (marker) {
        var className;
        var color;
        var zIndex;
        var inlineClassName;
        switch (marker.severity) {
            case MarkerSeverity.Hint:
                if (marker.tags && marker.tags.indexOf(MarkerTag.Unnecessary) >= 0) {
                    className = "squiggly-unnecessary" /* EditorUnnecessaryDecoration */;
                }
                else {
                    className = "squiggly-hint" /* EditorHintDecoration */;
                }
                zIndex = 0;
                break;
            case MarkerSeverity.Warning:
                className = "squiggly-warning" /* EditorWarningDecoration */;
                color = themeColorFromId(overviewRulerWarning);
                zIndex = 20;
                break;
            case MarkerSeverity.Info:
                className = "squiggly-info" /* EditorInfoDecoration */;
                color = themeColorFromId(overviewRulerInfo);
                zIndex = 10;
                break;
            case MarkerSeverity.Error:
            default:
                className = "squiggly-error" /* EditorErrorDecoration */;
                color = themeColorFromId(overviewRulerError);
                zIndex = 30;
                break;
        }
        if (marker.tags) {
            if (marker.tags.indexOf(MarkerTag.Unnecessary) !== -1) {
                inlineClassName = "squiggly-inline-unnecessary" /* EditorUnnecessaryInlineDecoration */;
            }
        }
        var hoverMessage = null;
        var message = marker.message, source = marker.source, relatedInformation = marker.relatedInformation;
        if (typeof message === 'string') {
            message = message.trim();
            if (source) {
                if (/\n/g.test(message)) {
                    message = nls.localize('diagAndSourceMultiline', "[{0}]\n{1}", source, message);
                }
                else {
                    message = nls.localize('diagAndSource', "[{0}] {1}", source, message);
                }
            }
            hoverMessage = new MarkdownString().appendCodeblock('_', message);
            if (!isFalsyOrEmpty(relatedInformation)) {
                hoverMessage.appendMarkdown('\n');
                for (var _i = 0, relatedInformation_1 = relatedInformation; _i < relatedInformation_1.length; _i++) {
                    var _a = relatedInformation_1[_i], message_1 = _a.message, resource = _a.resource, startLineNumber = _a.startLineNumber, startColumn = _a.startColumn;
                    hoverMessage.appendMarkdown("* [" + basename(resource.path) + "(" + startLineNumber + ", " + startColumn + ")](" + resource.toString(false) + "#" + startLineNumber + "," + startColumn + "): ");
                    hoverMessage.appendText("" + message_1);
                    hoverMessage.appendMarkdown('\n');
                }
                hoverMessage.appendMarkdown('\n');
            }
        }
        return {
            stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: className,
            hoverMessage: hoverMessage,
            showIfCollapsed: true,
            overviewRuler: {
                color: color,
                position: OverviewRulerLane.Right
            },
            zIndex: zIndex,
            inlineClassName: inlineClassName,
        };
    };
    return ModelMarkerHandler;
}());
var DEFAULT_EOL = (platform.isLinux || platform.isMacintosh) ? DefaultEndOfLine.LF : DefaultEndOfLine.CRLF;
var ModelServiceImpl = /** @class */ (function () {
    function ModelServiceImpl(markerService, configurationService) {
        var _this = this;
        this._markerService = markerService;
        this._configurationService = configurationService;
        this._models = {};
        this._modelCreationOptionsByLanguageAndResource = Object.create(null);
        this._onModelAdded = new Emitter();
        this._onModelRemoved = new Emitter();
        this._onModelModeChanged = new Emitter();
        if (this._markerService) {
            this._markerServiceSubscription = this._markerService.onMarkerChanged(this._handleMarkerChange, this);
        }
        this._configurationServiceSubscription = this._configurationService.onDidChangeConfiguration(function (e) { return _this._updateModelOptions(); });
        this._updateModelOptions();
    }
    ModelServiceImpl._readModelOptions = function (config, isForSimpleWidget) {
        var tabSize = EDITOR_MODEL_DEFAULTS.tabSize;
        if (config.editor && typeof config.editor.tabSize !== 'undefined') {
            var parsedTabSize = parseInt(config.editor.tabSize, 10);
            if (!isNaN(parsedTabSize)) {
                tabSize = parsedTabSize;
            }
            if (tabSize < 1) {
                tabSize = 1;
            }
        }
        var insertSpaces = EDITOR_MODEL_DEFAULTS.insertSpaces;
        if (config.editor && typeof config.editor.insertSpaces !== 'undefined') {
            insertSpaces = (config.editor.insertSpaces === 'false' ? false : Boolean(config.editor.insertSpaces));
        }
        var newDefaultEOL = DEFAULT_EOL;
        var eol = config.files && config.files.eol;
        if (eol === '\r\n') {
            newDefaultEOL = DefaultEndOfLine.CRLF;
        }
        else if (eol === '\n') {
            newDefaultEOL = DefaultEndOfLine.LF;
        }
        var trimAutoWhitespace = EDITOR_MODEL_DEFAULTS.trimAutoWhitespace;
        if (config.editor && typeof config.editor.trimAutoWhitespace !== 'undefined') {
            trimAutoWhitespace = (config.editor.trimAutoWhitespace === 'false' ? false : Boolean(config.editor.trimAutoWhitespace));
        }
        var detectIndentation = EDITOR_MODEL_DEFAULTS.detectIndentation;
        if (config.editor && typeof config.editor.detectIndentation !== 'undefined') {
            detectIndentation = (config.editor.detectIndentation === 'false' ? false : Boolean(config.editor.detectIndentation));
        }
        var largeFileOptimizations = EDITOR_MODEL_DEFAULTS.largeFileOptimizations;
        if (config.editor && typeof config.editor.largeFileOptimizations !== 'undefined') {
            largeFileOptimizations = (config.editor.largeFileOptimizations === 'false' ? false : Boolean(config.editor.largeFileOptimizations));
        }
        return {
            isForSimpleWidget: isForSimpleWidget,
            tabSize: tabSize,
            insertSpaces: insertSpaces,
            detectIndentation: detectIndentation,
            defaultEOL: newDefaultEOL,
            trimAutoWhitespace: trimAutoWhitespace,
            largeFileOptimizations: largeFileOptimizations
        };
    };
    ModelServiceImpl.prototype.getCreationOptions = function (language, resource, isForSimpleWidget) {
        var creationOptions = this._modelCreationOptionsByLanguageAndResource[language + resource];
        if (!creationOptions) {
            creationOptions = ModelServiceImpl._readModelOptions(this._configurationService.getValue({ overrideIdentifier: language, resource: resource }), isForSimpleWidget);
            this._modelCreationOptionsByLanguageAndResource[language + resource] = creationOptions;
        }
        return creationOptions;
    };
    ModelServiceImpl.prototype._updateModelOptions = function () {
        var oldOptionsByLanguageAndResource = this._modelCreationOptionsByLanguageAndResource;
        this._modelCreationOptionsByLanguageAndResource = Object.create(null);
        // Update options on all models
        var keys = Object.keys(this._models);
        for (var i = 0, len = keys.length; i < len; i++) {
            var modelId = keys[i];
            var modelData = this._models[modelId];
            var language = modelData.model.getLanguageIdentifier().language;
            var uri = modelData.model.uri;
            var oldOptions = oldOptionsByLanguageAndResource[language + uri];
            var newOptions = this.getCreationOptions(language, uri, modelData.model.isForSimpleWidget);
            ModelServiceImpl._setModelOptionsForModel(modelData.model, newOptions, oldOptions);
        }
    };
    ModelServiceImpl._setModelOptionsForModel = function (model, newOptions, currentOptions) {
        if (currentOptions
            && (currentOptions.detectIndentation === newOptions.detectIndentation)
            && (currentOptions.insertSpaces === newOptions.insertSpaces)
            && (currentOptions.tabSize === newOptions.tabSize)
            && (currentOptions.trimAutoWhitespace === newOptions.trimAutoWhitespace)) {
            // Same indent opts, no need to touch the model
            return;
        }
        if (newOptions.detectIndentation) {
            model.detectIndentation(newOptions.insertSpaces, newOptions.tabSize);
            model.updateOptions({
                trimAutoWhitespace: newOptions.trimAutoWhitespace
            });
        }
        else {
            model.updateOptions({
                insertSpaces: newOptions.insertSpaces,
                tabSize: newOptions.tabSize,
                trimAutoWhitespace: newOptions.trimAutoWhitespace
            });
        }
    };
    ModelServiceImpl.prototype.dispose = function () {
        if (this._markerServiceSubscription) {
            this._markerServiceSubscription.dispose();
        }
        this._configurationServiceSubscription.dispose();
    };
    ModelServiceImpl.prototype._handleMarkerChange = function (changedResources) {
        var _this = this;
        changedResources.forEach(function (resource) {
            var modelId = MODEL_ID(resource);
            var modelData = _this._models[modelId];
            if (!modelData) {
                return;
            }
            ModelMarkerHandler.setMarkers(modelData, _this._markerService);
        });
    };
    ModelServiceImpl.prototype._cleanUp = function (model) {
        var _this = this;
        // clean up markers for internal, transient models
        if (model.uri.scheme === network.Schemas.inMemory
            || model.uri.scheme === network.Schemas.internal
            || model.uri.scheme === network.Schemas.vscode) {
            if (this._markerService) {
                this._markerService.read({ resource: model.uri }).map(function (marker) { return marker.owner; }).forEach(function (owner) { return _this._markerService.remove(owner, [model.uri]); });
            }
        }
        // clean up cache
        delete this._modelCreationOptionsByLanguageAndResource[model.getLanguageIdentifier().language + model.uri];
    };
    // --- begin IModelService
    ModelServiceImpl.prototype._createModelData = function (value, languageIdentifier, resource, isForSimpleWidget) {
        var _this = this;
        // create & save the model
        var options = this.getCreationOptions(languageIdentifier.language, resource, isForSimpleWidget);
        var model = new TextModel(value, options, languageIdentifier, resource);
        var modelId = MODEL_ID(model.uri);
        if (this._models[modelId]) {
            // There already exists a model with this id => this is a programmer error
            throw new Error('ModelService: Cannot add model because it already exists!');
        }
        var modelData = new ModelData(model, function (model) { return _this._onWillDispose(model); }, function (model, e) { return _this._onDidChangeLanguage(model, e); });
        this._models[modelId] = modelData;
        return modelData;
    };
    ModelServiceImpl.prototype.updateModel = function (model, value) {
        var options = this.getCreationOptions(model.getLanguageIdentifier().language, model.uri, model.isForSimpleWidget);
        var textBuffer = createTextBuffer(value, options.defaultEOL);
        // Return early if the text is already set in that form
        if (model.equalsTextBuffer(textBuffer)) {
            return;
        }
        // Otherwise find a diff between the values and update model
        model.pushStackElement();
        model.pushEOL(textBuffer.getEOL() === '\r\n' ? EndOfLineSequence.CRLF : EndOfLineSequence.LF);
        model.pushEditOperations([], ModelServiceImpl._computeEdits(model, textBuffer), function (inverseEditOperations) { return []; });
        model.pushStackElement();
    };
    ModelServiceImpl._commonPrefix = function (a, aLen, aDelta, b, bLen, bDelta) {
        var maxResult = Math.min(aLen, bLen);
        var result = 0;
        for (var i = 0; i < maxResult && a.getLineContent(aDelta + i) === b.getLineContent(bDelta + i); i++) {
            result++;
        }
        return result;
    };
    ModelServiceImpl._commonSuffix = function (a, aLen, aDelta, b, bLen, bDelta) {
        var maxResult = Math.min(aLen, bLen);
        var result = 0;
        for (var i = 0; i < maxResult && a.getLineContent(aDelta + aLen - i) === b.getLineContent(bDelta + bLen - i); i++) {
            result++;
        }
        return result;
    };
    /**
     * Compute edits to bring `model` to the state of `textSource`.
     */
    ModelServiceImpl._computeEdits = function (model, textBuffer) {
        var modelLineCount = model.getLineCount();
        var textBufferLineCount = textBuffer.getLineCount();
        var commonPrefix = this._commonPrefix(model, modelLineCount, 1, textBuffer, textBufferLineCount, 1);
        if (modelLineCount === textBufferLineCount && commonPrefix === modelLineCount) {
            // equality case
            return [];
        }
        var commonSuffix = this._commonSuffix(model, modelLineCount - commonPrefix, commonPrefix, textBuffer, textBufferLineCount - commonPrefix, commonPrefix);
        var oldRange, newRange;
        if (commonSuffix > 0) {
            oldRange = new Range(commonPrefix + 1, 1, modelLineCount - commonSuffix + 1, 1);
            newRange = new Range(commonPrefix + 1, 1, textBufferLineCount - commonSuffix + 1, 1);
        }
        else if (commonPrefix > 0) {
            oldRange = new Range(commonPrefix, model.getLineMaxColumn(commonPrefix), modelLineCount, model.getLineMaxColumn(modelLineCount));
            newRange = new Range(commonPrefix, 1 + textBuffer.getLineLength(commonPrefix), textBufferLineCount, 1 + textBuffer.getLineLength(textBufferLineCount));
        }
        else {
            oldRange = new Range(1, 1, modelLineCount, model.getLineMaxColumn(modelLineCount));
            newRange = new Range(1, 1, textBufferLineCount, 1 + textBuffer.getLineLength(textBufferLineCount));
        }
        return [EditOperation.replaceMove(oldRange, textBuffer.getValueInRange(newRange, EndOfLinePreference.TextDefined))];
    };
    ModelServiceImpl.prototype.createModel = function (value, modeOrPromise, resource, isForSimpleWidget) {
        if (isForSimpleWidget === void 0) { isForSimpleWidget = false; }
        var modelData;
        if (!modeOrPromise || isThenable(modeOrPromise)) {
            modelData = this._createModelData(value, PLAINTEXT_LANGUAGE_IDENTIFIER, resource, isForSimpleWidget);
            this.setMode(modelData.model, modeOrPromise);
        }
        else {
            modelData = this._createModelData(value, modeOrPromise.getLanguageIdentifier(), resource, isForSimpleWidget);
        }
        // handle markers (marker service => model)
        if (this._markerService) {
            ModelMarkerHandler.setMarkers(modelData, this._markerService);
        }
        this._onModelAdded.fire(modelData.model);
        return modelData.model;
    };
    ModelServiceImpl.prototype.setMode = function (model, modeOrPromise) {
        if (!modeOrPromise) {
            return;
        }
        if (isThenable(modeOrPromise)) {
            modeOrPromise.then(function (mode) {
                if (!model.isDisposed()) {
                    model.setMode(mode.getLanguageIdentifier());
                }
            });
        }
        else {
            model.setMode(modeOrPromise.getLanguageIdentifier());
        }
    };
    ModelServiceImpl.prototype.destroyModel = function (resource) {
        // We need to support that not all models get disposed through this service (i.e. model.dispose() should work!)
        var modelData = this._models[MODEL_ID(resource)];
        if (!modelData) {
            return;
        }
        modelData.model.dispose();
    };
    ModelServiceImpl.prototype.getModels = function () {
        var ret = [];
        var keys = Object.keys(this._models);
        for (var i = 0, len = keys.length; i < len; i++) {
            var modelId = keys[i];
            ret.push(this._models[modelId].model);
        }
        return ret;
    };
    ModelServiceImpl.prototype.getModel = function (resource) {
        var modelId = MODEL_ID(resource);
        var modelData = this._models[modelId];
        if (!modelData) {
            return null;
        }
        return modelData.model;
    };
    Object.defineProperty(ModelServiceImpl.prototype, "onModelAdded", {
        get: function () {
            return this._onModelAdded ? this._onModelAdded.event : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelServiceImpl.prototype, "onModelRemoved", {
        get: function () {
            return this._onModelRemoved ? this._onModelRemoved.event : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelServiceImpl.prototype, "onModelModeChanged", {
        get: function () {
            return this._onModelModeChanged ? this._onModelModeChanged.event : null;
        },
        enumerable: true,
        configurable: true
    });
    // --- end IModelService
    ModelServiceImpl.prototype._onWillDispose = function (model) {
        var modelId = MODEL_ID(model.uri);
        var modelData = this._models[modelId];
        delete this._models[modelId];
        modelData.dispose();
        this._cleanUp(model);
        this._onModelRemoved.fire(model);
    };
    ModelServiceImpl.prototype._onDidChangeLanguage = function (model, e) {
        var oldModeId = e.oldLanguage;
        var newModeId = model.getLanguageIdentifier().language;
        var oldOptions = this.getCreationOptions(oldModeId, model.uri, model.isForSimpleWidget);
        var newOptions = this.getCreationOptions(newModeId, model.uri, model.isForSimpleWidget);
        ModelServiceImpl._setModelOptionsForModel(model, newOptions, oldOptions);
        this._onModelModeChanged.fire({ model: model, oldModeId: oldModeId });
    };
    ModelServiceImpl = __decorate([
        __param(0, IMarkerService),
        __param(1, IConfigurationService)
    ], ModelServiceImpl);
    return ModelServiceImpl;
}());
export { ModelServiceImpl };

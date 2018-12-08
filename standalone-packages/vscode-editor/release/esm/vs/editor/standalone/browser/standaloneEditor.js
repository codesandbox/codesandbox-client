/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './standalone-tokens.css';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { OpenerService } from '../../browser/services/openerService.js';
import { DiffNavigator } from '../../browser/widget/diffNavigator.js';
import * as editorOptions from '../../common/config/editorOptions.js';
import { BareFontInfo, FontInfo } from '../../common/config/fontInfo.js';
import * as editorCommon from '../../common/editorCommon.js';
import { FindMatch, TextModelResolvedOptions } from '../../common/model.js';
import * as modes from '../../common/modes.js';
import { NULL_STATE, nullTokenize } from '../../common/modes/nullMode.js';
import { IEditorWorkerService } from '../../common/services/editorWorkerService.js';
import { ITextModelService } from '../../common/services/resolverService.js';
import { createWebWorker as actualCreateWebWorker } from '../../common/services/webWorker.js';
import * as standaloneEnums from '../../common/standalone/standaloneEnums.js';
import { Colorizer } from './colorizer.js';
import { SimpleEditorModelResolverService } from './simpleServices.js';
import { StandaloneDiffEditor, StandaloneEditor } from './standaloneCodeEditor.js';
import { DynamicStandaloneServices, StaticServices } from './standaloneServices.js';
import { IStandaloneThemeService } from '../common/standaloneThemeService.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
function withAllStandaloneServices(domElement, override, callback) {
    var services = new DynamicStandaloneServices(domElement, override);
    var simpleEditorModelResolverService = null;
    if (!services.has(ITextModelService)) {
        simpleEditorModelResolverService = new SimpleEditorModelResolverService();
        services.set(ITextModelService, simpleEditorModelResolverService);
    }
    if (!services.has(IOpenerService)) {
        services.set(IOpenerService, new OpenerService(services.get(ICodeEditorService), services.get(ICommandService)));
    }
    var result = callback(services);
    if (simpleEditorModelResolverService) {
        simpleEditorModelResolverService.setEditor(result);
    }
    return result;
}
/**
 * Create a new editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export function create(domElement, options, override) {
    return withAllStandaloneServices(domElement, override || {}, function (services) {
        return new StandaloneEditor(domElement, options, services, services.get(IInstantiationService), services.get(ICodeEditorService), services.get(ICommandService), services.get(IContextKeyService), services.get(IKeybindingService), services.get(IContextViewService), services.get(IStandaloneThemeService), services.get(INotificationService), services.get(IConfigurationService));
    });
}
/**
 * Emitted when an editor is created.
 * Creating a diff editor might cause this listener to be invoked with the two editors.
 * @event
 */
export function onDidCreateEditor(listener) {
    return StaticServices.codeEditorService.get().onCodeEditorAdd(function (editor) {
        listener(editor);
    });
}
/**
 * Create a new diff editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export function createDiffEditor(domElement, options, override) {
    return withAllStandaloneServices(domElement, override, function (services) {
        return new StandaloneDiffEditor(domElement, options, services, services.get(IInstantiationService), services.get(IContextKeyService), services.get(IKeybindingService), services.get(IContextViewService), services.get(IEditorWorkerService), services.get(ICodeEditorService), services.get(IStandaloneThemeService), services.get(INotificationService), services.get(IConfigurationService));
    });
}
export function createDiffNavigator(diffEditor, opts) {
    return new DiffNavigator(diffEditor, opts);
}
function doCreateModel(value, languageSelection, uri) {
    return StaticServices.modelService.get().createModel(value, languageSelection, uri);
}
/**
 * Create a new editor model.
 * You can specify the language that should be set for this model or let the language be inferred from the `uri`.
 */
export function createModel(value, language, uri) {
    value = value || '';
    if (!language) {
        var path = uri ? uri.path : null;
        var firstLF = value.indexOf('\n');
        var firstLine = value;
        if (firstLF !== -1) {
            firstLine = value.substring(0, firstLF);
        }
        return doCreateModel(value, StaticServices.modeService.get().createByFilepathOrFirstLine(path, firstLine), uri);
    }
    return doCreateModel(value, StaticServices.modeService.get().create(language), uri);
}
/**
 * Change the language for a model.
 */
export function setModelLanguage(model, languageId) {
    StaticServices.modelService.get().setMode(model, StaticServices.modeService.get().create(languageId));
}
/**
 * Set the markers for a model.
 */
export function setModelMarkers(model, owner, markers) {
    if (model) {
        StaticServices.markerService.get().changeOne(owner, model.uri, markers);
    }
}
/**
 * Get markers for owner and/or resource
 * @returns {IMarker[]} list of markers
 * @param filter
 */
export function getModelMarkers(filter) {
    return StaticServices.markerService.get().read(filter);
}
/**
 * Get the model that has `uri` if it exists.
 */
export function getModel(uri) {
    return StaticServices.modelService.get().getModel(uri);
}
/**
 * Get all the created models.
 */
export function getModels() {
    return StaticServices.modelService.get().getModels();
}
/**
 * Emitted when a model is created.
 * @event
 */
export function onDidCreateModel(listener) {
    return StaticServices.modelService.get().onModelAdded(listener);
}
/**
 * Emitted right before a model is disposed.
 * @event
 */
export function onWillDisposeModel(listener) {
    return StaticServices.modelService.get().onModelRemoved(listener);
}
/**
 * Emitted when a different language is set to a model.
 * @event
 */
export function onDidChangeModelLanguage(listener) {
    return StaticServices.modelService.get().onModelModeChanged(function (e) {
        listener({
            model: e.model,
            oldLanguage: e.oldModeId
        });
    });
}
/**
 * Create a new web worker that has model syncing capabilities built in.
 * Specify an AMD module to load that will `create` an object that will be proxied.
 */
export function createWebWorker(opts) {
    return actualCreateWebWorker(StaticServices.modelService.get(), opts);
}
/**
 * Colorize the contents of `domNode` using attribute `data-lang`.
 */
export function colorizeElement(domNode, options) {
    return Colorizer.colorizeElement(StaticServices.standaloneThemeService.get(), StaticServices.modeService.get(), domNode, options);
}
/**
 * Colorize `text` using language `languageId`.
 */
export function colorize(text, languageId, options) {
    return Colorizer.colorize(StaticServices.modeService.get(), text, languageId, options);
}
/**
 * Colorize a line in a model.
 */
export function colorizeModelLine(model, lineNumber, tabSize) {
    if (tabSize === void 0) { tabSize = 4; }
    return Colorizer.colorizeModelLine(model, lineNumber, tabSize);
}
/**
 * @internal
 */
function getSafeTokenizationSupport(language) {
    var tokenizationSupport = modes.TokenizationRegistry.get(language);
    if (tokenizationSupport) {
        return tokenizationSupport;
    }
    return {
        getInitialState: function () { return NULL_STATE; },
        tokenize: function (line, state, deltaOffset) { return nullTokenize(language, line, state, deltaOffset); },
        tokenize2: undefined,
    };
}
/**
 * Tokenize `text` using language `languageId`
 */
export function tokenize(text, languageId) {
    var modeService = StaticServices.modeService.get();
    // Needed in order to get the mode registered for subsequent look-ups
    modeService.triggerMode(languageId);
    var tokenizationSupport = getSafeTokenizationSupport(languageId);
    var lines = text.split(/\r\n|\r|\n/);
    var result = [];
    var state = tokenizationSupport.getInitialState();
    for (var i = 0, len = lines.length; i < len; i++) {
        var line = lines[i];
        var tokenizationResult = tokenizationSupport.tokenize(line, state, 0);
        result[i] = tokenizationResult.tokens;
        state = tokenizationResult.endState;
    }
    return result;
}
/**
 * Define a new theme or update an existing theme.
 */
export function defineTheme(themeName, themeData) {
    StaticServices.standaloneThemeService.get().defineTheme(themeName, themeData);
}
/**
 * Switches to a theme.
 */
export function setTheme(themeName) {
    StaticServices.standaloneThemeService.get().setTheme(themeName);
}
/**
 * @internal
 */
export function createMonacoEditorAPI() {
    return {
        // methods
        create: create,
        onDidCreateEditor: onDidCreateEditor,
        createDiffEditor: createDiffEditor,
        createDiffNavigator: createDiffNavigator,
        createModel: createModel,
        setModelLanguage: setModelLanguage,
        setModelMarkers: setModelMarkers,
        getModelMarkers: getModelMarkers,
        getModels: getModels,
        getModel: getModel,
        onDidCreateModel: onDidCreateModel,
        onWillDisposeModel: onWillDisposeModel,
        onDidChangeModelLanguage: onDidChangeModelLanguage,
        createWebWorker: createWebWorker,
        colorizeElement: colorizeElement,
        colorize: colorize,
        colorizeModelLine: colorizeModelLine,
        tokenize: tokenize,
        defineTheme: defineTheme,
        setTheme: setTheme,
        // enums
        ScrollbarVisibility: standaloneEnums.ScrollbarVisibility,
        WrappingIndent: standaloneEnums.WrappingIndent,
        OverviewRulerLane: standaloneEnums.OverviewRulerLane,
        EndOfLinePreference: standaloneEnums.EndOfLinePreference,
        DefaultEndOfLine: standaloneEnums.DefaultEndOfLine,
        EndOfLineSequence: standaloneEnums.EndOfLineSequence,
        TrackedRangeStickiness: standaloneEnums.TrackedRangeStickiness,
        CursorChangeReason: standaloneEnums.CursorChangeReason,
        MouseTargetType: standaloneEnums.MouseTargetType,
        TextEditorCursorStyle: standaloneEnums.TextEditorCursorStyle,
        TextEditorCursorBlinkingStyle: standaloneEnums.TextEditorCursorBlinkingStyle,
        ContentWidgetPositionPreference: standaloneEnums.ContentWidgetPositionPreference,
        OverlayWidgetPositionPreference: standaloneEnums.OverlayWidgetPositionPreference,
        RenderMinimap: standaloneEnums.RenderMinimap,
        ScrollType: standaloneEnums.ScrollType,
        RenderLineNumbersType: standaloneEnums.RenderLineNumbersType,
        // classes
        InternalEditorOptions: editorOptions.InternalEditorOptions,
        BareFontInfo: BareFontInfo,
        FontInfo: FontInfo,
        TextModelResolvedOptions: TextModelResolvedOptions,
        FindMatch: FindMatch,
        // vars
        EditorType: editorCommon.EditorType
    };
}

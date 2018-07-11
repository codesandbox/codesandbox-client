/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from '../../../base/common/winjs.base.js';
import { guessMimeTypes } from '../../../base/common/mime.js';
import * as paths from '../../../base/common/paths.js';
import { ConfigurationTarget } from '../../configuration/common/configuration.js';
import { KeybindingSource } from '../../keybinding/common/keybinding.js';
export var NullTelemetryService = new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.publicLog = function (eventName, data) {
        return TPromise.wrap(null);
    };
    class_1.prototype.getTelemetryInfo = function () {
        return TPromise.wrap({
            instanceId: 'someValue.instanceId',
            sessionId: 'someValue.sessionId',
            machineId: 'someValue.machineId'
        });
    };
    return class_1;
}());
export function combinedAppender() {
    var appenders = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        appenders[_i] = arguments[_i];
    }
    return {
        log: function (e, d) { return appenders.forEach(function (a) { return a.log(e, d); }); },
        dispose: function () { return TPromise.join(appenders.map(function (a) { return a.dispose(); })); }
    };
}
export var NullAppender = { log: function () { return null; }, dispose: function () { return TPromise.as(null); } };
export function telemetryURIDescriptor(uri, hashPath) {
    var fsPath = uri && uri.fsPath;
    return fsPath ? { mimeType: guessMimeTypes(fsPath).join(', '), ext: paths.extname(fsPath), path: hashPath(fsPath) } : {};
}
/**
 * Only add settings that cannot contain any personal/private information of users (PII).
 */
var configurationValueWhitelist = [
    'editor.tabCompletion',
    'editor.fontFamily',
    'editor.fontWeight',
    'editor.fontSize',
    'editor.lineHeight',
    'editor.letterSpacing',
    'editor.lineNumbers',
    'editor.rulers',
    'editor.wordSeparators',
    'editor.tabSize',
    'editor.insertSpaces',
    'editor.detectIndentation',
    'editor.roundedSelection',
    'editor.scrollBeyondLastLine',
    'editor.minimap.enabled',
    'editor.minimap.side',
    'editor.minimap.renderCharacters',
    'editor.minimap.maxColumn',
    'editor.find.seedSearchStringFromSelection',
    'editor.find.autoFindInSelection',
    'editor.wordWrap',
    'editor.wordWrapColumn',
    'editor.wrappingIndent',
    'editor.mouseWheelScrollSensitivity',
    'editor.multiCursorModifier',
    'editor.quickSuggestions',
    'editor.quickSuggestionsDelay',
    'editor.parameterHints',
    'editor.autoClosingBrackets',
    'editor.autoIndent',
    'editor.formatOnType',
    'editor.formatOnPaste',
    'editor.suggestOnTriggerCharacters',
    'editor.acceptSuggestionOnEnter',
    'editor.acceptSuggestionOnCommitCharacter',
    'editor.snippetSuggestions',
    'editor.emptySelectionClipboard',
    'editor.wordBasedSuggestions',
    'editor.suggestSelection',
    'editor.suggestFontSize',
    'editor.suggestLineHeight',
    'editor.selectionHighlight',
    'editor.occurrencesHighlight',
    'editor.overviewRulerLanes',
    'editor.overviewRulerBorder',
    'editor.cursorBlinking',
    'editor.cursorStyle',
    'editor.mouseWheelZoom',
    'editor.fontLigatures',
    'editor.hideCursorInOverviewRuler',
    'editor.renderWhitespace',
    'editor.renderControlCharacters',
    'editor.renderIndentGuides',
    'editor.renderLineHighlight',
    'editor.codeLens',
    'editor.folding',
    'editor.showFoldingControls',
    'editor.matchBrackets',
    'editor.glyphMargin',
    'editor.useTabStops',
    'editor.trimAutoWhitespace',
    'editor.stablePeek',
    'editor.dragAndDrop',
    'editor.formatOnSave',
    'editor.colorDecorators',
    'window.zoomLevel',
    'files.autoSave',
    'files.hotExit',
    'files.associations',
    'workbench.statusBar.visible',
    'files.trimTrailingWhitespace',
    'git.confirmSync',
    'workbench.sideBar.location',
    'window.openFilesInNewWindow',
    'javascript.validate.enable',
    'window.restoreWindows',
    'extensions.autoUpdate',
    'files.eol',
    'explorer.openEditors.visible',
    'workbench.editor.enablePreview',
    'files.autoSaveDelay',
    'workbench.editor.showTabs',
    'files.encoding',
    'files.autoGuessEncoding',
    'git.enabled',
    'http.proxyStrictSSL',
    'terminal.integrated.fontFamily',
    'workbench.editor.enablePreviewFromQuickOpen',
    'workbench.editor.swipeToNavigate',
    'php.builtInCompletions.enable',
    'php.validate.enable',
    'php.validate.run',
    'workbench.welcome.enabled',
    'workbench.startupEditor',
];
export function configurationTelemetry(telemetryService, configurationService) {
    return configurationService.onDidChangeConfiguration(function (event) {
        if (event.source !== ConfigurationTarget.DEFAULT) {
            /* __GDPR__
                "updateConfiguration" : {
                    "configurationSource" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                    "configurationKeys": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                }
            */
            telemetryService.publicLog('updateConfiguration', {
                configurationSource: ConfigurationTarget[event.source],
                configurationKeys: flattenKeys(event.sourceConfig)
            });
            /* __GDPR__
                "updateConfigurationValues" : {
                    "configurationSource" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                    "configurationValues": { "classification": "CustomerContent", "purpose": "FeatureInsight" }
                }
            */
            telemetryService.publicLog('updateConfigurationValues', {
                configurationSource: ConfigurationTarget[event.source],
                configurationValues: flattenValues(event.sourceConfig, configurationValueWhitelist)
            });
        }
    });
}
export function keybindingsTelemetry(telemetryService, keybindingService) {
    return keybindingService.onDidUpdateKeybindings(function (event) {
        if (event.source === KeybindingSource.User && event.keybindings) {
            /* __GDPR__
                "updateKeybindings" : {
                    "bindings": { "classification": "CustomerContent", "purpose": "FeatureInsight" }
                }
            */
            telemetryService.publicLog('updateKeybindings', {
                bindings: event.keybindings.map(function (binding) { return ({
                    key: binding.key,
                    command: binding.command,
                    when: binding.when,
                    args: binding.args ? true : undefined
                }); })
            });
        }
    });
}
function flattenKeys(value) {
    if (!value) {
        return [];
    }
    var result = [];
    flatKeys(result, '', value);
    return result;
}
function flatKeys(result, prefix, value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.keys(value)
            .forEach(function (key) { return flatKeys(result, prefix ? prefix + "." + key : key, value[key]); });
    }
    else {
        result.push(prefix);
    }
}
function flattenValues(value, keys) {
    if (!value) {
        return [];
    }
    return keys.reduce(function (array, key) {
        var _a;
        var v = key.split('.')
            .reduce(function (tmp, k) { return tmp && typeof tmp === 'object' ? tmp[k] : undefined; }, value);
        if (typeof v !== 'undefined') {
            array.push((_a = {}, _a[key] = v, _a));
        }
        return array;
    }, []);
}

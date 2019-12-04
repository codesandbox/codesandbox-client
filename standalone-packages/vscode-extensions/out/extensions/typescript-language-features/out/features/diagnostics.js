"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const resourceMap_1 = require("../utils/resourceMap");
const arrays = require("../utils/arrays");
const dispose_1 = require("../utils/dispose");
function diagnosticsEquals(a, b) {
    if (a === b) {
        return true;
    }
    return a.code === b.code
        && a.message === b.message
        && a.severity === b.severity
        && a.source === b.source
        && a.range.isEqual(b.range)
        && arrays.equals(a.relatedInformation || arrays.empty, b.relatedInformation || arrays.empty, (a, b) => {
            return a.message === b.message
                && a.location.range.isEqual(b.location.range)
                && a.location.uri.fsPath === b.location.uri.fsPath;
        })
        && arrays.equals(a.tags || arrays.empty, b.tags || arrays.empty);
}
class FileDiagnostics {
    constructor(file, language) {
        this.file = file;
        this.language = language;
        this._diagnostics = new Map();
    }
    updateDiagnostics(language, kind, diagnostics) {
        if (language !== this.language) {
            this._diagnostics.clear();
            this.language = language;
        }
        const existing = this._diagnostics.get(kind);
        if (arrays.equals(existing || arrays.empty, diagnostics, diagnosticsEquals)) {
            // No need to update
            return false;
        }
        this._diagnostics.set(kind, diagnostics);
        return true;
    }
    getDiagnostics(settings) {
        if (!settings.getValidate(this.language)) {
            return [];
        }
        return [
            ...this.get(0 /* Syntax */),
            ...this.get(1 /* Semantic */),
            ...this.getSuggestionDiagnostics(settings),
        ];
    }
    getSuggestionDiagnostics(settings) {
        const enableSuggestions = settings.getEnableSuggestions(this.language);
        return this.get(2 /* Suggestion */).filter(x => {
            if (!enableSuggestions) {
                // Still show unused
                return x.tags && x.tags.includes(vscode.DiagnosticTag.Unnecessary);
            }
            return true;
        });
    }
    get(kind) {
        return this._diagnostics.get(kind) || [];
    }
}
function areLanguageDiagnosticSettingsEqual(currentSettings, newSettings) {
    return currentSettings.validate === newSettings.validate
        && currentSettings.enableSuggestions && currentSettings.enableSuggestions;
}
class DiagnosticSettings {
    constructor() {
        this._languageSettings = new Map();
    }
    getValidate(language) {
        return this.get(language).validate;
    }
    setValidate(language, value) {
        return this.update(language, settings => ({
            validate: value,
            enableSuggestions: settings.enableSuggestions,
        }));
    }
    getEnableSuggestions(language) {
        return this.get(language).enableSuggestions;
    }
    setEnableSuggestions(language, value) {
        return this.update(language, settings => ({
            validate: settings.validate,
            enableSuggestions: value
        }));
    }
    get(language) {
        return this._languageSettings.get(language) || DiagnosticSettings.defaultSettings;
    }
    update(language, f) {
        const currentSettings = this.get(language);
        const newSettings = f(currentSettings);
        this._languageSettings.set(language, newSettings);
        return areLanguageDiagnosticSettingsEqual(currentSettings, newSettings);
    }
}
DiagnosticSettings.defaultSettings = {
    validate: true,
    enableSuggestions: true
};
class DiagnosticsManager extends dispose_1.Disposable {
    constructor(owner) {
        super();
        this._diagnostics = new resourceMap_1.ResourceMap();
        this._settings = new DiagnosticSettings();
        this._pendingUpdates = new resourceMap_1.ResourceMap();
        this._updateDelay = 50;
        this._currentDiagnostics = this._register(vscode.languages.createDiagnosticCollection(owner));
    }
    dispose() {
        super.dispose();
        for (const value of this._pendingUpdates.values) {
            clearTimeout(value);
        }
        this._pendingUpdates.clear();
    }
    reInitialize() {
        this._currentDiagnostics.clear();
        this._diagnostics.clear();
    }
    setValidate(language, value) {
        const didUpdate = this._settings.setValidate(language, value);
        if (didUpdate) {
            this.rebuild();
        }
    }
    setEnableSuggestions(language, value) {
        const didUpdate = this._settings.setEnableSuggestions(language, value);
        if (didUpdate) {
            this.rebuild();
        }
    }
    updateDiagnostics(file, language, kind, diagnostics) {
        let didUpdate = false;
        const entry = this._diagnostics.get(file);
        if (entry) {
            didUpdate = entry.updateDiagnostics(language, kind, diagnostics);
        }
        else if (diagnostics.length) {
            const fileDiagnostics = new FileDiagnostics(file, language);
            fileDiagnostics.updateDiagnostics(language, kind, diagnostics);
            this._diagnostics.set(file, fileDiagnostics);
            didUpdate = true;
        }
        if (didUpdate) {
            this.scheduleDiagnosticsUpdate(file);
        }
    }
    configFileDiagnosticsReceived(file, diagnostics) {
        this._currentDiagnostics.set(file, diagnostics);
    }
    delete(resource) {
        this._currentDiagnostics.delete(resource);
        this._diagnostics.delete(resource);
    }
    getDiagnostics(file) {
        return this._currentDiagnostics.get(file) || [];
    }
    scheduleDiagnosticsUpdate(file) {
        if (!this._pendingUpdates.has(file)) {
            this._pendingUpdates.set(file, setTimeout(() => this.updateCurrentDiagnostics(file), this._updateDelay));
        }
    }
    updateCurrentDiagnostics(file) {
        if (this._pendingUpdates.has(file)) {
            clearTimeout(this._pendingUpdates.get(file));
            this._pendingUpdates.delete(file);
        }
        const fileDiagnostics = this._diagnostics.get(file);
        this._currentDiagnostics.set(file, fileDiagnostics ? fileDiagnostics.getDiagnostics(this._settings) : []);
    }
    rebuild() {
        this._currentDiagnostics.clear();
        for (const fileDiagnostic of this._diagnostics.values) {
            this._currentDiagnostics.set(fileDiagnostic.file, fileDiagnostic.getDiagnostics(this._settings));
        }
    }
}
exports.DiagnosticsManager = DiagnosticsManager;
//# sourceMappingURL=diagnostics.js.map
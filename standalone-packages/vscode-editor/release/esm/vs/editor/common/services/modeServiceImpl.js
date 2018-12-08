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
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { FrankensteinMode } from '../modes/abstractMode.js';
import { NULL_LANGUAGE_IDENTIFIER } from '../modes/nullMode.js';
import { LanguagesRegistry } from './languagesRegistry.js';
var LanguageSelection = /** @class */ (function (_super) {
    __extends(LanguageSelection, _super);
    function LanguageSelection(onLanguagesMaybeChanged, selector) {
        var _this = _super.call(this) || this;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this._selector = selector;
        _this.languageIdentifier = _this._selector();
        _this._register(onLanguagesMaybeChanged(function () { return _this._evaluate(); }));
        return _this;
    }
    LanguageSelection.prototype._evaluate = function () {
        var languageIdentifier = this._selector();
        if (languageIdentifier.id === this.languageIdentifier.id) {
            // no change
            return;
        }
        this.languageIdentifier = languageIdentifier;
        this._onDidChange.fire(this.languageIdentifier);
    };
    return LanguageSelection;
}(Disposable));
var ModeServiceImpl = /** @class */ (function () {
    function ModeServiceImpl(warnOnOverwrite) {
        if (warnOnOverwrite === void 0) { warnOnOverwrite = false; }
        var _this = this;
        this._onDidCreateMode = new Emitter();
        this.onDidCreateMode = this._onDidCreateMode.event;
        this._onLanguagesMaybeChanged = new Emitter();
        this.onLanguagesMaybeChanged = this._onLanguagesMaybeChanged.event;
        this._instantiatedModes = {};
        this._registry = new LanguagesRegistry(true, warnOnOverwrite);
        this._registry.onDidChange(function () { return _this._onLanguagesMaybeChanged.fire(); });
    }
    ModeServiceImpl.prototype._onReady = function () {
        return Promise.resolve(true);
    };
    ModeServiceImpl.prototype.isRegisteredMode = function (mimetypeOrModeId) {
        return this._registry.isRegisteredMode(mimetypeOrModeId);
    };
    ModeServiceImpl.prototype.getRegisteredModes = function () {
        return this._registry.getRegisteredModes();
    };
    ModeServiceImpl.prototype.getRegisteredLanguageNames = function () {
        return this._registry.getRegisteredLanguageNames();
    };
    ModeServiceImpl.prototype.getExtensions = function (alias) {
        return this._registry.getExtensions(alias);
    };
    ModeServiceImpl.prototype.getFilenames = function (alias) {
        return this._registry.getFilenames(alias);
    };
    ModeServiceImpl.prototype.getMimeForMode = function (modeId) {
        return this._registry.getMimeForMode(modeId);
    };
    ModeServiceImpl.prototype.getLanguageName = function (modeId) {
        return this._registry.getLanguageName(modeId);
    };
    ModeServiceImpl.prototype.getModeIdForLanguageName = function (alias) {
        return this._registry.getModeIdForLanguageNameLowercase(alias);
    };
    ModeServiceImpl.prototype.getModeIdByFilepathOrFirstLine = function (filepath, firstLine) {
        var modeIds = this._registry.getModeIdsFromFilepathOrFirstLine(filepath, firstLine);
        if (modeIds.length > 0) {
            return modeIds[0];
        }
        return null;
    };
    ModeServiceImpl.prototype.getModeId = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
        var modeIds = this._registry.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
        if (modeIds.length > 0) {
            return modeIds[0];
        }
        return null;
    };
    ModeServiceImpl.prototype.getLanguageIdentifier = function (modeId) {
        return this._registry.getLanguageIdentifier(modeId);
    };
    ModeServiceImpl.prototype.getConfigurationFiles = function (modeId) {
        return this._registry.getConfigurationFiles(modeId);
    };
    // --- instantiation
    ModeServiceImpl.prototype.create = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
        var _this = this;
        return new LanguageSelection(this.onLanguagesMaybeChanged, function () {
            var modeId = _this.getModeId(commaSeparatedMimetypesOrCommaSeparatedIds);
            return _this._createModeAndGetLanguageIdentifier(modeId);
        });
    };
    ModeServiceImpl.prototype.createByLanguageName = function (languageName) {
        var _this = this;
        return new LanguageSelection(this.onLanguagesMaybeChanged, function () {
            var modeId = _this._getModeIdByLanguageName(languageName);
            return _this._createModeAndGetLanguageIdentifier(modeId);
        });
    };
    ModeServiceImpl.prototype.createByFilepathOrFirstLine = function (filepath, firstLine) {
        var _this = this;
        return new LanguageSelection(this.onLanguagesMaybeChanged, function () {
            var modeId = _this.getModeIdByFilepathOrFirstLine(filepath, firstLine);
            return _this._createModeAndGetLanguageIdentifier(modeId);
        });
    };
    ModeServiceImpl.prototype._createModeAndGetLanguageIdentifier = function (modeId) {
        // Fall back to plain text if no mode was found
        var languageIdentifier = this.getLanguageIdentifier(modeId || 'plaintext') || NULL_LANGUAGE_IDENTIFIER;
        this._getOrCreateMode(languageIdentifier.language);
        return languageIdentifier;
    };
    ModeServiceImpl.prototype.triggerMode = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
        var modeId = this.getModeId(commaSeparatedMimetypesOrCommaSeparatedIds);
        // Fall back to plain text if no mode was found
        this._getOrCreateMode(modeId || 'plaintext');
    };
    ModeServiceImpl.prototype.waitForLanguageRegistration = function () {
        return this._onReady().then(function () { });
    };
    ModeServiceImpl.prototype._getModeIdByLanguageName = function (languageName) {
        var modeIds = this._registry.getModeIdsFromLanguageName(languageName);
        if (modeIds.length > 0) {
            return modeIds[0];
        }
        return null;
    };
    ModeServiceImpl.prototype._getOrCreateMode = function (modeId) {
        if (!this._instantiatedModes.hasOwnProperty(modeId)) {
            var languageIdentifier = this.getLanguageIdentifier(modeId) || NULL_LANGUAGE_IDENTIFIER;
            this._instantiatedModes[modeId] = new FrankensteinMode(languageIdentifier);
            this._onDidCreateMode.fire(this._instantiatedModes[modeId]);
        }
        return this._instantiatedModes[modeId];
    };
    return ModeServiceImpl;
}());
export { ModeServiceImpl };

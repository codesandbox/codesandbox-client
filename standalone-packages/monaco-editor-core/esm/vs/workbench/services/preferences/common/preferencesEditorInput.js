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
import { OS } from '../../../../base/common/platform';
import { URI } from '../../../../base/common/uri';
import { TPromise } from '../../../../base/common/winjs.base';
import { ITextModelService } from '../../../../editor/common/services/resolverService';
import * as nls from '../../../../nls';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { EditorInput, SideBySideEditorInput } from '../../../common/editor';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { IHashService } from '../../hash/common/hashService';
import { KeybindingsEditorModel } from './keybindingsEditorModel';
import { IPreferencesService } from './preferences';
var PreferencesEditorInput = /** @class */ (function (_super) {
    __extends(PreferencesEditorInput, _super);
    function PreferencesEditorInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreferencesEditorInput.prototype.getTypeId = function () {
        return PreferencesEditorInput.ID;
    };
    PreferencesEditorInput.prototype.getTitle = function (verbosity) {
        return this.master.getTitle(verbosity);
    };
    PreferencesEditorInput.ID = 'workbench.editorinputs.preferencesEditorInput';
    return PreferencesEditorInput;
}(SideBySideEditorInput));
export { PreferencesEditorInput };
var DefaultPreferencesEditorInput = /** @class */ (function (_super) {
    __extends(DefaultPreferencesEditorInput, _super);
    function DefaultPreferencesEditorInput(defaultSettingsResource, textModelResolverService, hashService) {
        return _super.call(this, nls.localize('settingsEditorName', "Default Settings"), '', defaultSettingsResource, textModelResolverService, hashService) || this;
    }
    DefaultPreferencesEditorInput.prototype.getTypeId = function () {
        return DefaultPreferencesEditorInput.ID;
    };
    DefaultPreferencesEditorInput.prototype.matches = function (other) {
        if (other instanceof DefaultPreferencesEditorInput) {
            return true;
        }
        if (!_super.prototype.matches.call(this, other)) {
            return false;
        }
        return true;
    };
    DefaultPreferencesEditorInput.ID = 'workbench.editorinputs.defaultpreferences';
    DefaultPreferencesEditorInput = __decorate([
        __param(1, ITextModelService),
        __param(2, IHashService)
    ], DefaultPreferencesEditorInput);
    return DefaultPreferencesEditorInput;
}(ResourceEditorInput));
export { DefaultPreferencesEditorInput };
var KeybindingsEditorInput = /** @class */ (function (_super) {
    __extends(KeybindingsEditorInput, _super);
    function KeybindingsEditorInput(instantiationService) {
        var _this = _super.call(this) || this;
        _this.keybindingsModel = instantiationService.createInstance(KeybindingsEditorModel, OS);
        return _this;
    }
    KeybindingsEditorInput.prototype.getTypeId = function () {
        return KeybindingsEditorInput.ID;
    };
    KeybindingsEditorInput.prototype.getName = function () {
        return nls.localize('keybindingsInputName', "Keyboard Shortcuts");
    };
    KeybindingsEditorInput.prototype.resolve = function () {
        return TPromise.as(this.keybindingsModel);
    };
    KeybindingsEditorInput.prototype.matches = function (otherInput) {
        return otherInput instanceof KeybindingsEditorInput;
    };
    KeybindingsEditorInput.ID = 'workbench.input.keybindings';
    KeybindingsEditorInput = __decorate([
        __param(0, IInstantiationService)
    ], KeybindingsEditorInput);
    return KeybindingsEditorInput;
}(EditorInput));
export { KeybindingsEditorInput };
var SettingsEditor2Input = /** @class */ (function (_super) {
    __extends(SettingsEditor2Input, _super);
    function SettingsEditor2Input(_preferencesService) {
        var _this = _super.call(this) || this;
        _this._settingsModel = _preferencesService.createSettings2EditorModel();
        return _this;
    }
    SettingsEditor2Input.prototype.matches = function (otherInput) {
        return otherInput instanceof SettingsEditor2Input;
    };
    SettingsEditor2Input.prototype.getTypeId = function () {
        return SettingsEditor2Input.ID;
    };
    SettingsEditor2Input.prototype.getName = function () {
        return nls.localize('settingsEditor2InputName', "Settings");
    };
    SettingsEditor2Input.prototype.resolve = function () {
        return TPromise.as(this._settingsModel);
    };
    SettingsEditor2Input.prototype.getResource = function () {
        return URI.from({
            scheme: 'vscode-settings',
            path: "settingseditor"
        });
    };
    SettingsEditor2Input.ID = 'workbench.input.settings2';
    SettingsEditor2Input = __decorate([
        __param(0, IPreferencesService)
    ], SettingsEditor2Input);
    return SettingsEditor2Input;
}(EditorInput));
export { SettingsEditor2Input };

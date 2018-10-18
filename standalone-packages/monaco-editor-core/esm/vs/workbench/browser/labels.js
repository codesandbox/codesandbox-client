/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import * as resources from '../../base/common/resources';
import { IconLabel } from '../../base/browser/ui/iconLabel/iconLabel';
import { IExtensionService } from '../services/extensions/common/extensions';
import { IModeService } from '../../editor/common/services/modeService';
import { toResource } from '../common/editor';
import { PLAINTEXT_MODE_ID } from '../../editor/common/modes/modesRegistry';
import { IWorkspaceContextService } from '../../platform/workspace/common/workspace';
import { IConfigurationService } from '../../platform/configuration/common/configuration';
import { IModelService } from '../../editor/common/services/modelService';
import { IUntitledEditorService } from '../services/untitled/common/untitledEditorService';
import { IDecorationsService } from '../services/decorations/browser/decorations';
import { Schemas } from '../../base/common/network';
import { FileKind, FILES_ASSOCIATIONS_CONFIG } from '../../platform/files/common/files';
import { IThemeService } from '../../platform/theme/common/themeService';
import { Emitter } from '../../base/common/event';
import { DataUri } from '../common/resources';
import { ILabelService } from '../../platform/label/common/label';
var ResourceLabel = /** @class */ (function (_super) {
    __extends(ResourceLabel, _super);
    function ResourceLabel(container, options, extensionService, configurationService, modeService, modelService, decorationsService, themeService, labelService) {
        var _this = _super.call(this, container, options) || this;
        _this.extensionService = extensionService;
        _this.configurationService = configurationService;
        _this.modeService = modeService;
        _this.modelService = modelService;
        _this.decorationsService = decorationsService;
        _this.themeService = themeService;
        _this.labelService = labelService;
        _this._onDidRender = _this._register(new Emitter());
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(ResourceLabel.prototype, "onDidRender", {
        get: function () { return this._onDidRender.event; },
        enumerable: true,
        configurable: true
    });
    ResourceLabel.prototype.registerListeners = function () {
        var _this = this;
        // update when extensions are registered with potentially new languages
        this._register(this.extensionService.onDidRegisterExtensions(function () { return _this.render(true /* clear cache */); }));
        // react to model mode changes
        this._register(this.modelService.onModelModeChanged(function (e) { return _this.onModelModeChanged(e); }));
        // react to file decoration changes
        this._register(this.decorationsService.onDidChangeDecorations(this.onFileDecorationsChanges, this));
        // react to theme changes
        this._register(this.themeService.onThemeChange(function () { return _this.render(false); }));
        // react to files.associations changes
        this._register(this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(FILES_ASSOCIATIONS_CONFIG)) {
                _this.render(true /* clear cache */);
            }
        }));
    };
    ResourceLabel.prototype.onModelModeChanged = function (e) {
        if (!this.label || !this.label.resource) {
            return; // only update if label exists
        }
        if (!e.model.uri) {
            return; // we need the resource to compare
        }
        if (e.model.uri.scheme === Schemas.file && e.oldModeId === PLAINTEXT_MODE_ID) { // todo@remote does this apply?
            return; // ignore transitions in files from no mode to specific mode because this happens each time a model is created
        }
        if (e.model.uri.toString() === this.label.resource.toString()) {
            if (this.lastKnownConfiguredLangId !== e.model.getLanguageIdentifier().language) {
                this.render(true); // update if the language id of the model has changed from our last known state
            }
        }
    };
    ResourceLabel.prototype.onFileDecorationsChanges = function (e) {
        if (!this.options || !this.label || !this.label.resource) {
            return;
        }
        if (this.options.fileDecorations && e.affectsResource(this.label.resource)) {
            this.render(false);
        }
    };
    ResourceLabel.prototype.setLabel = function (label, options) {
        var hasResourceChanged = this.hasResourceChanged(label, options);
        this.label = label;
        this.options = options;
        if (hasResourceChanged) {
            this.computedPathLabel = void 0; // reset path label due to resource change
        }
        this.render(hasResourceChanged);
    };
    ResourceLabel.prototype.hasResourceChanged = function (label, options) {
        var newResource = label ? label.resource : void 0;
        var oldResource = this.label ? this.label.resource : void 0;
        var newFileKind = options ? options.fileKind : void 0;
        var oldFileKind = this.options ? this.options.fileKind : void 0;
        if (newFileKind !== oldFileKind) {
            return true; // same resource but different kind (file, folder)
        }
        if (newResource && this.computedPathLabel !== this.labelService.getUriLabel(newResource)) {
            return true;
        }
        if (newResource && oldResource) {
            return newResource.toString() !== oldResource.toString();
        }
        if (!newResource && !oldResource) {
            return false;
        }
        return true;
    };
    ResourceLabel.prototype.clear = function () {
        this.label = void 0;
        this.options = void 0;
        this.lastKnownConfiguredLangId = void 0;
        this.computedIconClasses = void 0;
        this.computedPathLabel = void 0;
        this.setValue();
    };
    ResourceLabel.prototype.render = function (clearIconCache) {
        var _a;
        if (this.label) {
            var configuredLangId = getConfiguredLangId(this.modelService, this.label.resource);
            if (this.lastKnownConfiguredLangId !== configuredLangId) {
                clearIconCache = true;
                this.lastKnownConfiguredLangId = configuredLangId;
            }
        }
        if (clearIconCache) {
            this.computedIconClasses = void 0;
        }
        if (!this.label) {
            return;
        }
        var iconLabelOptions = {
            title: '',
            italic: this.options && this.options.italic,
            matches: this.options && this.options.matches,
            extraClasses: []
        };
        var resource = this.label.resource;
        var label = this.label.name;
        if (this.options && typeof this.options.title === 'string') {
            iconLabelOptions.title = this.options.title;
        }
        else if (resource && resource.scheme !== Schemas.data /* do not accidentally inline Data URIs */) {
            if (!this.computedPathLabel) {
                this.computedPathLabel = this.labelService.getUriLabel(resource);
            }
            iconLabelOptions.title = this.computedPathLabel;
        }
        if (this.options && !this.options.hideIcon) {
            if (!this.computedIconClasses) {
                this.computedIconClasses = getIconClasses(this.modelService, this.modeService, resource, this.options && this.options.fileKind);
            }
            iconLabelOptions.extraClasses = this.computedIconClasses.slice(0);
        }
        if (this.options && this.options.extraClasses) {
            (_a = iconLabelOptions.extraClasses).push.apply(_a, this.options.extraClasses);
        }
        if (this.options && this.options.fileDecorations && resource) {
            var deco = this.decorationsService.getDecoration(resource, this.options.fileKind !== FileKind.FILE, this.options.fileDecorations.data);
            if (deco) {
                if (deco.tooltip) {
                    iconLabelOptions.title = iconLabelOptions.title + " \u2022 " + deco.tooltip;
                }
                if (this.options.fileDecorations.colors) {
                    iconLabelOptions.extraClasses.push(deco.labelClassName);
                }
                if (this.options.fileDecorations.badges) {
                    iconLabelOptions.extraClasses.push(deco.badgeClassName);
                }
            }
        }
        this.setValue(label, this.label.description, iconLabelOptions);
        this._onDidRender.fire();
    };
    ResourceLabel.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.label = void 0;
        this.options = void 0;
        this.lastKnownConfiguredLangId = void 0;
        this.computedIconClasses = void 0;
        this.computedPathLabel = void 0;
    };
    ResourceLabel = __decorate([
        __param(2, IExtensionService),
        __param(3, IConfigurationService),
        __param(4, IModeService),
        __param(5, IModelService),
        __param(6, IDecorationsService),
        __param(7, IThemeService),
        __param(8, ILabelService)
    ], ResourceLabel);
    return ResourceLabel;
}(IconLabel));
export { ResourceLabel };
var EditorLabel = /** @class */ (function (_super) {
    __extends(EditorLabel, _super);
    function EditorLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditorLabel.prototype.setEditor = function (editor, options) {
        this.setLabel({
            resource: toResource(editor, { supportSideBySide: true }),
            name: editor.getName(),
            description: editor.getDescription()
        }, options);
    };
    return EditorLabel;
}(ResourceLabel));
export { EditorLabel };
var FileLabel = /** @class */ (function (_super) {
    __extends(FileLabel, _super);
    function FileLabel(container, options, extensionService, contextService, configurationService, modeService, modelService, decorationsService, themeService, untitledEditorService, labelService) {
        var _this = _super.call(this, container, options, extensionService, configurationService, modeService, modelService, decorationsService, themeService, labelService) || this;
        _this.contextService = contextService;
        _this.untitledEditorService = untitledEditorService;
        return _this;
    }
    FileLabel.prototype.setFile = function (resource, options) {
        var hideLabel = options && options.hideLabel;
        var name;
        if (!hideLabel) {
            if (options && options.fileKind === FileKind.ROOT_FOLDER) {
                var workspaceFolder = this.contextService.getWorkspaceFolder(resource);
                if (workspaceFolder) {
                    name = workspaceFolder.name;
                }
            }
            if (!name) {
                name = resources.basenameOrAuthority(resource);
            }
        }
        var description;
        var hidePath = (options && options.hidePath) || (resource.scheme === Schemas.untitled && !this.untitledEditorService.hasAssociatedFilePath(resource));
        if (!hidePath) {
            description = this.labelService.getUriLabel(resources.dirname(resource), { relative: true });
        }
        this.setLabel({ resource: resource, name: name, description: description }, options);
    };
    FileLabel = __decorate([
        __param(2, IExtensionService),
        __param(3, IWorkspaceContextService),
        __param(4, IConfigurationService),
        __param(5, IModeService),
        __param(6, IModelService),
        __param(7, IDecorationsService),
        __param(8, IThemeService),
        __param(9, IUntitledEditorService),
        __param(10, ILabelService)
    ], FileLabel);
    return FileLabel;
}(ResourceLabel));
export { FileLabel };
export function getIconClasses(modelService, modeService, resource, fileKind) {
    // we always set these base classes even if we do not have a path
    var classes = fileKind === FileKind.ROOT_FOLDER ? ['rootfolder-icon'] : fileKind === FileKind.FOLDER ? ['folder-icon'] : ['file-icon'];
    if (resource) {
        // Get the path and name of the resource. For data-URIs, we need to parse specially
        var name_1;
        var path = void 0;
        if (resource.scheme === Schemas.data) {
            var metadata = DataUri.parseMetaData(resource);
            name_1 = metadata.get(DataUri.META_DATA_LABEL);
            path = name_1;
        }
        else {
            name_1 = cssEscape(resources.basenameOrAuthority(resource).toLowerCase());
            path = resource.path.toLowerCase();
        }
        // Folders
        if (fileKind === FileKind.FOLDER) {
            classes.push(name_1 + "-name-folder-icon");
        }
        // Files
        else {
            // Name & Extension(s)
            if (name_1) {
                classes.push(name_1 + "-name-file-icon");
                var dotSegments = name_1.split('.');
                for (var i = 1; i < dotSegments.length; i++) {
                    classes.push(dotSegments.slice(i).join('.') + "-ext-file-icon"); // add each combination of all found extensions if more than one
                }
                classes.push("ext-file-icon"); // extra segment to increase file-ext score
            }
            // Configured Language
            var configuredLangId = getConfiguredLangId(modelService, resource);
            configuredLangId = configuredLangId || modeService.getModeIdByFilepathOrFirstLine(path);
            if (configuredLangId) {
                classes.push(cssEscape(configuredLangId) + "-lang-file-icon");
            }
        }
    }
    return classes;
}
function getConfiguredLangId(modelService, resource) {
    var configuredLangId;
    if (resource) {
        var model = modelService.getModel(resource);
        if (model) {
            var modeId = model.getLanguageIdentifier().language;
            if (modeId && modeId !== PLAINTEXT_MODE_ID) {
                configuredLangId = modeId; // only take if the mode is specific (aka no just plain text)
            }
        }
    }
    return configuredLangId;
}
function cssEscape(val) {
    return val.replace(/\s/g, '\\$&'); // make sure to not introduce CSS classes from files that contain whitespace
}

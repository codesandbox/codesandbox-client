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
import { localize } from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { firstIndex } from '../../../../base/common/arrays.js';
import { KeyChord } from '../../../../base/common/keyCodes.js';
import { SyncActionDescriptor, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions } from '../../../common/actions.js';
import { IWorkbenchThemeService, COLOR_THEME_SETTING, ICON_THEME_SETTING } from '../../../services/themes/common/workbenchThemeService.js';
import { VIEWLET_ID } from '../../extensions/common/extensions.js';
import { IExtensionGalleryService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
import { Delayer } from '../../../../base/common/async.js';
import { IWorkspaceConfigurationService } from '../../../services/configuration/common/configuration.js';
import { Extensions as ColorRegistryExtensions } from '../../../../platform/theme/common/colorRegistry.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Color } from '../../../../base/common/color.js';
import { LIGHT, DARK, HIGH_CONTRAST } from '../../../../platform/theme/common/themeService.js';
import { schemaId } from '../../../services/themes/common/colorThemeSchema.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
var SelectColorThemeAction = /** @class */ (function (_super) {
    __extends(SelectColorThemeAction, _super);
    function SelectColorThemeAction(id, label, quickInputService, themeService, extensionGalleryService, viewletService, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickInputService = quickInputService;
        _this.themeService = themeService;
        _this.extensionGalleryService = extensionGalleryService;
        _this.viewletService = viewletService;
        _this.configurationService = configurationService;
        return _this;
    }
    SelectColorThemeAction.prototype.run = function () {
        var _this = this;
        return this.themeService.getColorThemes().then(function (themes) {
            var currentTheme = _this.themeService.getColorTheme();
            var picks = [].concat(toEntries(themes.filter(function (t) { return t.type === LIGHT; }), localize('themes.category.light', "light themes")), toEntries(themes.filter(function (t) { return t.type === DARK; }), localize('themes.category.dark', "dark themes")), toEntries(themes.filter(function (t) { return t.type === HIGH_CONTRAST; }), localize('themes.category.hc', "high contrast themes")), configurationEntries(_this.extensionGalleryService, localize('installColorThemes', "Install Additional Color Themes...")));
            var selectTheme = function (theme, applyTheme) {
                if (typeof theme.id === 'undefined') { // 'pick in marketplace' entry
                    if (applyTheme) {
                        openExtensionViewlet(_this.viewletService, 'category:themes');
                    }
                    theme = currentTheme;
                }
                var target = null;
                if (applyTheme) {
                    var confValue = _this.configurationService.inspect(COLOR_THEME_SETTING);
                    target = typeof confValue.workspace !== 'undefined' ? 2 /* WORKSPACE */ : 1 /* USER */;
                }
                _this.themeService.setColorTheme(theme.id, target).then(null, function (err) {
                    onUnexpectedError(err);
                    _this.themeService.setColorTheme(currentTheme.id, null);
                });
            };
            var placeHolder = localize('themes.selectTheme', "Select Color Theme (Up/Down Keys to Preview)");
            var autoFocusIndex = firstIndex(picks, function (p) { return p.type !== 'separator' && p.id === currentTheme.id; });
            var delayer = new Delayer(100);
            var chooseTheme = function (theme) { return delayer.trigger(function () { return selectTheme(theme || currentTheme, true); }, 0); };
            var tryTheme = function (theme) { return delayer.trigger(function () { return selectTheme(theme, false); }); };
            return _this.quickInputService.pick(picks, { placeHolder: placeHolder, activeItem: picks[autoFocusIndex], onDidFocus: tryTheme })
                .then(chooseTheme);
        });
    };
    SelectColorThemeAction.ID = 'workbench.action.selectTheme';
    SelectColorThemeAction.LABEL = localize('selectTheme.label', "Color Theme");
    SelectColorThemeAction = __decorate([
        __param(2, IQuickInputService),
        __param(3, IWorkbenchThemeService),
        __param(4, IExtensionGalleryService),
        __param(5, IViewletService),
        __param(6, IWorkspaceConfigurationService)
    ], SelectColorThemeAction);
    return SelectColorThemeAction;
}(Action));
export { SelectColorThemeAction };
var SelectIconThemeAction = /** @class */ (function (_super) {
    __extends(SelectIconThemeAction, _super);
    function SelectIconThemeAction(id, label, quickInputService, themeService, extensionGalleryService, viewletService, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickInputService = quickInputService;
        _this.themeService = themeService;
        _this.extensionGalleryService = extensionGalleryService;
        _this.viewletService = viewletService;
        _this.configurationService = configurationService;
        return _this;
    }
    SelectIconThemeAction.prototype.run = function () {
        var _this = this;
        return this.themeService.getFileIconThemes().then(function (themes) {
            var currentTheme = _this.themeService.getFileIconTheme();
            var picks = [{ id: '', label: localize('noIconThemeLabel', 'None'), description: localize('noIconThemeDesc', 'Disable file icons') }];
            picks = picks.concat(toEntries(themes), configurationEntries(_this.extensionGalleryService, localize('installIconThemes', "Install Additional File Icon Themes...")));
            var selectTheme = function (theme, applyTheme) {
                if (typeof theme.id === 'undefined') { // 'pick in marketplace' entry
                    if (applyTheme) {
                        openExtensionViewlet(_this.viewletService, 'tag:icon-theme');
                    }
                    theme = currentTheme;
                }
                var target = null;
                if (applyTheme) {
                    var confValue = _this.configurationService.inspect(ICON_THEME_SETTING);
                    target = typeof confValue.workspace !== 'undefined' ? 2 /* WORKSPACE */ : 1 /* USER */;
                }
                _this.themeService.setFileIconTheme(theme && theme.id, target).then(null, function (err) {
                    onUnexpectedError(err);
                    _this.themeService.setFileIconTheme(currentTheme.id, null);
                });
            };
            var placeHolder = localize('themes.selectIconTheme', "Select File Icon Theme");
            var autoFocusIndex = firstIndex(picks, function (p) { return p.type !== 'separator' && p.id === currentTheme.id; });
            var delayer = new Delayer(100);
            var chooseTheme = function (theme) { return delayer.trigger(function () { return selectTheme(theme || currentTheme, true); }, 0); };
            var tryTheme = function (theme) { return delayer.trigger(function () { return selectTheme(theme, false); }); };
            return _this.quickInputService.pick(picks, { placeHolder: placeHolder, activeItem: picks[autoFocusIndex], onDidFocus: tryTheme })
                .then(chooseTheme);
        });
    };
    SelectIconThemeAction.ID = 'workbench.action.selectIconTheme';
    SelectIconThemeAction.LABEL = localize('selectIconTheme.label', "File Icon Theme");
    SelectIconThemeAction = __decorate([
        __param(2, IQuickInputService),
        __param(3, IWorkbenchThemeService),
        __param(4, IExtensionGalleryService),
        __param(5, IViewletService),
        __param(6, IWorkspaceConfigurationService)
    ], SelectIconThemeAction);
    return SelectIconThemeAction;
}(Action));
function configurationEntries(extensionGalleryService, label) {
    if (extensionGalleryService.isEnabled()) {
        return [
            {
                type: 'separator'
            },
            {
                id: void 0,
                label: label,
                alwaysShow: true,
            }
        ];
    }
    return [];
}
function openExtensionViewlet(viewletService, query) {
    return viewletService.openViewlet(VIEWLET_ID, true).then(function (viewlet) {
        viewlet.search(query);
        viewlet.focus();
    });
}
function toEntries(themes, label) {
    var toEntry = function (theme) { return ({ id: theme.id, label: theme.label, description: theme.description }); };
    var sorter = function (t1, t2) { return t1.label.localeCompare(t2.label); };
    var entries = themes.map(toEntry).sort(sorter);
    if (entries.length > 0 && label) {
        entries.unshift({ type: 'separator', label: label });
    }
    return entries;
}
var GenerateColorThemeAction = /** @class */ (function (_super) {
    __extends(GenerateColorThemeAction, _super);
    function GenerateColorThemeAction(id, label, themeService, editorService) {
        var _this = _super.call(this, id, label) || this;
        _this.themeService = themeService;
        _this.editorService = editorService;
        return _this;
    }
    GenerateColorThemeAction.prototype.run = function () {
        var theme = this.themeService.getColorTheme();
        var colors = Registry.as(ColorRegistryExtensions.ColorContribution).getColors();
        var colorIds = colors.map(function (c) { return c.id; }).sort();
        var resultingColors = {};
        var inherited = [];
        for (var _i = 0, colorIds_1 = colorIds; _i < colorIds_1.length; _i++) {
            var colorId = colorIds_1[_i];
            var color = theme.getColor(colorId, false);
            if (color) {
                resultingColors[colorId] = Color.Format.CSS.formatHexA(color, true);
            }
            else {
                inherited.push(colorId);
            }
        }
        for (var _a = 0, inherited_1 = inherited; _a < inherited_1.length; _a++) {
            var id = inherited_1[_a];
            var color = theme.getColor(id);
            if (color) {
                resultingColors['__' + id] = Color.Format.CSS.formatHexA(color, true);
            }
        }
        var contents = JSON.stringify({
            '$schema': schemaId,
            type: theme.type,
            colors: resultingColors,
            tokenColors: theme.tokenColors.filter(function (t) { return !!t.scope; })
        }, null, '\t');
        contents = contents.replace(/\"__/g, '//"');
        return this.editorService.openEditor({ contents: contents, language: 'jsonc' });
    };
    GenerateColorThemeAction.ID = 'workbench.action.generateColorTheme';
    GenerateColorThemeAction.LABEL = localize('generateColorTheme.label', "Generate Color Theme From Current Settings");
    GenerateColorThemeAction = __decorate([
        __param(2, IWorkbenchThemeService),
        __param(3, IEditorService)
    ], GenerateColorThemeAction);
    return GenerateColorThemeAction;
}(Action));
var category = localize('preferences', "Preferences");
var colorThemeDescriptor = new SyncActionDescriptor(SelectColorThemeAction, SelectColorThemeAction.ID, SelectColorThemeAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 50 /* KEY_T */) });
Registry.as(Extensions.WorkbenchActions).registerWorkbenchAction(colorThemeDescriptor, 'Preferences: Color Theme', category);
var iconThemeDescriptor = new SyncActionDescriptor(SelectIconThemeAction, SelectIconThemeAction.ID, SelectIconThemeAction.LABEL);
Registry.as(Extensions.WorkbenchActions).registerWorkbenchAction(iconThemeDescriptor, 'Preferences: File Icon Theme', category);
var developerCategory = localize('developer', "Developer");
var generateColorThemeDescriptor = new SyncActionDescriptor(GenerateColorThemeAction, GenerateColorThemeAction.ID, GenerateColorThemeAction.LABEL);
Registry.as(Extensions.WorkbenchActions).registerWorkbenchAction(generateColorThemeDescriptor, 'Developer: Generate Color Theme From Current Settings', developerCategory);
MenuRegistry.appendMenuItem(19 /* MenubarPreferencesMenu */, {
    group: '4_themes',
    command: {
        id: SelectColorThemeAction.ID,
        title: localize({ key: 'miSelectColorTheme', comment: ['&& denotes a mnemonic'] }, "&&Color Theme")
    },
    order: 1
});
MenuRegistry.appendMenuItem(19 /* MenubarPreferencesMenu */, {
    group: '4_themes',
    command: {
        id: SelectIconThemeAction.ID,
        title: localize({ key: 'miSelectIconTheme', comment: ['&& denotes a mnemonic'] }, "File &&Icon Theme")
    },
    order: 2
});

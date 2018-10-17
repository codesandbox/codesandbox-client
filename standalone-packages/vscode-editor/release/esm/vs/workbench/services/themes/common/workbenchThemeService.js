/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
export var IWorkbenchThemeService = createDecorator('themeService');
export var VS_LIGHT_THEME = 'vs';
export var VS_DARK_THEME = 'vs-dark';
export var VS_HC_THEME = 'hc-black';
export var HC_THEME_ID = 'Default High Contrast';
export var COLOR_THEME_SETTING = 'workbench.colorTheme';
export var DETECT_HC_SETTING = 'window.autoDetectHighContrast';
export var ICON_THEME_SETTING = 'workbench.iconTheme';
export var CUSTOM_WORKBENCH_COLORS_SETTING = 'workbench.colorCustomizations';
export var CUSTOM_EDITOR_COLORS_SETTING = 'editor.tokenColorCustomizations';
export var CUSTOM_EDITOR_SCOPE_COLORS_SETTING = 'textMateRules';

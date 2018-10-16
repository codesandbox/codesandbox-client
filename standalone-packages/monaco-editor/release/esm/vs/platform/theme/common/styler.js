/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { focusBorder, inputBackground, inputForeground, selectForeground, selectBackground, selectListBackground, selectBorder, inputBorder, foreground, editorBackground, contrastBorder, inputActiveOptionBorder, listFocusBackground, listFocusForeground, listActiveSelectionBackground, listActiveSelectionForeground, listInactiveSelectionForeground, listInactiveSelectionBackground, listInactiveFocusBackground, listHoverBackground, listHoverForeground, listDropBackground, pickerGroupBorder, pickerGroupForeground, widgetShadow, inputValidationInfoBorder, inputValidationInfoBackground, inputValidationWarningBorder, inputValidationWarningBackground, inputValidationErrorBorder, inputValidationErrorBackground, activeContrastBorder, buttonForeground, buttonBackground, buttonHoverBackground, badgeBackground, badgeForeground, progressBarBackground, breadcrumbsForeground, breadcrumbsFocusForeground, breadcrumbsActiveSelectionForeground, breadcrumbsBackground, editorWidgetBorder, inputValidationInfoForeground, inputValidationWarningForeground, inputValidationErrorForeground, menuForeground, menuBackground, menuSelectionForeground, menuSelectionBackground, menuSelectionBorder, menuBorder, menuSeparatorBackground } from './colorRegistry.js';
import { mixin } from '../../../base/common/objects.js';
export function computeStyles(theme, styleMap) {
    var styles = Object.create(null);
    for (var key in styleMap) {
        var value = styleMap[key];
        if (typeof value === 'string') {
            styles[key] = theme.getColor(value);
        }
        else if (typeof value === 'function') {
            styles[key] = value(theme);
        }
    }
    return styles;
}
export function attachStyler(themeService, styleMap, widgetOrCallback) {
    function applyStyles(theme) {
        var styles = computeStyles(themeService.getTheme(), styleMap);
        if (typeof widgetOrCallback === 'function') {
            widgetOrCallback(styles);
        }
        else {
            widgetOrCallback.style(styles);
        }
    }
    applyStyles(themeService.getTheme());
    return themeService.onThemeChange(applyStyles);
}
export function attachCheckboxStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        inputActiveOptionBorder: (style && style.inputActiveOptionBorderColor) || inputActiveOptionBorder
    }, widget);
}
export function attachBadgeStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        badgeBackground: (style && style.badgeBackground) || badgeBackground,
        badgeForeground: (style && style.badgeForeground) || badgeForeground,
        badgeBorder: contrastBorder
    }, widget);
}
export function attachInputBoxStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        inputBackground: (style && style.inputBackground) || inputBackground,
        inputForeground: (style && style.inputForeground) || inputForeground,
        inputBorder: (style && style.inputBorder) || inputBorder,
        inputValidationInfoBorder: (style && style.inputValidationInfoBorder) || inputValidationInfoBorder,
        inputValidationInfoBackground: (style && style.inputValidationInfoBackground) || inputValidationInfoBackground,
        inputValidationInfoForeground: (style && style.inputValidationInfoForeground) || inputValidationInfoForeground,
        inputValidationWarningBorder: (style && style.inputValidationWarningBorder) || inputValidationWarningBorder,
        inputValidationWarningBackground: (style && style.inputValidationWarningBackground) || inputValidationWarningBackground,
        inputValidationWarningForeground: (style && style.inputValidationWarningForeground) || inputValidationWarningForeground,
        inputValidationErrorBorder: (style && style.inputValidationErrorBorder) || inputValidationErrorBorder,
        inputValidationErrorBackground: (style && style.inputValidationErrorBackground) || inputValidationErrorBackground,
        inputValidationErrorForeground: (style && style.inputValidationErrorForeground) || inputValidationErrorForeground
    }, widget);
}
export function attachSelectBoxStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        selectBackground: (style && style.selectBackground) || selectBackground,
        selectListBackground: (style && style.selectListBackground) || selectListBackground,
        selectForeground: (style && style.selectForeground) || selectForeground,
        selectBorder: (style && style.selectBorder) || selectBorder,
        focusBorder: (style && style.focusBorder) || focusBorder,
        listFocusBackground: (style && style.listFocusBackground) || listFocusBackground,
        listFocusForeground: (style && style.listFocusForeground) || listFocusForeground,
        listFocusOutline: (style && style.listFocusOutline) || activeContrastBorder,
        listHoverBackground: (style && style.listHoverBackground) || listHoverBackground,
        listHoverForeground: (style && style.listHoverForeground) || listHoverForeground,
        listHoverOutline: (style && style.listFocusOutline) || activeContrastBorder,
        selectListBorder: (style && style.selectListBorder) || editorWidgetBorder
    }, widget);
}
export function attachFindInputBoxStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        inputBackground: (style && style.inputBackground) || inputBackground,
        inputForeground: (style && style.inputForeground) || inputForeground,
        inputBorder: (style && style.inputBorder) || inputBorder,
        inputActiveOptionBorder: (style && style.inputActiveOptionBorder) || inputActiveOptionBorder,
        inputValidationInfoBorder: (style && style.inputValidationInfoBorder) || inputValidationInfoBorder,
        inputValidationInfoBackground: (style && style.inputValidationInfoBackground) || inputValidationInfoBackground,
        inputValidationInfoForeground: (style && style.inputValidationInfoForeground) || inputValidationInfoForeground,
        inputValidationWarningBorder: (style && style.inputValidationWarningBorder) || inputValidationWarningBorder,
        inputValidationWarningBackground: (style && style.inputValidationWarningBackground) || inputValidationWarningBackground,
        inputValidationWarningForeground: (style && style.inputValidationWarningForeground) || inputValidationWarningForeground,
        inputValidationErrorBorder: (style && style.inputValidationErrorBorder) || inputValidationErrorBorder,
        inputValidationErrorBackground: (style && style.inputValidationErrorBackground) || inputValidationErrorBackground,
        inputValidationErrorForeground: (style && style.inputValidationErrorForeground) || inputValidationErrorForeground
    }, widget);
}
export function attachQuickOpenStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        foreground: (style && style.foreground) || foreground,
        background: (style && style.background) || editorBackground,
        borderColor: style && style.borderColor || contrastBorder,
        widgetShadow: style && style.widgetShadow || widgetShadow,
        progressBarBackground: style && style.progressBarBackground || progressBarBackground,
        pickerGroupForeground: style && style.pickerGroupForeground || pickerGroupForeground,
        pickerGroupBorder: style && style.pickerGroupBorder || pickerGroupBorder,
        inputBackground: (style && style.inputBackground) || inputBackground,
        inputForeground: (style && style.inputForeground) || inputForeground,
        inputBorder: (style && style.inputBorder) || inputBorder,
        inputValidationInfoBorder: (style && style.inputValidationInfoBorder) || inputValidationInfoBorder,
        inputValidationInfoBackground: (style && style.inputValidationInfoBackground) || inputValidationInfoBackground,
        inputValidationInfoForeground: (style && style.inputValidationInfoForeground) || inputValidationInfoForeground,
        inputValidationWarningBorder: (style && style.inputValidationWarningBorder) || inputValidationWarningBorder,
        inputValidationWarningBackground: (style && style.inputValidationWarningBackground) || inputValidationWarningBackground,
        inputValidationWarningForeground: (style && style.inputValidationWarningForeground) || inputValidationWarningForeground,
        inputValidationErrorBorder: (style && style.inputValidationErrorBorder) || inputValidationErrorBorder,
        inputValidationErrorBackground: (style && style.inputValidationErrorBackground) || inputValidationErrorBackground,
        inputValidationErrorForeground: (style && style.inputValidationErrorForeground) || inputValidationErrorForeground,
        listFocusBackground: (style && style.listFocusBackground) || listFocusBackground,
        listFocusForeground: (style && style.listFocusForeground) || listFocusForeground,
        listActiveSelectionBackground: (style && style.listActiveSelectionBackground) || listActiveSelectionBackground,
        listActiveSelectionForeground: (style && style.listActiveSelectionForeground) || listActiveSelectionForeground,
        listFocusAndSelectionBackground: style && style.listFocusAndSelectionBackground || listActiveSelectionBackground,
        listFocusAndSelectionForeground: (style && style.listFocusAndSelectionForeground) || listActiveSelectionForeground,
        listInactiveSelectionBackground: (style && style.listInactiveSelectionBackground) || listInactiveSelectionBackground,
        listInactiveSelectionForeground: (style && style.listInactiveSelectionForeground) || listInactiveSelectionForeground,
        listInactiveFocusBackground: (style && style.listInactiveFocusBackground) || listInactiveFocusBackground,
        listHoverBackground: (style && style.listHoverBackground) || listHoverBackground,
        listHoverForeground: (style && style.listHoverForeground) || listHoverForeground,
        listDropBackground: (style && style.listDropBackground) || listDropBackground,
        listFocusOutline: (style && style.listFocusOutline) || activeContrastBorder,
        listSelectionOutline: (style && style.listSelectionOutline) || activeContrastBorder,
        listHoverOutline: (style && style.listHoverOutline) || activeContrastBorder
    }, widget);
}
export function attachListStyler(widget, themeService, overrides) {
    return attachStyler(themeService, mixin(overrides || Object.create(null), defaultListStyles, false), widget);
}
export var defaultListStyles = {
    listFocusBackground: listFocusBackground,
    listFocusForeground: listFocusForeground,
    listActiveSelectionBackground: listActiveSelectionBackground,
    listActiveSelectionForeground: listActiveSelectionForeground,
    listFocusAndSelectionBackground: listActiveSelectionBackground,
    listFocusAndSelectionForeground: listActiveSelectionForeground,
    listInactiveSelectionBackground: listInactiveSelectionBackground,
    listInactiveSelectionForeground: listInactiveSelectionForeground,
    listInactiveFocusBackground: listInactiveFocusBackground,
    listHoverBackground: listHoverBackground,
    listHoverForeground: listHoverForeground,
    listDropBackground: listDropBackground,
    listFocusOutline: activeContrastBorder,
    listSelectionOutline: activeContrastBorder,
    listHoverOutline: activeContrastBorder
};
export function attachButtonStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        buttonForeground: (style && style.buttonForeground) || buttonForeground,
        buttonBackground: (style && style.buttonBackground) || buttonBackground,
        buttonHoverBackground: (style && style.buttonHoverBackground) || buttonHoverBackground,
        buttonBorder: contrastBorder
    }, widget);
}
export function attachProgressBarStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        progressBarBackground: (style && style.progressBarBackground) || progressBarBackground
    }, widget);
}
export function attachStylerCallback(themeService, colors, callback) {
    return attachStyler(themeService, colors, callback);
}
export var defaultBreadcrumbsStyles = {
    breadcrumbsBackground: breadcrumbsBackground,
    breadcrumbsForeground: breadcrumbsForeground,
    breadcrumbsHoverForeground: breadcrumbsFocusForeground,
    breadcrumbsFocusForeground: breadcrumbsFocusForeground,
    breadcrumbsFocusAndSelectionForeground: breadcrumbsActiveSelectionForeground,
};
export function attachBreadcrumbsStyler(widget, themeService, style) {
    return attachStyler(themeService, __assign({}, defaultBreadcrumbsStyles, style), widget);
}
export var defaultMenuStyles = {
    shadowColor: widgetShadow,
    borderColor: menuBorder,
    foregroundColor: menuForeground,
    backgroundColor: menuBackground,
    selectionForegroundColor: menuSelectionForeground,
    selectionBackgroundColor: menuSelectionBackground,
    selectionBorderColor: menuSelectionBorder,
    separatorColor: menuSeparatorBackground
};
export function attachMenuStyler(widget, themeService, style) {
    var styles = __assign({}, defaultMenuStyles, style);
    var fallback = {
        foregroundColor: !!styles.foregroundColor && !!themeService && !!themeService.getTheme().getColor(styles.foregroundColor) ? styles.foregroundColor : foreground
    };
    return attachStyler(themeService, __assign({}, styles, fallback), widget);
}

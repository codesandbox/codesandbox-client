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
import * as nls from '../../nls';
import { registerColor, editorBackground, contrastBorder, transparent, editorWidgetBackground, textLinkForeground, lighten, darken, focusBorder, activeContrastBorder } from '../../platform/theme/common/colorRegistry';
import { Disposable } from '../../base/common/lifecycle';
import { Color } from '../../base/common/color';
// < --- Workbench (not customizable) --- >
export function WORKBENCH_BACKGROUND(theme) {
    switch (theme.type) {
        case 'dark':
            return Color.fromHex('#252526');
        case 'light':
            return Color.fromHex('#F3F3F3');
        default:
            return Color.fromHex('#000000');
    }
}
// < --- Tabs --- >
export var TAB_ACTIVE_BACKGROUND = registerColor('tab.activeBackground', {
    dark: editorBackground,
    light: editorBackground,
    hc: editorBackground
}, nls.localize('tabActiveBackground', "Active tab background color. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_INACTIVE_BACKGROUND = registerColor('tab.inactiveBackground', {
    dark: '#2D2D2D',
    light: '#ECECEC',
    hc: null
}, nls.localize('tabInactiveBackground', "Inactive tab background color. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_HOVER_BACKGROUND = registerColor('tab.hoverBackground', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('tabHoverBackground', "Tab background color when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_UNFOCUSED_HOVER_BACKGROUND = registerColor('tab.unfocusedHoverBackground', {
    dark: transparent(TAB_HOVER_BACKGROUND, 0.5),
    light: transparent(TAB_HOVER_BACKGROUND, 0.7),
    hc: null
}, nls.localize('tabUnfocusedHoverBackground', "Tab background color in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_BORDER = registerColor('tab.border', {
    dark: '#252526',
    light: '#F3F3F3',
    hc: contrastBorder
}, nls.localize('tabBorder', "Border to separate tabs from each other. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_ACTIVE_BORDER = registerColor('tab.activeBorder', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('tabActiveBorder', "Border on the bottom of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_ACTIVE_BORDER_TOP = registerColor('tab.activeBorderTop', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('tabActiveBorderTop', "Border to the top of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_UNFOCUSED_ACTIVE_BORDER = registerColor('tab.unfocusedActiveBorder', {
    dark: transparent(TAB_ACTIVE_BORDER, 0.5),
    light: transparent(TAB_ACTIVE_BORDER, 0.7),
    hc: null
}, nls.localize('tabActiveUnfocusedBorder', "Border on the bottom of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_UNFOCUSED_ACTIVE_BORDER_TOP = registerColor('tab.unfocusedActiveBorderTop', {
    dark: transparent(TAB_ACTIVE_BORDER_TOP, 0.5),
    light: transparent(TAB_ACTIVE_BORDER_TOP, 0.7),
    hc: null
}, nls.localize('tabActiveUnfocusedBorderTop', "Border to the top of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_HOVER_BORDER = registerColor('tab.hoverBorder', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('tabHoverBorder', "Border to highlight tabs when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_UNFOCUSED_HOVER_BORDER = registerColor('tab.unfocusedHoverBorder', {
    dark: transparent(TAB_HOVER_BORDER, 0.5),
    light: transparent(TAB_HOVER_BORDER, 0.7),
    hc: null
}, nls.localize('tabUnfocusedHoverBorder', "Border to highlight tabs in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_ACTIVE_FOREGROUND = registerColor('tab.activeForeground', {
    dark: Color.white,
    light: '#333333',
    hc: Color.white
}, nls.localize('tabActiveForeground', "Active tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_INACTIVE_FOREGROUND = registerColor('tab.inactiveForeground', {
    dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
    light: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
    hc: Color.white
}, nls.localize('tabInactiveForeground', "Inactive tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_UNFOCUSED_ACTIVE_FOREGROUND = registerColor('tab.unfocusedActiveForeground', {
    dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
    light: transparent(TAB_ACTIVE_FOREGROUND, 0.7),
    hc: Color.white
}, nls.localize('tabUnfocusedActiveForeground', "Active tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
export var TAB_UNFOCUSED_INACTIVE_FOREGROUND = registerColor('tab.unfocusedInactiveForeground', {
    dark: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
    light: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
    hc: Color.white
}, nls.localize('tabUnfocusedInactiveForeground', "Inactive tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));
// < --- Editors --- >
export var EDITOR_PANE_BACKGROUND = registerColor('editorPane.background', {
    dark: editorBackground,
    light: editorBackground,
    hc: editorBackground
}, nls.localize('editorPaneBackground', "Background color of the editor pane visible on the left and right side of the centered editor layout."));
registerColor('editorGroup.background', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('editorGroupBackground', "Deprecated background color of an editor group."), false, nls.localize('deprecatedEditorGroupBackground', "Deprecated: Background color of an editor group is no longer being supported with the introduction of the grid editor layout. You can use editorGroup.emptyBackground to set the background color of empty editor groups."));
export var EDITOR_GROUP_EMPTY_BACKGROUND = registerColor('editorGroup.emptyBackground', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('editorGroupEmptyBackground', "Background color of an empty editor group. Editor groups are the containers of editors."));
export var EDITOR_GROUP_FOCUSED_EMPTY_BORDER = registerColor('editorGroup.focusedEmptyBorder', {
    dark: null,
    light: null,
    hc: focusBorder
}, nls.localize('editorGroupFocusedEmptyBorder', "Border color of an empty editor group that is focused. Editor groups are the containers of editors."));
export var EDITOR_GROUP_HEADER_TABS_BACKGROUND = registerColor('editorGroupHeader.tabsBackground', {
    dark: '#252526',
    light: '#F3F3F3',
    hc: null
}, nls.localize('tabsContainerBackground', "Background color of the editor group title header when tabs are enabled. Editor groups are the containers of editors."));
export var EDITOR_GROUP_HEADER_TABS_BORDER = registerColor('editorGroupHeader.tabsBorder', {
    dark: null,
    light: null,
    hc: contrastBorder
}, nls.localize('tabsContainerBorder', "Border color of the editor group title header when tabs are enabled. Editor groups are the containers of editors."));
export var EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND = registerColor('editorGroupHeader.noTabsBackground', {
    dark: editorBackground,
    light: editorBackground,
    hc: editorBackground
}, nls.localize('editorGroupHeaderBackground', "Background color of the editor group title header when tabs are disabled (`\"workbench.editor.showTabs\": false`). Editor groups are the containers of editors."));
export var EDITOR_GROUP_BORDER = registerColor('editorGroup.border', {
    dark: '#444444',
    light: '#E7E7E7',
    hc: contrastBorder
}, nls.localize('editorGroupBorder', "Color to separate multiple editor groups from each other. Editor groups are the containers of editors."));
export var EDITOR_DRAG_AND_DROP_BACKGROUND = registerColor('editorGroup.dropBackground', {
    dark: Color.fromHex('#53595D').transparent(0.5),
    light: Color.fromHex('#2677CB').transparent(0.18),
    hc: null
}, nls.localize('editorDragAndDropBackground', "Background color when dragging editors around. The color should have transparency so that the editor contents can still shine through."));
// < --- Panels --- >
export var PANEL_BACKGROUND = registerColor('panel.background', {
    dark: editorBackground,
    light: editorBackground,
    hc: editorBackground
}, nls.localize('panelBackground', "Panel background color. Panels are shown below the editor area and contain views like output and integrated terminal."));
export var PANEL_BORDER = registerColor('panel.border', {
    dark: Color.fromHex('#808080').transparent(0.35),
    light: Color.fromHex('#808080').transparent(0.35),
    hc: contrastBorder
}, nls.localize('panelBorder', "Panel border color to separate the panel from the editor. Panels are shown below the editor area and contain views like output and integrated terminal."));
export var PANEL_ACTIVE_TITLE_FOREGROUND = registerColor('panelTitle.activeForeground', {
    dark: '#E7E7E7',
    light: '#424242',
    hc: Color.white
}, nls.localize('panelActiveTitleForeground', "Title color for the active panel. Panels are shown below the editor area and contain views like output and integrated terminal."));
export var PANEL_INACTIVE_TITLE_FOREGROUND = registerColor('panelTitle.inactiveForeground', {
    dark: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.6),
    light: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.75),
    hc: Color.white
}, nls.localize('panelInactiveTitleForeground', "Title color for the inactive panel. Panels are shown below the editor area and contain views like output and integrated terminal."));
export var PANEL_ACTIVE_TITLE_BORDER = registerColor('panelTitle.activeBorder', {
    dark: PANEL_BORDER,
    light: PANEL_BORDER,
    hc: contrastBorder
}, nls.localize('panelActiveTitleBorder', "Border color for the active panel title. Panels are shown below the editor area and contain views like output and integrated terminal."));
export var PANEL_DRAG_AND_DROP_BACKGROUND = registerColor('panel.dropBackground', {
    dark: Color.white.transparent(0.12),
    light: Color.fromHex('#2677CB').transparent(0.18),
    hc: Color.white.transparent(0.12)
}, nls.localize('panelDragAndDropBackground', "Drag and drop feedback color for the panel title items. The color should have transparency so that the panel entries can still shine through. Panels are shown below the editor area and contain views like output and integrated terminal."));
// < --- Status --- >
export var STATUS_BAR_FOREGROUND = registerColor('statusBar.foreground', {
    dark: '#FFFFFF',
    light: '#FFFFFF',
    hc: '#FFFFFF'
}, nls.localize('statusBarForeground', "Status bar foreground color when a workspace is opened. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_NO_FOLDER_FOREGROUND = registerColor('statusBar.noFolderForeground', {
    dark: STATUS_BAR_FOREGROUND,
    light: STATUS_BAR_FOREGROUND,
    hc: STATUS_BAR_FOREGROUND
}, nls.localize('statusBarNoFolderForeground', "Status bar foreground color when no folder is opened. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_BACKGROUND = registerColor('statusBar.background', {
    dark: '#007ACC',
    light: '#007ACC',
    hc: null
}, nls.localize('statusBarBackground', "Status bar background color when a workspace is opened. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_NO_FOLDER_BACKGROUND = registerColor('statusBar.noFolderBackground', {
    dark: '#68217A',
    light: '#68217A',
    hc: null
}, nls.localize('statusBarNoFolderBackground', "Status bar background color when no folder is opened. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_BORDER = registerColor('statusBar.border', {
    dark: null,
    light: null,
    hc: contrastBorder
}, nls.localize('statusBarBorder', "Status bar border color separating to the sidebar and editor. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_NO_FOLDER_BORDER = registerColor('statusBar.noFolderBorder', {
    dark: STATUS_BAR_BORDER,
    light: STATUS_BAR_BORDER,
    hc: STATUS_BAR_BORDER
}, nls.localize('statusBarNoFolderBorder', "Status bar border color separating to the sidebar and editor when no folder is opened. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_ITEM_ACTIVE_BACKGROUND = registerColor('statusBarItem.activeBackground', {
    dark: Color.white.transparent(0.18),
    light: Color.white.transparent(0.18),
    hc: Color.white.transparent(0.18)
}, nls.localize('statusBarItemActiveBackground', "Status bar item background color when clicking. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.hoverBackground', {
    dark: Color.white.transparent(0.12),
    light: Color.white.transparent(0.12),
    hc: Color.white.transparent(0.12)
}, nls.localize('statusBarItemHoverBackground', "Status bar item background color when hovering. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_PROMINENT_ITEM_BACKGROUND = registerColor('statusBarItem.prominentBackground', {
    dark: '#388A34',
    light: '#388A34',
    hc: '#3883A4'
}, nls.localize('statusBarProminentItemBackground', "Status bar prominent items background color. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window."));
export var STATUS_BAR_PROMINENT_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.prominentHoverBackground', {
    dark: '#369432',
    light: '#369432',
    hc: '#369432'
}, nls.localize('statusBarProminentItemHoverBackground', "Status bar prominent items background color when hovering. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window."));
// < --- Activity Bar --- >
export var ACTIVITY_BAR_BACKGROUND = registerColor('activityBar.background', {
    dark: '#333333',
    light: '#2C2C2C',
    hc: '#000000'
}, nls.localize('activityBarBackground', "Activity bar background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));
export var ACTIVITY_BAR_FOREGROUND = registerColor('activityBar.foreground', {
    dark: Color.white,
    light: Color.white,
    hc: Color.white
}, nls.localize('activityBarForeground', "Activity bar item foreground color when it is active. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));
export var ACTIVITY_BAR_INACTIVE_FOREGROUND = registerColor('activityBar.inactiveForeground', {
    dark: transparent(ACTIVITY_BAR_FOREGROUND, 0.6),
    light: transparent(ACTIVITY_BAR_FOREGROUND, 0.6),
    hc: Color.white
}, nls.localize('activityBarInActiveForeground', "Activity bar item foreground color when it is inactive. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));
export var ACTIVITY_BAR_BORDER = registerColor('activityBar.border', {
    dark: null,
    light: null,
    hc: contrastBorder
}, nls.localize('activityBarBorder', "Activity bar border color separating to the side bar. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));
export var ACTIVITY_BAR_DRAG_AND_DROP_BACKGROUND = registerColor('activityBar.dropBackground', {
    dark: Color.white.transparent(0.12),
    light: Color.white.transparent(0.12),
    hc: Color.white.transparent(0.12),
}, nls.localize('activityBarDragAndDropBackground', "Drag and drop feedback color for the activity bar items. The color should have transparency so that the activity bar entries can still shine through. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));
export var ACTIVITY_BAR_BADGE_BACKGROUND = registerColor('activityBarBadge.background', {
    dark: '#007ACC',
    light: '#007ACC',
    hc: '#000000'
}, nls.localize('activityBarBadgeBackground', "Activity notification badge background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));
export var ACTIVITY_BAR_BADGE_FOREGROUND = registerColor('activityBarBadge.foreground', {
    dark: Color.white,
    light: Color.white,
    hc: Color.white
}, nls.localize('activityBarBadgeForeground', "Activity notification badge foreground color. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));
// < --- Side Bar --- >
export var SIDE_BAR_BACKGROUND = registerColor('sideBar.background', {
    dark: '#252526',
    light: '#F3F3F3',
    hc: '#000000'
}, nls.localize('sideBarBackground', "Side bar background color. The side bar is the container for views like explorer and search."));
export var SIDE_BAR_FOREGROUND = registerColor('sideBar.foreground', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('sideBarForeground', "Side bar foreground color. The side bar is the container for views like explorer and search."));
export var SIDE_BAR_BORDER = registerColor('sideBar.border', {
    dark: null,
    light: null,
    hc: contrastBorder
}, nls.localize('sideBarBorder', "Side bar border color on the side separating to the editor. The side bar is the container for views like explorer and search."));
export var SIDE_BAR_TITLE_FOREGROUND = registerColor('sideBarTitle.foreground', {
    dark: SIDE_BAR_FOREGROUND,
    light: SIDE_BAR_FOREGROUND,
    hc: SIDE_BAR_FOREGROUND
}, nls.localize('sideBarTitleForeground', "Side bar title foreground color. The side bar is the container for views like explorer and search."));
export var SIDE_BAR_DRAG_AND_DROP_BACKGROUND = registerColor('sideBar.dropBackground', {
    dark: Color.white.transparent(0.12),
    light: Color.white.transparent(0.12),
    hc: Color.white.transparent(0.12),
}, nls.localize('sideBarDragAndDropBackground', "Drag and drop feedback color for the side bar sections. The color should have transparency so that the side bar sections can still shine through. The side bar is the container for views like explorer and search."));
export var SIDE_BAR_SECTION_HEADER_BACKGROUND = registerColor('sideBarSectionHeader.background', {
    dark: Color.fromHex('#808080').transparent(0.2),
    light: Color.fromHex('#808080').transparent(0.2),
    hc: null
}, nls.localize('sideBarSectionHeaderBackground', "Side bar section header background color. The side bar is the container for views like explorer and search."));
export var SIDE_BAR_SECTION_HEADER_FOREGROUND = registerColor('sideBarSectionHeader.foreground', {
    dark: SIDE_BAR_FOREGROUND,
    light: SIDE_BAR_FOREGROUND,
    hc: SIDE_BAR_FOREGROUND
}, nls.localize('sideBarSectionHeaderForeground', "Side bar section header foreground color. The side bar is the container for views like explorer and search."));
export var SIDE_BAR_SECTION_HEADER_BORDER = registerColor('sideBarSectionHeader.border', {
    dark: contrastBorder,
    light: contrastBorder,
    hc: contrastBorder
}, nls.localize('sideBarSectionHeaderBorder', "Side bar section header border color. The side bar is the container for views like explorer and search."));
// < --- Title Bar --- >
export var TITLE_BAR_ACTIVE_FOREGROUND = registerColor('titleBar.activeForeground', {
    dark: '#CCCCCC',
    light: '#333333',
    hc: '#FFFFFF'
}, nls.localize('titleBarActiveForeground', "Title bar foreground when the window is active. Note that this color is currently only supported on macOS."));
export var TITLE_BAR_INACTIVE_FOREGROUND = registerColor('titleBar.inactiveForeground', {
    dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
    light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
    hc: null
}, nls.localize('titleBarInactiveForeground', "Title bar foreground when the window is inactive. Note that this color is currently only supported on macOS."));
export var TITLE_BAR_ACTIVE_BACKGROUND = registerColor('titleBar.activeBackground', {
    dark: '#3C3C3C',
    light: '#DDDDDD',
    hc: '#000000'
}, nls.localize('titleBarActiveBackground', "Title bar background when the window is active. Note that this color is currently only supported on macOS."));
export var TITLE_BAR_INACTIVE_BACKGROUND = registerColor('titleBar.inactiveBackground', {
    dark: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
    light: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
    hc: null
}, nls.localize('titleBarInactiveBackground', "Title bar background when the window is inactive. Note that this color is currently only supported on macOS."));
export var TITLE_BAR_BORDER = registerColor('titleBar.border', {
    dark: null,
    light: null,
    hc: contrastBorder
}, nls.localize('titleBarBorder', "Title bar border color. Note that this color is currently only supported on macOS."));
// < --- Menubar --- >
export var MENUBAR_SELECTION_FOREGROUND = registerColor('menubar.selectionForeground', {
    dark: TITLE_BAR_ACTIVE_FOREGROUND,
    light: TITLE_BAR_ACTIVE_FOREGROUND,
    hc: TITLE_BAR_ACTIVE_FOREGROUND
}, nls.localize('menubarSelectionForeground', "Foreground color of the selected menu item in the menubar."));
export var MENUBAR_SELECTION_BACKGROUND = registerColor('menubar.selectionBackground', {
    dark: transparent(Color.white, 0.1),
    light: transparent(Color.black, 0.1),
    hc: null
}, nls.localize('menubarSelectionBackground', "Background color of the selected menu item in the menubar."));
export var MENUBAR_SELECTION_BORDER = registerColor('menubar.selectionBorder', {
    dark: null,
    light: null,
    hc: activeContrastBorder
}, nls.localize('menubarSelectionBorder', "Border color of the selected menu item in the menubar."));
// < --- Notifications --- >
export var NOTIFICATIONS_CENTER_BORDER = registerColor('notificationCenter.border', {
    dark: null,
    light: null,
    hc: contrastBorder
}, nls.localize('notificationCenterBorder', "Notifications center border color. Notifications slide in from the bottom right of the window."));
export var NOTIFICATIONS_TOAST_BORDER = registerColor('notificationToast.border', {
    dark: null,
    light: null,
    hc: contrastBorder
}, nls.localize('notificationToastBorder', "Notification toast border color. Notifications slide in from the bottom right of the window."));
export var NOTIFICATIONS_FOREGROUND = registerColor('notifications.foreground', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('notificationsForeground', "Notifications foreground color. Notifications slide in from the bottom right of the window."));
export var NOTIFICATIONS_BACKGROUND = registerColor('notifications.background', {
    dark: editorWidgetBackground,
    light: editorWidgetBackground,
    hc: editorWidgetBackground
}, nls.localize('notificationsBackground', "Notifications background color. Notifications slide in from the bottom right of the window."));
export var NOTIFICATIONS_LINKS = registerColor('notificationLink.foreground', {
    dark: textLinkForeground,
    light: textLinkForeground,
    hc: textLinkForeground
}, nls.localize('notificationsLink', "Notification links foreground color. Notifications slide in from the bottom right of the window."));
export var NOTIFICATIONS_CENTER_HEADER_FOREGROUND = registerColor('notificationCenterHeader.foreground', {
    dark: null,
    light: null,
    hc: null
}, nls.localize('notificationCenterHeaderForeground', "Notifications center header foreground color. Notifications slide in from the bottom right of the window."));
export var NOTIFICATIONS_CENTER_HEADER_BACKGROUND = registerColor('notificationCenterHeader.background', {
    dark: lighten(NOTIFICATIONS_BACKGROUND, 0.3),
    light: darken(NOTIFICATIONS_BACKGROUND, 0.05),
    hc: NOTIFICATIONS_BACKGROUND
}, nls.localize('notificationCenterHeaderBackground', "Notifications center header background color. Notifications slide in from the bottom right of the window."));
export var NOTIFICATIONS_BORDER = registerColor('notifications.border', {
    dark: NOTIFICATIONS_CENTER_HEADER_BACKGROUND,
    light: NOTIFICATIONS_CENTER_HEADER_BACKGROUND,
    hc: NOTIFICATIONS_CENTER_HEADER_BACKGROUND
}, nls.localize('notificationsBorder', "Notifications border color separating from other notifications in the notifications center. Notifications slide in from the bottom right of the window."));
/**
 * Base class for all themable workbench components.
 */
var Themable = /** @class */ (function (_super) {
    __extends(Themable, _super);
    function Themable(themeService) {
        var _this = _super.call(this) || this;
        _this.themeService = themeService;
        _this.theme = themeService.getTheme();
        // Hook up to theme changes
        _this._register(_this.themeService.onThemeChange(function (theme) { return _this.onThemeChange(theme); }));
        return _this;
    }
    Themable.prototype.onThemeChange = function (theme) {
        this.theme = theme;
        this.updateStyles();
    };
    Themable.prototype.updateStyles = function () {
        // Subclasses to override
    };
    Themable.prototype.getColor = function (id, modify) {
        var color = this.theme.getColor(id);
        if (color && modify) {
            color = modify(color, this.theme);
        }
        return color ? color.toString() : null;
    };
    return Themable;
}(Disposable));
export { Themable };

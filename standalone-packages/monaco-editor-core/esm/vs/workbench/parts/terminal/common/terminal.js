/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
export var TERMINAL_PANEL_ID = 'workbench.panel.terminal';
export var TERMINAL_SERVICE_ID = 'terminalService';
/** A context key that is set when there is at least one opened integrated terminal. */
export var KEYBINDING_CONTEXT_TERMINAL_IS_OPEN = new RawContextKey('terminalIsOpen', false);
/** A context key that is set when the integrated terminal has focus. */
export var KEYBINDING_CONTEXT_TERMINAL_FOCUS = new RawContextKey('terminalFocus', undefined);
/** A context key that is set when the integrated terminal does not have focus. */
export var KEYBINDING_CONTEXT_TERMINAL_NOT_FOCUSED = KEYBINDING_CONTEXT_TERMINAL_FOCUS.toNegated();
/** A keybinding context key that is set when the integrated terminal has text selected. */
export var KEYBINDING_CONTEXT_TERMINAL_TEXT_SELECTED = new RawContextKey('terminalTextSelected', undefined);
/** A keybinding context key that is set when the integrated terminal does not have text selected. */
export var KEYBINDING_CONTEXT_TERMINAL_TEXT_NOT_SELECTED = KEYBINDING_CONTEXT_TERMINAL_TEXT_SELECTED.toNegated();
/**  A context key that is set when the find widget in integrated terminal is visible. */
export var KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_VISIBLE = new RawContextKey('terminalFindWidgetVisible', undefined);
/**  A context key that is set when the find widget in integrated terminal is not visible. */
export var KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_NOT_VISIBLE = KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_VISIBLE.toNegated();
/**  A context key that is set when the find widget find input in integrated terminal is focused. */
export var KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_INPUT_FOCUSED = new RawContextKey('terminalFindWidgetInputFocused', false);
/**  A context key that is set when the find widget in integrated terminal is focused. */
export var KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_FOCUSED = new RawContextKey('terminalFindWidgetFocused', false);
/**  A context key that is set when the find widget find input in integrated terminal is not focused. */
export var KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_INPUT_NOT_FOCUSED = KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_INPUT_FOCUSED.toNegated();
export var IS_WORKSPACE_SHELL_ALLOWED_STORAGE_KEY = 'terminal.integrated.isWorkspaceShellAllowed';
export var NEVER_SUGGEST_SELECT_WINDOWS_SHELL_STORAGE_KEY = 'terminal.integrated.neverSuggestSelectWindowsShell';
export var NEVER_MEASURE_RENDER_TIME_STORAGE_KEY = 'terminal.integrated.neverMeasureRenderTime';
// The creation of extension host terminals is delayed by this value (milliseconds). The purpose of
// this delay is to allow the terminal instance to initialize correctly and have its ID set before
// trying to create the corressponding object on the ext host.
export var EXT_HOST_CREATION_DELAY = 100;
export var ITerminalService = createDecorator(TERMINAL_SERVICE_ID);
export var TerminalCursorStyle = {
    BLOCK: 'block',
    LINE: 'line',
    UNDERLINE: 'underline'
};
export var TERMINAL_CONFIG_SECTION = 'terminal.integrated';
export var DEFAULT_LETTER_SPACING = 0;
export var MINIMUM_LETTER_SPACING = -5;
export var DEFAULT_LINE_HEIGHT = 1.0;

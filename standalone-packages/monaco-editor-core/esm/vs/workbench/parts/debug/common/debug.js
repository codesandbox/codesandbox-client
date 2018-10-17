/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey';
import { Extensions as ViewContainerExtensions } from '../../../common/views';
import { Registry } from '../../../../platform/registry/common/platform';
export var VIEWLET_ID = 'workbench.view.debug';
export var VIEW_CONTAINER = Registry.as(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer(VIEWLET_ID);
export var VARIABLES_VIEW_ID = 'workbench.debug.variablesView';
export var WATCH_VIEW_ID = 'workbench.debug.watchExpressionsView';
export var CALLSTACK_VIEW_ID = 'workbench.debug.callStackView';
export var LOADED_SCRIPTS_VIEW_ID = 'workbench.debug.loadedScriptsView';
export var BREAKPOINTS_VIEW_ID = 'workbench.debug.breakPointsView';
export var REPL_ID = 'workbench.panel.repl';
export var DEBUG_SERVICE_ID = 'debugService';
export var CONTEXT_DEBUG_TYPE = new RawContextKey('debugType', undefined);
export var CONTEXT_DEBUG_STATE = new RawContextKey('debugState', 'inactive');
export var CONTEXT_IN_DEBUG_MODE = new RawContextKey('inDebugMode', false);
export var CONTEXT_NOT_IN_DEBUG_MODE = CONTEXT_IN_DEBUG_MODE.toNegated();
export var CONTEXT_IN_DEBUG_REPL = new RawContextKey('inDebugRepl', false);
export var CONTEXT_BREAKPOINT_WIDGET_VISIBLE = new RawContextKey('breakpointWidgetVisible', false);
export var CONTEXT_IN_BREAKPOINT_WIDGET = new RawContextKey('inBreakpointWidget', false);
export var CONTEXT_BREAKPOINTS_FOCUSED = new RawContextKey('breakpointsFocused', true);
export var CONTEXT_WATCH_EXPRESSIONS_FOCUSED = new RawContextKey('watchExpressionsFocused', true);
export var CONTEXT_VARIABLES_FOCUSED = new RawContextKey('variablesFocused', true);
export var CONTEXT_EXPRESSION_SELECTED = new RawContextKey('expressionSelected', false);
export var CONTEXT_BREAKPOINT_SELECTED = new RawContextKey('breakpointSelected', false);
export var CONTEXT_CALLSTACK_ITEM_TYPE = new RawContextKey('callStackItemType', undefined);
export var CONTEXT_LOADED_SCRIPTS_SUPPORTED = new RawContextKey('loadedScriptsSupported', false);
export var CONTEXT_LOADED_SCRIPTS_ITEM_TYPE = new RawContextKey('loadedScriptsItemType', undefined);
export var EDITOR_CONTRIBUTION_ID = 'editor.contrib.debug';
export var DEBUG_SCHEME = 'debug';
export var INTERNAL_CONSOLE_OPTIONS_SCHEMA = {
    enum: ['neverOpen', 'openOnSessionStart', 'openOnFirstSessionStart'],
    default: 'openOnFirstSessionStart',
    description: nls.localize('internalConsoleOptions', "Controls when the internal debug console should open.")
};
export var State;
(function (State) {
    State[State["Inactive"] = 0] = "Inactive";
    State[State["Initializing"] = 1] = "Initializing";
    State[State["Stopped"] = 2] = "Stopped";
    State[State["Running"] = 3] = "Running";
})(State || (State = {}));
var AdapterEndEvent = /** @class */ (function () {
    function AdapterEndEvent() {
    }
    return AdapterEndEvent;
}());
export { AdapterEndEvent };
// Debug service interfaces
export var IDebugService = createDecorator(DEBUG_SERVICE_ID);

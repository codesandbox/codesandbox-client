/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { URI } from '../../../../base/common/uri';
import { ExplorerItem, OpenEditor } from '../common/explorerModel';
import { toResource } from '../../../common/editor';
import { Tree } from '../../../../base/parts/tree/browser/treeImpl';
import { List } from '../../../../base/browser/ui/list/listWidget';
// Commands can get exeucted from a command pallete, from a context menu or from some list using a keybinding
// To cover all these cases we need to properly compute the resource on which the command is being executed
export function getResourceForCommand(resource, listService, editorService) {
    if (URI.isUri(resource)) {
        return resource;
    }
    var list = listService.lastFocusedList;
    if (list && list.isDOMFocused()) {
        var focus_1;
        if (list instanceof List) {
            var focused = list.getFocusedElements();
            if (focused.length) {
                focus_1 = focused[0];
            }
        }
        else {
            focus_1 = list.getFocus();
        }
        if (focus_1 instanceof ExplorerItem) {
            return focus_1.resource;
        }
        else if (focus_1 instanceof OpenEditor) {
            return focus_1.getResource();
        }
    }
    return toResource(editorService.activeEditor, { supportSideBySide: true });
}
export function getMultiSelectedResources(resource, listService, editorService) {
    var list = listService.lastFocusedList;
    if (list && list.isDOMFocused()) {
        // Explorer
        if (list instanceof Tree) {
            var selection = list.getSelection().map(function (fs) { return fs.resource; });
            var focus_2 = list.getFocus();
            var mainUriStr_1 = URI.isUri(resource) ? resource.toString() : focus_2 instanceof ExplorerItem ? focus_2.resource.toString() : undefined;
            // If the resource is passed it has to be a part of the returned context.
            // We only respect the selection if it contains the focused element.
            if (selection.some(function (s) { return URI.isUri(s) && s.toString() === mainUriStr_1; })) {
                return selection;
            }
        }
        // Open editors view
        if (list instanceof List) {
            var selection = list.getSelectedElements().filter(function (s) { return s instanceof OpenEditor; }).map(function (oe) { return oe.getResource(); });
            var focusedElements = list.getFocusedElements();
            var focus_3 = focusedElements.length ? focusedElements[0] : undefined;
            var mainUriStr_2 = URI.isUri(resource) ? resource.toString() : (focus_3 instanceof OpenEditor) ? focus_3.getResource().toString() : undefined;
            // We only respect the selection if it contains the main element.
            if (selection.some(function (s) { return s.toString() === mainUriStr_2; })) {
                return selection;
            }
        }
    }
    var result = getResourceForCommand(resource, listService, editorService);
    return !!result ? [result] : [];
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { ACTIVE_GROUP, SIDE_GROUP } from '../../services/editor/common/editorService.js';
export function viewColumnToEditorGroup(editorGroupService, position) {
    if (typeof position !== 'number' || position === ACTIVE_GROUP) {
        return ACTIVE_GROUP; // prefer active group when position is undefined or passed in as such
    }
    var groups = editorGroupService.getGroups(2 /* GRID_APPEARANCE */);
    var candidate = groups[position];
    if (candidate) {
        return candidate.id; // found direct match
    }
    var firstGroup = groups[0];
    if (groups.length === 1 && firstGroup.count === 0) {
        return firstGroup.id; // first editor should always open in first group independent from position provided
    }
    return SIDE_GROUP; // open to the side if group not found or we are instructed to
}
export function editorGroupToViewColumn(editorGroupService, editorGroup) {
    var group = (typeof editorGroup === 'number') ? editorGroupService.getGroup(editorGroup) : editorGroup;
    return editorGroupService.getGroups(2 /* GRID_APPEARANCE */).indexOf(group);
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export function collapseAll(tree, except) {
    var nav = tree.getNavigator();
    var cur;
    while (cur = nav.next()) {
        if (!except || !isEqualOrParent(tree, except, cur)) {
            tree.collapse(cur);
        }
    }
}
export function isEqualOrParent(tree, element, candidateParent) {
    var nav = tree.getNavigator(element);
    do {
        if (element === candidateParent) {
            return true;
        }
    } while (element = nav.parent());
    return false;
}
export function expandAll(tree) {
    var nav = tree.getNavigator();
    var cur;
    while (cur = nav.next()) {
        tree.expand(cur);
    }
}

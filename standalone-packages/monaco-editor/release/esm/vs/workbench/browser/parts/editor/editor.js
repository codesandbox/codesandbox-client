/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { EditorOptions, TextEditorOptions } from '../../../common/editor.js';
import { Dimension } from '../../../../base/browser/dom.js';
import { assign } from '../../../../base/common/objects.js';
import { getCodeEditor } from '../../../../editor/browser/editorBrowser.js';
export var EDITOR_TITLE_HEIGHT = 35;
export var DEFAULT_EDITOR_MIN_DIMENSIONS = new Dimension(220, 70);
export var DEFAULT_EDITOR_MAX_DIMENSIONS = new Dimension(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
export var DEFAULT_EDITOR_PART_OPTIONS = {
    showTabs: true,
    tabCloseButton: 'right',
    tabSizing: 'fit',
    showIcons: true,
    enablePreview: true,
    openPositioning: 'right',
    openSideBySideDirection: 'right',
    closeEmptyGroups: true,
    labelFormat: 'default',
    iconTheme: 'vs-seti'
};
export function impactsEditorPartOptions(event) {
    return event.affectsConfiguration('workbench.editor') || event.affectsConfiguration('workbench.iconTheme');
}
export function getEditorPartOptions(config) {
    var options = assign(Object.create(null), DEFAULT_EDITOR_PART_OPTIONS);
    if (!config || !config.workbench) {
        return options;
    }
    if (typeof config.workbench.iconTheme === 'string') {
        options.iconTheme = config.workbench.iconTheme;
    }
    if (config.workbench.editor) {
        assign(options, config.workbench.editor);
    }
    return options;
}
export function getActiveTextEditorOptions(group, expectedActiveEditor, presetOptions) {
    var activeGroupCodeEditor = group.activeControl ? getCodeEditor(group.activeControl.getControl()) : void 0;
    if (activeGroupCodeEditor) {
        if (!expectedActiveEditor || expectedActiveEditor.matches(group.activeEditor)) {
            return TextEditorOptions.fromEditor(activeGroupCodeEditor, presetOptions);
        }
    }
    return presetOptions || new EditorOptions();
}

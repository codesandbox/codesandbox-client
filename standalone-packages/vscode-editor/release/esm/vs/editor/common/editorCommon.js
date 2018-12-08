/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * @internal
 */
export function isThemeColor(o) {
    return o && typeof o.id === 'string';
}
/**
 * The type of the `IEditor`.
 */
export var EditorType = {
    ICodeEditor: 'vs.editor.ICodeEditor',
    IDiffEditor: 'vs.editor.IDiffEditor'
};
/**
 * Built-in commands.
 * @internal
 */
export var Handler = {
    ExecuteCommand: 'executeCommand',
    ExecuteCommands: 'executeCommands',
    Type: 'type',
    ReplacePreviousChar: 'replacePreviousChar',
    CompositionStart: 'compositionStart',
    CompositionEnd: 'compositionEnd',
    Paste: 'paste',
    Cut: 'cut',
    Undo: 'undo',
    Redo: 'redo',
};

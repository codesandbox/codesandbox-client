/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { RawContextKey } from '../../platform/contextkey/common/contextkey.js';
export var EditorContextKeys;
(function (EditorContextKeys) {
    /**
     * A context key that is set when the editor's text has focus (cursor is blinking).
     */
    EditorContextKeys.editorTextFocus = new RawContextKey('editorTextFocus', false);
    /**
     * A context key that is set when the editor's text or an editor's widget has focus.
     */
    EditorContextKeys.focus = new RawContextKey('editorFocus', false);
    /**
     * A context key that is set when any editor input has focus (regular editor, repl input...).
     */
    EditorContextKeys.textInputFocus = new RawContextKey('textInputFocus', false);
    EditorContextKeys.readOnly = new RawContextKey('editorReadonly', false);
    EditorContextKeys.writable = EditorContextKeys.readOnly.toNegated();
    EditorContextKeys.hasNonEmptySelection = new RawContextKey('editorHasSelection', false);
    EditorContextKeys.hasOnlyEmptySelection = EditorContextKeys.hasNonEmptySelection.toNegated();
    EditorContextKeys.hasMultipleSelections = new RawContextKey('editorHasMultipleSelections', false);
    EditorContextKeys.hasSingleSelection = EditorContextKeys.hasMultipleSelections.toNegated();
    EditorContextKeys.tabMovesFocus = new RawContextKey('editorTabMovesFocus', false);
    EditorContextKeys.tabDoesNotMoveFocus = EditorContextKeys.tabMovesFocus.toNegated();
    EditorContextKeys.isInEmbeddedEditor = new RawContextKey('isInEmbeddedEditor', undefined);
    // -- mode context keys
    EditorContextKeys.languageId = new RawContextKey('editorLangId', undefined);
    EditorContextKeys.hasCompletionItemProvider = new RawContextKey('editorHasCompletionItemProvider', undefined);
    EditorContextKeys.hasCodeActionsProvider = new RawContextKey('editorHasCodeActionsProvider', undefined);
    EditorContextKeys.hasCodeLensProvider = new RawContextKey('editorHasCodeLensProvider', undefined);
    EditorContextKeys.hasDefinitionProvider = new RawContextKey('editorHasDefinitionProvider', undefined);
    EditorContextKeys.hasImplementationProvider = new RawContextKey('editorHasImplementationProvider', undefined);
    EditorContextKeys.hasTypeDefinitionProvider = new RawContextKey('editorHasTypeDefinitionProvider', undefined);
    EditorContextKeys.hasHoverProvider = new RawContextKey('editorHasHoverProvider', undefined);
    EditorContextKeys.hasDocumentHighlightProvider = new RawContextKey('editorHasDocumentHighlightProvider', undefined);
    EditorContextKeys.hasDocumentSymbolProvider = new RawContextKey('editorHasDocumentSymbolProvider', undefined);
    EditorContextKeys.hasReferenceProvider = new RawContextKey('editorHasReferenceProvider', undefined);
    EditorContextKeys.hasRenameProvider = new RawContextKey('editorHasRenameProvider', undefined);
    EditorContextKeys.hasDocumentFormattingProvider = new RawContextKey('editorHasDocumentFormattingProvider', undefined);
    EditorContextKeys.hasDocumentSelectionFormattingProvider = new RawContextKey('editorHasDocumentSelectionFormattingProvider', undefined);
    EditorContextKeys.hasSignatureHelpProvider = new RawContextKey('editorHasSignatureHelpProvider', undefined);
})(EditorContextKeys || (EditorContextKeys = {}));

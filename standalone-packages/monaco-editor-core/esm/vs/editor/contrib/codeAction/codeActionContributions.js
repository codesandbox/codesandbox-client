/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { registerEditorAction, registerEditorCommand, registerEditorContribution } from '../../browser/editorExtensions';
import { SourceAction, QuickFixController, QuickFixAction, CodeActionCommand, RefactorAction, OrganizeImportsAction } from './codeActionCommands';
registerEditorContribution(QuickFixController);
registerEditorAction(QuickFixAction);
registerEditorAction(RefactorAction);
registerEditorAction(SourceAction);
registerEditorAction(OrganizeImportsAction);
registerEditorCommand(new CodeActionCommand());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Range, TextEdit } from '../vscode-languageserver-types/main.js';
import { Parser } from './parser/cssParser.js';
import { CSSCompletion } from './services/cssCompletion.js';
import { CSSHover } from './services/cssHover.js';
import { CSSNavigation } from './services/cssNavigation.js';
import { CSSCodeActions } from './services/cssCodeActions.js';
import { CSSValidation } from './services/cssValidation.js';
import { SCSSParser } from './parser/scssParser.js';
import { SCSSCompletion } from './services/scssCompletion.js';
import { LESSParser } from './parser/lessParser.js';
import { LESSCompletion } from './services/lessCompletion.js';
export { TextEdit, Range };
function createFacade(parser, completion, hover, navigation, codeActions, validation) {
    return {
        configure: validation.configure.bind(validation),
        doValidation: validation.doValidation.bind(validation),
        parseStylesheet: parser.parseStylesheet.bind(parser),
        doComplete: completion.doComplete.bind(completion),
        setCompletionParticipants: completion.setCompletionParticipants.bind(completion),
        doHover: hover.doHover.bind(hover),
        findDefinition: navigation.findDefinition.bind(navigation),
        findReferences: navigation.findReferences.bind(navigation),
        findDocumentHighlights: navigation.findDocumentHighlights.bind(navigation),
        findDocumentSymbols: navigation.findDocumentSymbols.bind(navigation),
        doCodeActions: codeActions.doCodeActions.bind(codeActions),
        findColorSymbols: function (d, s) { return navigation.findDocumentColors(d, s).map(function (s) { return s.range; }); },
        findDocumentColors: navigation.findDocumentColors.bind(navigation),
        getColorPresentations: navigation.getColorPresentations.bind(navigation),
        doRename: navigation.doRename.bind(navigation),
    };
}
export function getCSSLanguageService() {
    return createFacade(new Parser(), new CSSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
export function getSCSSLanguageService() {
    return createFacade(new SCSSParser(), new SCSSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
export function getLESSLanguageService() {
    return createFacade(new LESSParser(), new LESSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
//# sourceMappingURL=cssLanguageService.js.map
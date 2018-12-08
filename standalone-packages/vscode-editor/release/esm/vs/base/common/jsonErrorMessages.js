/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Extracted from json.ts to keep json nls free.
 */
import { localize } from '../../nls.js';
export function getParseErrorMessage(errorCode) {
    switch (errorCode) {
        case 1 /* InvalidSymbol */: return localize('error.invalidSymbol', 'Invalid symbol');
        case 2 /* InvalidNumberFormat */: return localize('error.invalidNumberFormat', 'Invalid number format');
        case 3 /* PropertyNameExpected */: return localize('error.propertyNameExpected', 'Property name expected');
        case 4 /* ValueExpected */: return localize('error.valueExpected', 'Value expected');
        case 5 /* ColonExpected */: return localize('error.colonExpected', 'Colon expected');
        case 6 /* CommaExpected */: return localize('error.commaExpected', 'Comma expected');
        case 7 /* CloseBraceExpected */: return localize('error.closeBraceExpected', 'Closing brace expected');
        case 8 /* CloseBracketExpected */: return localize('error.closeBracketExpected', 'Closing bracket expected');
        case 9 /* EndOfFileExpected */: return localize('error.endOfFileExpected', 'End of file expected');
        default:
            return '';
    }
}

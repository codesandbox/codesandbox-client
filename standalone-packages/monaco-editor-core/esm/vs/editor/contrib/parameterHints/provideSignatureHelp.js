/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { first2 } from '../../../base/common/async';
import { onUnexpectedExternalError } from '../../../base/common/errors';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions';
import { SignatureHelpProviderRegistry } from '../../common/modes';
import { RawContextKey } from '../../../platform/contextkey/common/contextkey';
import { CancellationToken } from '../../../base/common/cancellation';
export var Context = {
    Visible: new RawContextKey('parameterHintsVisible', false),
    MultipleSignatures: new RawContextKey('parameterHintsMultipleSignatures', false),
};
export function provideSignatureHelp(model, position, token) {
    if (token === void 0) { token = CancellationToken.None; }
    var supports = SignatureHelpProviderRegistry.ordered(model);
    return first2(supports.map(function (support) { return function () {
        return Promise.resolve(support.provideSignatureHelp(model, position, token)).catch(onUnexpectedExternalError);
    }; }));
}
registerDefaultLanguageCommand('_executeSignatureHelpProvider', provideSignatureHelp);

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { first } from '../../../base/common/async';
import { onUnexpectedExternalError } from '../../../base/common/errors';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions';
import * as modes from '../../common/modes';
import { RawContextKey } from '../../../platform/contextkey/common/contextkey';
import { CancellationToken } from '../../../base/common/cancellation';
export var Context = {
    Visible: new RawContextKey('parameterHintsVisible', false),
    MultipleSignatures: new RawContextKey('parameterHintsMultipleSignatures', false),
};
export function provideSignatureHelp(model, position, context, token) {
    var supports = modes.SignatureHelpProviderRegistry.ordered(model);
    return first(supports.map(function (support) { return function () {
        return Promise.resolve(support.provideSignatureHelp(model, position, token, context)).catch(onUnexpectedExternalError);
    }; }));
}
registerDefaultLanguageCommand('_executeSignatureHelpProvider', function (model, position) {
    return provideSignatureHelp(model, position, { triggerReason: modes.SignatureHelpTriggerReason.Invoke }, CancellationToken.None);
});

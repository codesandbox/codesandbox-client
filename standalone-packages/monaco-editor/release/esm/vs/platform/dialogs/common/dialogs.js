/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { basename } from '../../../base/common/paths.js';
import { localize } from '../../../nls.js';
export var IDialogService = createDecorator('dialogService');
var MAX_CONFIRM_FILES = 10;
export function getConfirmMessage(start, resourcesToConfirm) {
    var message = [start];
    message.push('');
    message.push.apply(message, resourcesToConfirm.slice(0, MAX_CONFIRM_FILES).map(function (r) { return basename(r.fsPath); }));
    if (resourcesToConfirm.length > MAX_CONFIRM_FILES) {
        if (resourcesToConfirm.length - MAX_CONFIRM_FILES === 1) {
            message.push(localize('moreFile', "...1 additional file not shown"));
        }
        else {
            message.push(localize('moreFiles', "...{0} additional files not shown", resourcesToConfirm.length - MAX_CONFIRM_FILES));
        }
    }
    message.push('');
    return message.join('\n');
}

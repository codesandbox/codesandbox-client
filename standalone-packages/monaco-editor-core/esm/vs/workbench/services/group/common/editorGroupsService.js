/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
export var IEditorGroupsService = createDecorator('editorGroupsService');
export function preferredSideBySideGroupDirection(configurationService) {
    var openSideBySideDirection = configurationService.getValue('workbench.editor.openSideBySideDirection');
    if (openSideBySideDirection === 'down') {
        return 1 /* DOWN */;
    }
    return 3 /* RIGHT */;
}

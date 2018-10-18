/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
export function PositionToString(position) {
    switch (position) {
        case 0 /* LEFT */: return 'LEFT';
        case 1 /* RIGHT */: return 'RIGHT';
        case 2 /* BOTTOM */: return 'BOTTOM';
    }
}
export var IPartService = createDecorator('partService');

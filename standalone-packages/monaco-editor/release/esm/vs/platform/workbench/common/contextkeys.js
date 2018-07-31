/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { RawContextKey } from '../../contextkey/common/contextkey.js';
export var InputFocusedContextKey = 'inputFocus';
export var InputFocusedContext = new RawContextKey(InputFocusedContextKey, false);

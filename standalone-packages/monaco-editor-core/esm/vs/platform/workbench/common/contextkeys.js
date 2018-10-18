/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { RawContextKey } from '../../contextkey/common/contextkey';
import { isMacintosh, isLinux, isWindows } from '../../../base/common/platform';
export var InputFocusedContextKey = 'inputFocus';
export var InputFocusedContext = new RawContextKey(InputFocusedContextKey, false);
export var IsMacContext = new RawContextKey('isMac', isMacintosh);
export var IsLinuxContext = new RawContextKey('isLinux', isLinux);
export var IsWindowsContext = new RawContextKey('isWindows', isWindows);

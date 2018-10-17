/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
export var IBackupFileService = createDecorator('backupFileService');
export var BACKUP_FILE_RESOLVE_OPTIONS = { acceptTextOnly: true, encoding: 'utf8' };
export var BACKUP_FILE_UPDATE_OPTIONS = { encoding: 'utf8' };

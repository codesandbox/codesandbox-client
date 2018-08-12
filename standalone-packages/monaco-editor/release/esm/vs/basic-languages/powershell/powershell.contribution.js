/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { registerLanguage } from '../_.contribution.js';
// Allow for running under nodejs/requirejs in tests
var _monaco = (typeof monaco === 'undefined' ? self.monaco : monaco);
registerLanguage({
    id: 'powershell',
    extensions: ['.ps1', '.psm1', '.psd1'],
    aliases: ['PowerShell', 'powershell', 'ps', 'ps1'],
    loader: function () { return _monaco.Promise.wrap(import('./powershell.js')); }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { getHTML5TagProvider, getAngularTagProvider, getIonicTagProvider } from '../parser/htmlTags.js';
import { getRazorTagProvider } from '../parser/razorTags.js';
export var allTagProviders = [
    getHTML5TagProvider(),
    getAngularTagProvider(),
    getIonicTagProvider(),
    getRazorTagProvider()
];
//# sourceMappingURL=tagProviders.js.map
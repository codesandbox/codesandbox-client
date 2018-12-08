/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from './uri.js';
export function getPathFromAmdModule(requirefn, relativePath) {
    return URI.parse(requirefn.toUrl(relativePath)).fsPath;
}

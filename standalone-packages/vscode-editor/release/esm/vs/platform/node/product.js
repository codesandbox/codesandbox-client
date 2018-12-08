/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from '../../../path.js';
import { getPathFromAmdModule } from '../../base/common/amd.js';
var rootPath = path.dirname(getPathFromAmdModule(require, ''));
var productJsonPath = path.join(rootPath, 'product.json');
var product = require.__$__nodeRequire(productJsonPath);
if (process.env['VSCODE_DEV']) {
    product.nameShort += ' Dev';
    product.nameLong += ' Dev';
    product.dataFolderName += '-dev';
}
export default product;

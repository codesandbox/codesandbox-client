/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from '../../../path.js';
import { getPathFromAmdModule } from '../../base/common/amd.js';
var rootPath = path.dirname(getPathFromAmdModule(require, ''));
var packageJsonPath = path.join(rootPath, 'package.json');
export default require.__$__nodeRequire(packageJsonPath);

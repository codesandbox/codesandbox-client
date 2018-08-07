/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { TypeScriptWorker } from './tsWorker';
self.onmessage = function () {
    // ignore the first message
    worker.initialize(function (ctx, createData) {
        return new TypeScriptWorker(ctx, createData);
    });
};

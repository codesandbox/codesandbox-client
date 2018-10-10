define(["require", "exports", "monaco-editor-core/esm/vs/editor/editor.worker", "./tsWorker"], function (require, exports, worker, tsWorker_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    self.onmessage = function () {
        // ignore the first message
        worker.initialize(function (ctx, createData) {
            return new tsWorker_1.TypeScriptWorker(ctx, createData);
        });
    };
});

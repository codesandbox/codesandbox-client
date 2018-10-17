/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { EditorSimpleWorkerImpl } from './common/services/editorSimpleWorker.js';
import { SimpleWorkerServer } from '../base/common/worker/simpleWorker.js';
var initialized = false;
export function initialize(foreignModule) {
    if (initialized) {
        return;
    }
    initialized = true;
    var editorWorker = new EditorSimpleWorkerImpl(foreignModule);
    var simpleWorker = new SimpleWorkerServer(function (msg) {
        self.postMessage(msg);
    }, editorWorker);
    self.onmessage = function (e) {
        simpleWorker.onmessage(e.data);
    };
}
self.onmessage = function (e) {
    // Ignore first message in this case and initialize if not yet initialized
    if (!initialized) {
        initialize(null);
    }
};

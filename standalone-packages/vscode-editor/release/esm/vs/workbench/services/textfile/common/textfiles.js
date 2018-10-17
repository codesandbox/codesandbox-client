/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
var TextFileModelChangeEvent = /** @class */ (function () {
    function TextFileModelChangeEvent(model, kind) {
        this._resource = model.getResource();
        this._kind = kind;
    }
    Object.defineProperty(TextFileModelChangeEvent.prototype, "resource", {
        get: function () {
            return this._resource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFileModelChangeEvent.prototype, "kind", {
        get: function () {
            return this._kind;
        },
        enumerable: true,
        configurable: true
    });
    return TextFileModelChangeEvent;
}());
export { TextFileModelChangeEvent };
export var TEXT_FILE_SERVICE_ID = 'textFileService';
export var AutoSaveContext = new RawContextKey('config.files.autoSave', undefined);
export var ITextFileService = createDecorator(TEXT_FILE_SERVICE_ID);

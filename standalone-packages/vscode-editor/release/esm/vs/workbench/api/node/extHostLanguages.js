/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MainContext } from './extHost.protocol.js';
var ExtHostLanguages = /** @class */ (function () {
    function ExtHostLanguages(mainContext, documents) {
        this._proxy = mainContext.getProxy(MainContext.MainThreadLanguages);
        this._documents = documents;
    }
    ExtHostLanguages.prototype.getLanguages = function () {
        return this._proxy.$getLanguages();
    };
    ExtHostLanguages.prototype.changeLanguage = function (uri, languageId) {
        var _this = this;
        return this._proxy.$changeLanguage(uri, languageId).then(function () {
            return _this._documents.getDocumentData(uri).document;
        });
    };
    return ExtHostLanguages;
}());
export { ExtHostLanguages };

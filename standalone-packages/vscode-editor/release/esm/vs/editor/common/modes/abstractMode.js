/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var FrankensteinMode = /** @class */ (function () {
    function FrankensteinMode(languageIdentifier) {
        this._languageIdentifier = languageIdentifier;
    }
    FrankensteinMode.prototype.getId = function () {
        return this._languageIdentifier.language;
    };
    FrankensteinMode.prototype.getLanguageIdentifier = function () {
        return this._languageIdentifier;
    };
    return FrankensteinMode;
}());
export { FrankensteinMode };

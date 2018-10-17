/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var CachedKeyboardMapper = /** @class */ (function () {
    function CachedKeyboardMapper(actual) {
        this._actual = actual;
        this._cache = new Map();
    }
    CachedKeyboardMapper.prototype.dumpDebugInfo = function () {
        return this._actual.dumpDebugInfo();
    };
    CachedKeyboardMapper.prototype.resolveKeybinding = function (keybinding) {
        var hashCode = keybinding.getHashCode();
        if (!this._cache.has(hashCode)) {
            var r = this._actual.resolveKeybinding(keybinding);
            this._cache.set(hashCode, r);
            return r;
        }
        return this._cache.get(hashCode);
    };
    CachedKeyboardMapper.prototype.resolveKeyboardEvent = function (keyboardEvent) {
        return this._actual.resolveKeyboardEvent(keyboardEvent);
    };
    CachedKeyboardMapper.prototype.resolveUserBinding = function (firstPart, chordPart) {
        return this._actual.resolveUserBinding(firstPart, chordPart);
    };
    return CachedKeyboardMapper;
}());
export { CachedKeyboardMapper };

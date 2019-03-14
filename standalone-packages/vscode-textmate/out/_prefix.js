/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
var $map = {};
function $load(name, factory) {
    var mod = {
        exports: {}
    };
    var requireFunc = function (mod) {
        if ($map[mod]) {
            return $map[mod].exports;
        }
        return require(mod);
    };
    factory.call(this, requireFunc, mod, mod.exports);
    $map[name] = mod;
}
//# sourceMappingURL=_prefix.js.map
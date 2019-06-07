"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfills/Object.values");
require("./polyfills/Object.entries");
require('util.promisify').shim();
__export(require("./polyfills/fetch"));
__export(require("./polyfills/url"));
//# sourceMappingURL=index.js.map
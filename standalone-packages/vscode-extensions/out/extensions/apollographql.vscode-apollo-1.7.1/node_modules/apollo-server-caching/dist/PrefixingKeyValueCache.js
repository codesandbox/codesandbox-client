"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrefixingKeyValueCache {
    constructor(wrapped, prefix) {
        this.wrapped = wrapped;
        this.prefix = prefix;
    }
    get(key) {
        return this.wrapped.get(this.prefix + key);
    }
    set(key, value, options) {
        return this.wrapped.set(this.prefix + key, value, options);
    }
    delete(key) {
        return this.wrapped.delete(this.prefix + key);
    }
}
exports.PrefixingKeyValueCache = PrefixingKeyValueCache;
//# sourceMappingURL=PrefixingKeyValueCache.js.map
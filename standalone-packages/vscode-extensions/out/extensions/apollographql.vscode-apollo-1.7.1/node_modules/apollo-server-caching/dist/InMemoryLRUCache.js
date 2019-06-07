"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("lru-cache"));
function defaultLengthCalculation(item) {
    if (Array.isArray(item) || typeof item === 'string') {
        return item.length;
    }
    return 1;
}
class InMemoryLRUCache {
    constructor({ maxSize = Infinity, sizeCalculator = defaultLengthCalculation, onDispose, } = {}) {
        this.store = new lru_cache_1.default({
            max: maxSize,
            length: sizeCalculator,
            dispose: onDispose,
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(key);
        });
    }
    set(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxAge = options && options.ttl && options.ttl * 1000;
            this.store.set(key, value, maxAge);
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.store.del(key);
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            this.store.reset();
        });
    }
    getTotalSize() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.length;
        });
    }
}
exports.InMemoryLRUCache = InMemoryLRUCache;
//# sourceMappingURL=InMemoryLRUCache.js.map
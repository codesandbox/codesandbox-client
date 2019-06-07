import { KeyValueCache } from './KeyValueCache';
export declare class PrefixingKeyValueCache<V = string> implements KeyValueCache<V> {
    private wrapped;
    private prefix;
    constructor(wrapped: KeyValueCache<V>, prefix: string);
    get(key: string): Promise<V | undefined>;
    set(key: string, value: V, options?: {
        ttl?: number;
    }): Promise<void>;
    delete(key: string): Promise<boolean | void>;
}
//# sourceMappingURL=PrefixingKeyValueCache.d.ts.map
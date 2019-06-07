import { TestableKeyValueCache } from './KeyValueCache';
export declare class InMemoryLRUCache<V = string> implements TestableKeyValueCache<V> {
    private store;
    constructor({ maxSize, sizeCalculator, onDispose, }?: {
        maxSize?: number;
        sizeCalculator?: (value: V, key: string) => number;
        onDispose?: (key: string, value: V) => void;
    });
    get(key: string): Promise<V | undefined>;
    set(key: string, value: V, options?: {
        ttl?: number;
    }): Promise<void>;
    delete(key: string): Promise<void>;
    flush(): Promise<void>;
    getTotalSize(): Promise<number>;
}
//# sourceMappingURL=InMemoryLRUCache.d.ts.map
import { KeyValueCache } from 'apollo-server-caching';
export interface DataSourceConfig<TContext> {
    context: TContext;
    cache: KeyValueCache;
}
export declare abstract class DataSource<TContext = any> {
    initialize?(config: DataSourceConfig<TContext>): void;
}
//# sourceMappingURL=index.d.ts.map
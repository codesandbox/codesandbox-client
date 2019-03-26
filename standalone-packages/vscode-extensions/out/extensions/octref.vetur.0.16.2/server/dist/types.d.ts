export interface DocumentContext {
    resolveReference(ref: string, base?: string): string;
}

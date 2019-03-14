export interface MatcherWithPriority<T> {
    matcher: Matcher<T>;
    priority: -1 | 0 | 1;
}
export interface Matcher<T> {
    (matcherInput: T): boolean;
}
export declare function createMatchers<T>(selector: string, matchesName: (names: string[], matcherInput: T) => boolean): MatcherWithPriority<T>[];

/// <reference lib="esnext.array" />
import "core-js/features/array/flat";
import "core-js/features/array/flat-map";
declare global {
    interface Array<T> {
        flat<U>(this: ReadonlyArray<U>[], depth?: 1): U[];
    }
}
//# sourceMappingURL=array.d.ts.map
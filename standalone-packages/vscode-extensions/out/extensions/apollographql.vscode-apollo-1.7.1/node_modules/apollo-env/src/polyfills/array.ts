/// <reference lib="esnext.array" />
import "core-js/features/array/flat";
import "core-js/features/array/flat-map";

// The built-in Array.flat typings don't contain an overload for ReadonlyArray<U>[],
// which means the return type is inferred to be any[] instead of U[], hence this augmentation.
declare global {
  interface Array<T> {
    /**
     * Returns a new array with all sub-array elements concatenated into it recursively up to the
     * specified depth.
     *
     * @param depth The maximum recursion depth
     */
    flat<U>(this: ReadonlyArray<U>[], depth?: 1): U[];
  }
}

import "core-js/features/object/from-entries";

declare global {
  interface ObjectConstructor {
    fromEntries<K extends string, V>(map: [K, V][]): Record<K, V>;
  }
}

declare module 'ot' {
  export type SerializedTextOperation = (string | number)[];

  class TextOperation {
    ops: SerializedTextOperation;

    delete(length: number): TextOperation;
    insert(str: string): TextOperation;
    retain(length: number): TextOperation;

    baseLength: number;
    targetLength: number;

    apply(code: string): string;
    compose(operation: TextOperation): TextOperation;

    static transform(left: TextOperation, right: TextOperation): TextOperation;
    static isRetain(operation: string | number): boolean;
    static isInsert(operation: string | number): boolean;
    static isDelete(operation: string | number): boolean;

    static fromJSON(operation: SerializedTextOperation): TextOperation;
    toJSON(): SerializedTextOperation;
  }

  interface Range {
    new (anchor: number, head: number): Range;
    transform(operation: TextOperation): Range;
    anchor: number;
    head: number;
  }

  class Selection {
    static Range: Range;
  }

  export { TextOperation, Selection };
}

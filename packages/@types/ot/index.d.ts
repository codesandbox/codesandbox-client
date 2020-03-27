declare module 'ot' {
  export type SerializedTextOperation = (string | number)[];

  class TextOperation {
    delete(length: number): TextOperation;
    insert(str: string): TextOperation;
    retain(length: number): TextOperation;

    baseLength: number;
    targetLength: number;

    apply(code: string): string;
    compose(operation: TextOperation): TextOperation;

    static transform(left: TextOperation, right: TextOperation): TextOperation;
    static isRetain(operation: TextOperation): boolean;
    static isInsert(operation: TextOperation): boolean;
    static isDelete(operation: TextOperation): boolean;

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

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

  class Selection {
    static Range: {
      new (anchor: number, head: number);
      transform(operation: TextOperation): Range;
    };
  }

  export { TextOperation, Selection };
}

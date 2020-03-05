// eslint-disable-next-line
declare module 'ot' {
  export class Client {
    constructor(revision: number);
    revision: number;
    serverAck(): void;
    clientAck(): void;
    applyClient(operation: TextOperation): void;
    applyServer(operation: TextOperation): void;
    serverReconnect(): void;
  }
  export class TextOperation {
    static fromJSON(operation: object): TextOperation;
    static isDelete(operation: TextOperation): boolean;
    static isInsert(operation: TextOperation): boolean;
    static isRetain(operation: TextOperation): boolean;
    compose(operation: TextOperation): TextOperation;
    retain(amount: number): TextOperation;
    delete(amount: number): TextOperation;
    insert(text: string): TextOperation;
    targetLength: number;
    baseLength: number;
  }

  interface Range extends TextOperation {
    new (anchor: number, head: number);
    compose(operation: TextOperation): Range;
  }
  export class Selection {
    static Range: Range;
  }
}

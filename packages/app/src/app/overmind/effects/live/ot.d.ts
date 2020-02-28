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
    compose(operation: TextOperation): TextOperation;
  }
}

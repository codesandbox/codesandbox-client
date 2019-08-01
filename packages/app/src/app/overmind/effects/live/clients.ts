import { Client } from 'ot';

export type SendOperation = (
  moduleShortid: string,
  revision: string,
  operation: any
) => void;

export type ApplyOperation = (moduleShortid: string, operation: any) => void;

function operationToElixir(ot) {
  return ot.map(op => {
    if (typeof op === 'number') {
      if (op < 0) {
        return { d: -op };
      }

      return op;
    }

    return { i: op };
  });
}

class CodeSandboxOTClient extends Client {
  moduleShortid: string;
  onSendOperation: (revision: string, operation: any) => void;
  onApplyOperation: (operation: any) => void;
  serverReconnect: () => void;
  serverAck: () => void;
  applyClient: (operation: any) => void;
  applyServer: (operation: any) => void;
  constructor(
    revision: number,
    moduleShortid: string,
    onSendOperation: (revision: string, operation: any) => void,
    onApplyOperation: (operation: any) => void
  ) {
    super(revision);
    this.moduleShortid = moduleShortid;
    this.onSendOperation = onSendOperation;
    this.onApplyOperation = onApplyOperation;
  }

  sendOperation(revision, operation) {
    this.onSendOperation(revision, operation);
  }

  applyOperation(operation) {
    this.onApplyOperation(operation);
  }
}

export default (
  sendOperation: SendOperation,
  applyOperation: ApplyOperation
): {
  getAll(): CodeSandboxOTClient[];
  get(
    moduleShortid: string,
    revision?: number,
    force?: boolean
  ): CodeSandboxOTClient;
  create(moduleShortid: string, revision: number): CodeSandboxOTClient;
  clear(): void;
} => {
  const modules = new Map<string, CodeSandboxOTClient>();

  return {
    getAll() {
      return Array.from(modules.values());
    },
    get(moduleShortid, revision = 0, force = false) {
      let client = modules.get(moduleShortid);

      if (!client || force) {
        client = this.create(moduleShortid, revision);
      }

      return client;
    },
    create(moduleShortid, revision) {
      const client = new CodeSandboxOTClient(
        revision,
        moduleShortid,
        (revision, operation) => {
          sendOperation(
            moduleShortid,
            revision,
            operationToElixir(operation.toJSON())
          );
        },
        operation => {
          applyOperation(moduleShortid, operation.toJSON());
        }
      );
      modules.set(moduleShortid, client);

      return client;
    },
    clear() {
      modules.clear();
    },
  };
};

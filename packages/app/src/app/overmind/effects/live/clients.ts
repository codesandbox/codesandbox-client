import { Client, TextOperation } from 'ot';

export type SendOperation = (
  moduleShortid: string,
  revision: number,
  operation: any
) => Promise<unknown>;

export type ApplyOperation = (moduleShortid: string, operation: any) => void;

class CodeSandboxOTClient extends Client {
  moduleShortid: string;
  onSendOperation: (revision: number, operation: any) => Promise<unknown>;
  onApplyOperation: (operation: any) => void;
  saveOperation: TextOperation | null;

  constructor(
    revision: number,
    moduleShortid: string,
    onSendOperation: (revision: number, operation: any) => Promise<unknown>,
    onApplyOperation: (operation: any) => void
  ) {
    super(revision);
    this.moduleShortid = moduleShortid;
    this.onSendOperation = onSendOperation;
    this.onApplyOperation = onApplyOperation;
  }

  sendOperation(revision, operation) {
    this.onSendOperation(revision, operation).then(() => {
      this.serverAck();
    });
  }

  flush() {
    const saveOperation = this.saveOperation;

    this.saveOperation = null;

    return {
      revision: this.revision,
      operation: saveOperation,
    };
  }

  serverAck() {
    try {
      super.serverAck();
    } catch (e) {
      // Undo the revision increment again
      super.revision--;
      throw e;
    }
  }

  revertFlush(operation) {
    if (this.saveOperation) {
      this.saveOperation = operation.compose(this.saveOperation);
    } else {
      this.saveOperation = operation;
    }
  }

  applyOperation(operation) {
    this.onApplyOperation(operation);
  }

  applyClient(operation: any) {
    if (this.saveOperation) {
      this.saveOperation = this.saveOperation.compose(operation);
    } else {
      this.saveOperation = operation;
    }
    super.applyClient(operation);
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

      return client!;
    },
    create(moduleShortid, initialRevision) {
      const client = new CodeSandboxOTClient(
        initialRevision,
        moduleShortid,
        (revision, operation) =>
          sendOperation(moduleShortid, revision, operation),
        operation => {
          applyOperation(moduleShortid, operation);
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

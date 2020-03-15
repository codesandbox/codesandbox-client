import { Blocker, blocker } from 'app/utils/blocker';

import { OTClient, synchronized_ } from './ot/client';

export type SendOperation = (
  moduleShortid: string,
  revision: number,
  operation: any
) => Promise<unknown>;

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

class CodeSandboxOTClient extends OTClient {
  public pending: Blocker<void>;
  moduleShortid: string;
  onSendOperation: (revision: number, operation: any) => Promise<unknown>;
  onApplyOperation: (operation: any) => void;
  getConnectionsCount: () => number;
  disposeThrottler: () => void;
  throttledOperations: any;

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
    if (!this.pending) {
      this.pending = blocker();
    }

    this.onSendOperation(revision, operationToElixir(operation.toJSON())).then(
      () => {
        this.serverAck();
      }
    );
  }

  applyOperation(operation) {
    this.onApplyOperation(operation);
  }

  serverAck() {
    try {
      super.serverAck();

      if (this.state === synchronized_) {
        const pending = this.pending;
        this.pending = null;
        pending.resolve();
      }
    } catch (e) {
      // Undo the revision increment again
      super.revision--;
      throw e;
    }
  }

  applyClient(operation: any) {
    super.applyClient(operation);
  }

  applyServer(operation: any) {
    super.applyServer(operation);
  }

  serverReconnect() {
    super.serverReconnect();
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

import { logBreadcrumb } from '@codesandbox/common/lib/utils/analytics/sentry';
import { Blocker, blocker } from 'app/utils/blocker';

import { OTClient, synchronized_ } from './ot/client';

export type SendOperation = (
  moduleShortid: string,
  revision: number,
  operation: any
) => Promise<unknown>;

export type ApplyOperation = (moduleShortid: string, operation: any) => void;

class CodeSandboxOTClient extends OTClient {
  public awaitSynchronized: Blocker<void> | null;
  moduleShortid: string;
  onSendOperation: (revision: number, operation: any) => Promise<unknown>;
  onApplyOperation: (operation: any) => void;

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
    if (!this.awaitSynchronized) {
      this.awaitSynchronized = blocker();
    }

    this.onSendOperation(revision, operation)
      .then(() => {
        logBreadcrumb({
          type: 'ot',
          message: `Acknowledging ${JSON.stringify({
            moduleShortid: this.moduleShortid,
            revision,
            operation,
          })}`,
        });
        if (this.revision === revision) {
          this.serverAck();
        }
      })
      .catch(error => {
        if (this.awaitSynchronized) {
          this.awaitSynchronized.reject(error);
        }
      });
  }

  applyOperation(operation) {
    this.onApplyOperation(operation);
  }

  serverAck() {
    try {
      super.serverAck();

      if (this.state === synchronized_ && this.awaitSynchronized) {
        const awaitSynchronized = this.awaitSynchronized;
        this.awaitSynchronized = null;
        awaitSynchronized.resolve();
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
  reset(moduleShortid: string, revision: number): void;
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
    reset(moduleShortid, revision) {
      modules.delete(moduleShortid);
      this.create(moduleShortid, revision);
    },
    clear() {
      modules.clear();
    },
  };
};

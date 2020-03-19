import { logBreadcrumb } from '@codesandbox/common/lib/utils/analytics/sentry';
import { Blocker, blocker } from 'app/utils/blocker';
import { TextOperation } from 'ot';

import { OTClient, synchronized_ } from './ot/client';

export type SendOperation = (
  moduleShortid: string,
  revision: number,
  operation: TextOperation
) => Promise<unknown>;

export type ApplyOperation = (
  moduleShortid: string,
  operation: TextOperation
) => void;

export class CodeSandboxOTClient extends OTClient {
  /*
    We need to be able to wait for a client to go intro synchronized
    state. The reason is that we want to send a "save" event when the
    client is synchronized
  */
  public awaitSynchronized: Blocker<void> | null;
  moduleShortid: string;
  onSendOperation: (
    revision: number,
    operation: TextOperation
  ) => Promise<unknown>;

  onApplyOperation: (operation: TextOperation) => void;

  constructor(
    revision: number,
    moduleShortid: string,
    onSendOperation: (
      revision: number,
      operation: TextOperation
    ) => Promise<unknown>,
    onApplyOperation: (operation: TextOperation) => void
  ) {
    super(revision);
    this.moduleShortid = moduleShortid;
    this.onSendOperation = onSendOperation;
    this.onApplyOperation = onApplyOperation;
  }

  lastAcknowledgedRevision: number = -1;
  sendOperation(revision: number, operation: TextOperation) {
    // Whenever we send an operation we enable the blocker
    // that lets us wait for its resolvment when moving back
    // to synchronized state
    if (!this.awaitSynchronized) {
      this.awaitSynchronized = blocker();
    }

    return this.onSendOperation(revision, operation)
      .then(() => {
        logBreadcrumb({
          type: 'ot',
          message: `Acknowledging ${JSON.stringify({
            moduleShortid: this.moduleShortid,
            revision,
            operation,
          })}`,
        });

        // We make sure to not acknowledge the same revision twice
        if (this.lastAcknowledgedRevision < revision) {
          this.lastAcknowledgedRevision = revision;
          this.serverAck();
        }
      })
      .catch(error => {
        // If an operation errors on the server we will reject
        // the blocker, as an action might be waiting for it to resolve,
        // creating a user friendly error related to trying to save
        if (this.awaitSynchronized) {
          this.awaitSynchronized.reject(error);
        }

        throw error;
      });
  }

  applyOperation(operation: TextOperation) {
    this.onApplyOperation(operation);
  }

  serverAck() {
    try {
      super.serverAck();

      // If we are back in synchronized state we resolve the blocker
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

  applyClient(operation: TextOperation) {
    super.applyClient(operation);
  }

  applyServer(operation: TextOperation) {
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

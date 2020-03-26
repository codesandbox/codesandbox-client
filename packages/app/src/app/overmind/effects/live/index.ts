import {
  Directory,
  LiveMessageEvent,
  Module,
  RoomInfo,
  UserViewRange,
} from '@codesandbox/common/lib/types';
import {
  captureException,
  logBreadcrumb,
} from '@codesandbox/common/lib/utils/analytics/sentry';
import _debug from '@codesandbox/common/lib/utils/debug';
import { Blocker, blocker } from 'app/utils/blocker';
import { camelizeKeys } from 'humps';
import { SerializedTextOperation, TextOperation } from 'ot';
import { Channel, Presence, Socket } from 'phoenix';
import uuid from 'uuid';

import { OPTIMISTIC_ID_PREFIX } from '../utils';
import clientsFactory from './clients';

type Options = {
  onApplyOperation(args: {
    moduleShortid: string;
    operation: TextOperation;
  }): void;
  provideJwtToken(): string;
  isLiveBlockerExperiement(): boolean;
  onOperationError(payload: {
    moduleShortid: string;
    code: string;
    revision: number;
    saved_code: string;
  }): void;
};

type JoinChannelResponse = {
  liveUserId: string;
  roomInfo: RoomInfo;
};

declare global {
  interface Window {
    socket: any;
  }
}

const TIME_TO_THROTTLE_SOLO_MODE_SENDS = 2000;

class Live {
  private identifier = uuid.v4();
  private pendingMessages = new Map();
  private debug = _debug('cs:socket');
  private channel: Channel | null;
  private messageIndex = 0;
  private clients: ReturnType<typeof clientsFactory>;
  private awaitSendTimer: number;
  private socket: Socket;
  /*
    Since in "Solo mode" we want to batch up operations and other events later,
    we use a blocker to just hold the sending of the messages until an additional
    connection enters
  */
  private awaitSend: Blocker<void> | null = blocker<void>();
  private presence: Presence;
  private provideJwtToken: () => string;
  private onOperationError: (payload: {
    moduleShortid: string;
    code: string;
    revision: number;
    saved_code: string;
  }) => void;

  private operationToElixir(ot: (number | string)[]) {
    return ot.map((op: number | string) => {
      if (typeof op === 'number') {
        if (op < 0) {
          return { d: -op };
        }

        return op;
      }

      return { i: op };
    });
  }

  private isLiveBlockerExperiement: () => boolean;
  private connectionsCount = 0;
  private setAwaitSend() {
    this.awaitSend = blocker();
    clearTimeout(this.awaitSendTimer);
    this.awaitSendTimer = window.setTimeout(async () => {
      if (this.connectionsCount === 1) {
        // We await the currently resolved blocker before setting it back,
        // so that messages gets through
        await this.resolveAwaitSend();
        this.setAwaitSend();
      }
    }, TIME_TO_THROTTLE_SOLO_MODE_SENDS);
  }

  private resolveAwaitSend() {
    if (!this.awaitSend) {
      return Promise.resolve();
    }
    clearTimeout(this.awaitSendTimer);
    const awaitSend = this.awaitSend;
    this.awaitSend = null;
    awaitSend.resolve();
    return awaitSend.promise;
  }

  private async awaitSynchronizedModule(moduleShortid: string) {
    const client = this.clients.get(moduleShortid);
    if (client.awaitSynchronized) {
      await client.awaitSynchronized.promise;
    }
  }

  private onSendOperation = async (
    moduleShortid: string,
    revision: number,
    operation: TextOperation
  ) => {
    logBreadcrumb({
      type: 'ot',
      message: `Sending ${JSON.stringify({
        moduleShortid,
        revision,
        operation,
      })}`,
    });

    // If we are to await a send, we do it. It will be resolved
    // related to number of connections changing
    if (this.isLiveBlockerExperiement() && this.awaitSend) {
      await this.awaitSend.promise;
    }

    return this.send('operation', {
      moduleShortid,
      operation: this.operationToElixir(operation.toJSON()),
      revision,
    }).catch(error => {
      logBreadcrumb({
        type: 'ot',
        message: `ERROR ${JSON.stringify({
          moduleShortid,
          revision,
          operation,
          message: error.message,
        })}`,
      });

      captureException(error);
      if (error.module_state) {
        this.onOperationError({
          ...error.module_state[moduleShortid],
          moduleShortid,
        });
      }
      throw new Error(
        'The code was out of sync with the server, we had to reset the file'
      );
    });
  };

  initialize(options: Options) {
    this.provideJwtToken = options.provideJwtToken;
    this.onOperationError = options.onOperationError;
    this.isLiveBlockerExperiement = options.isLiveBlockerExperiement;
    this.clients = clientsFactory(
      this.onSendOperation,
      (moduleShortid, operation) =>
        options.onApplyOperation({
          moduleShortid,
          operation,
        })
    );
  }

  getSocket() {
    return this.socket || this.connect();
  }

  connect(): Socket {
    if (!this.socket) {
      const protocol = process.env.LOCAL_SERVER ? 'ws' : 'wss';
      this.socket = new Socket(`${protocol}://${location.host}/socket`, {
        params: {
          guardian_token: this.provideJwtToken(),
        },
      });

      this.socket.onClose(e => {
        if (e.code === 1006) {
          // This is an abrupt close, the server probably restarted or carshed. We don't want to overload
          // the server, so we manually wait and try to connect;
          this.socket.disconnect();

          const waitTime = 500 + 5000 * Math.random();

          window.setTimeout(() => {
            this.socket.connect();
          }, waitTime);
        }
      });

      this.socket.connect();
      window.socket = this.socket;
      this.debug('Connecting to socket', this.socket);
    }

    return this.socket;
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        resolve({});
        return;
      }

      this.channel
        .leave()
        .receive('ok', resp => {
          if (!this.channel) {
            return resolve({});
          }

          this.channel.onMessage = d => d;
          this.channel = null;
          this.pendingMessages.clear();
          this.messageIndex = 0;

          return resolve(resp);
        })
        // eslint-disable-next-line prefer-promise-reject-errors
        .receive('error', resp => reject(resp));
    });
  }

  joinChannel(roomId: string): Promise<JoinChannelResponse> {
    return new Promise((resolve, reject) => {
      this.channel = this.getSocket().channel(`live:${roomId}`, { version: 2 });

      /*
        When active we activate or deactivate the sending blocker depending
        on the number of connections we have. When "solo" we hold operation messages
        until we get a new connection. If we go back to "solo" we bring in the blocker
        again
      */
      if (this.isLiveBlockerExperiement()) {
        this.presence = new Presence(this.channel);
        this.presence.onSync(() => {
          const currentCount = this.connectionsCount;

          this.connectionsCount = this.presence.list().length;
          if (currentCount !== 1 && this.connectionsCount === 1) {
            this.setAwaitSend();
          } else if (currentCount === 1 && this.connectionsCount > 1) {
            this.resolveAwaitSend();
          }
        });
      }

      this.channel
        .join()
        .receive('ok', resp => {
          const result = camelizeKeys(resp) as JoinChannelResponse;
          resolve(result);
        })
        .receive('error', resp => reject(camelizeKeys(resp)));
    });
  }

  // TODO: Need to take an action here
  listen(
    action: (payload: {
      event: LiveMessageEvent;
      _isOwnMessage: boolean;
      data: object;
    }) => {}
  ) {
    if (!this.channel) {
      return;
    }

    this.channel.onMessage = (event: any, data: any) => {
      const disconnected =
        (data == null || Object.keys(data).length === 0) &&
        event === 'phx_error';
      const alteredEvent = disconnected ? 'connection-loss' : event;

      const _isOwnMessage = Boolean(
        data && data._messageId && this.pendingMessages.delete(data._messageId)
      );

      if (event && (event === 'phx_reply' || event.startsWith('chan_reply_'))) {
        // No action listens to this
        return data;
      }

      action({
        event: alteredEvent,
        _isOwnMessage,
        data: data == null ? {} : data,
      });

      return data;
    };
  }

  private sendImmediately(event, payload) {
    const _messageId = this.identifier + this.messageIndex++;
    // eslint-disable-next-line
    payload._messageId = _messageId;
    this.pendingMessages.set(_messageId, payload);

    return new Promise((resolve, reject) => {
      if (this.channel) {
        this.channel
          .push(event, payload)
          .receive('ok', resolve)
          .receive('error', reject);
      } else {
        // we might try to send messages even when not on live, just
        // ignore it
        resolve();
      }
    });
  }

  send(event: string, payload: { _messageId?: string; [key: string]: any }) {
    if (this.isLiveBlockerExperiement() && this.awaitSend) {
      return Promise.resolve();
    }

    return this.sendImmediately(event, payload);
  }

  async saveModule(module: Module) {
    /*
      If we save a module we will temporarily lift the message blocker,
      passing any operations through. As soon as the client of the module
      is back in synchronized state we can move on with the save
    */
    if (this.isLiveBlockerExperiement() && this.awaitSend) {
      this.resolveAwaitSend();
      await this.awaitSynchronizedModule(module.shortid);
      this.setAwaitSend();
    }
    // Send the save message
  }

  sendModuleUpdate(module: Module) {
    return this.send('module:updated', {
      type: 'module',
      moduleShortid: module.shortid,
      module,
    });
  }

  sendDirectoryUpdate(directory: Directory) {
    return this.send('directory:updated', {
      type: 'directory',
      directoryShortid: directory.shortid,
      module: directory,
    });
  }

  sendCodeUpdate(moduleShortid: string, operation: TextOperation) {
    if (!operation) {
      return;
    }

    if (moduleShortid.startsWith(OPTIMISTIC_ID_PREFIX)) {
      // Module is an optimistic module, we will send a full code update
      // once the module has been created, until then, send nothing!
      return;
    }

    try {
      this.clients.get(moduleShortid).applyClient(operation);
    } catch (e) {
      e.name = 'OperationFailure';
      captureException(e);
      // Something went wrong, probably a sync mismatch. Request new version
      this.send('live:module_state', {});
    }
  }

  sendExternalResourcesChanged(externalResources: string[]) {
    return this.send('sandbox:external-resources', {
      externalResources,
    });
  }

  sendUserCurrentModule(moduleShortid: string) {
    return this.send('user:current-module', {
      moduleShortid,
    });
  }

  sendDirectoryCreated(directory: Directory) {
    return this.send('directory:created', {
      type: 'directory',
      module: directory,
    });
  }

  sendDirectoryDeleted(directoryShortid: string) {
    this.send('directory:deleted', {
      type: 'directory',
      directoryShortid,
    });
  }

  sendModuleCreated(module: Module) {
    return this.send('module:created', {
      type: 'module',
      moduleShortid: module.shortid,
      module,
    });
  }

  sendModuleDeleted(moduleShortid: string) {
    return this.send('module:deleted', {
      type: 'module',
      moduleShortid,
    });
  }

  sendMassCreatedModules(modules: Module[], directories: Directory[]) {
    return this.send('module:mass-created', {
      directories,
      modules,
    });
  }

  sendLiveMode(mode: string) {
    return this.send('live:mode', {
      mode,
    });
  }

  sendEditorAdded(liveUserId: string) {
    return this.send('live:add-editor', {
      editor_user_id: liveUserId,
    });
  }

  sendEditorRemoved(liveUserId: string) {
    return this.send('live:remove-editor', {
      editor_user_id: liveUserId,
    });
  }

  sendClosed() {
    return this.send('live:close', {});
  }

  sendChat(message: string) {
    return this.send('chat', {
      message,
    });
  }

  sendModuleSaved(module: Module) {
    return this.send('module:saved', {
      type: 'module',
      module,
      moduleShortid: module.shortid,
    });
  }

  sendChatEnabled(enabled: boolean) {
    return this.send('live:chat_enabled', { enabled });
  }

  sendModuleStateSyncRequest() {
    return this.sendImmediately('live:module_state', {});
  }

  sendUserViewRange(
    moduleShortid: string | null,
    liveUserId: string,
    viewRange: UserViewRange
  ) {
    return this.send('user:view-range', {
      liveUserId,
      moduleShortid,
      viewRange,
    });
  }

  sendUserSelection(
    moduleShortid: string | null,
    liveUserId: string,
    selection: any
  ) {
    return this.send('user:selection', {
      liveUserId,
      moduleShortid,
      selection,
    });
  }

  reset() {
    this.clients.clear();

    clearTimeout(this.awaitSendTimer);

    this.awaitSend = null;
  }

  resetClient(moduleShortid: string, revision: number) {
    this.clients.reset(moduleShortid, revision);
  }

  getAllClients() {
    return this.clients.getAll();
  }

  applyClient(moduleShortid: string, operation: SerializedTextOperation) {
    return this.clients
      .get(moduleShortid)
      .applyClient(TextOperation.fromJSON(operation));
  }

  applyServer(moduleShortid: string, operation: SerializedTextOperation) {
    return this.clients
      .get(moduleShortid)
      .applyServer(TextOperation.fromJSON(operation));
  }

  serverAck(moduleShortid: string) {
    return this.clients.get(moduleShortid).serverAck();
  }

  createClient(moduleShortid: string, revision: number) {
    return this.clients.create(moduleShortid, revision);
  }
}

export default new Live();

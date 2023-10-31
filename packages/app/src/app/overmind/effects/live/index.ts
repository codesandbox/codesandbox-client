import {
  Directory,
  IModuleStateModule,
  LiveMessageEvent,
  Module,
  RoomInfo,
  UserSelection,
  UserViewRange,
} from '@codesandbox/common/lib/types';
import { blocker } from 'app/utils/blocker';
import {
  captureException,
  logBreadcrumb,
} from '@codesandbox/common/lib/utils/analytics/sentry';
import _debug from '@codesandbox/common/lib/utils/debug';
import VERSION from '@codesandbox/common/lib/version';
import { camelizeKeys } from 'humps';
import { SerializedTextOperation, TextOperation } from 'ot';
import { Channel, Presence, Socket } from 'phoenix';
import * as uuid from 'uuid';

import { AxiosError } from 'axios';
import { OPTIMISTIC_ID_PREFIX } from '../utils';
import { CodesandboxOTClientsManager, SendOperationResponse } from './clients';

type Options = {
  onApplyOperation(args: {
    moduleShortid: string;
    operation: TextOperation;
  }): void;
  provideJwtToken(): Promise<string>;
  onOperationError(payload: {
    moduleShortid: string;
    moduleInfo: IModuleStateModule;
  }): void;
};

type JoinChannelResponse = {
  liveUserId: string;
  reconnectToken: string;
  roomInfo: RoomInfo;
  moduleState: {
    [moduleId: string]: IModuleStateModule;
  };
};

type JoinChannelErrorResponse = {
  reason: 'room not found' | string;
};

declare global {
  interface Window {
    socket: any;
  }
}

class Live {
  public socket: Socket;

  private identifier = uuid.v4();
  private pendingMessages = new Map();
  private debug = _debug('cs:socket');
  private channel: Channel | null;
  private messageIndex = 0;
  private clientsManager: CodesandboxOTClientsManager;
  private presence: Presence;
  private provideJwtToken: () => Promise<string>;
  private onApplyOperation: (moduleShortid: string, operation: any) => void;
  private onOperationError: (payload: {
    moduleShortid: string;
    moduleInfo: IModuleStateModule;
  }) => void;

  private liveInitialized = blocker();

  private connectionsCount = 0;

  private onSendOperation = async (
    moduleShortid: string,
    revision: number,
    operation: TextOperation
  ) => {
    logBreadcrumb({
      category: 'ot',
      message: `Sending ${JSON.stringify({
        moduleShortid,
        revision,
        operation,
      })}`,
    });

    return this.send<SendOperationResponse>(
      'operation',
      {
        moduleShortid,
        operation: operation.toJSON(),
        revision,
      },
      45000
    ).catch(error => {
      logBreadcrumb({
        category: 'ot',
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
          moduleInfo: error.module_state[moduleShortid],
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
    this.onApplyOperation = (moduleShortid, operation) =>
      options.onApplyOperation({
        moduleShortid,
        operation,
      });
    this.clientsManager = new CodesandboxOTClientsManager(
      this.onSendOperation,
      this.onApplyOperation
    );
  }

  getSocket() {
    if (!this.connectionPromise) {
      this.connectionPromise = this.connect();
    }

    return this.connectionPromise;
  }

  private jwtPromise: Promise<string> | undefined;
  /**
   * Will return a promise for new jwt token, but if there's already a request
   * underway it will return the existing promise. This is to prevent spamming
   * the server with thousands of requests.
   */
  private provideJwtCached() {
    if (!this.jwtPromise) {
      this.jwtPromise = this.provideJwtToken()
        .catch(e => {
          this.jwtPromise = undefined;
          return Promise.reject(e);
        })
        .then(jwt => {
          // Token expires after 10 minutes, we cache the token for 8 minutes.
          const timeout = 1000 * 60 * 8;
          setTimeout(() => {
            this.jwtPromise = undefined;
          }, timeout);

          return jwt;
        });
    }

    return this.jwtPromise;
  }

  private connectionPromise: Promise<Socket>;
  private async connect(): Promise<Socket> {
    if (!this.socket) {
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';

      let jwt = await this.provideJwtCached();
      const params = () => ({
        guardian_token: jwt,
        client_version: VERSION,
      });

      // An offset between 1 and 1.7;
      const defaultReconnectOffset = 1 + Math.random() * 0.7;
      let isServerDown = false;
      const reconnectAfterMs = (tries: number) => {
        if (isServerDown) {
          return Math.floor(3000 + Math.random() * 2000);
        }

        // Based on the times tried we slowly increase the reconnect timeout, so first time
        // we try to reconnect in 10ms, second time in 50ms, third time in 100ms, fourth time in 150ms,
        // etc...
        return Math.floor(
          [10, 50, 100, 150, 200, 250, 500, 1000, 2000][tries - 1] *
            defaultReconnectOffset
        );
      };

      this.socket = new Socket(`${protocol}://${location.host}/socket`, {
        params,
        // @ts-expect-error Wrong typings
        reconnectAfterMs,
      });

      let tries = 0;
      this.socket.onError(async () => {
        // Regenerate a new JWT for the reconnect. This can be out of sync or happen more often than needed, but it's important
        // to try multiple times in case there's a connection issue.
        try {
          const newJwt = await this.provideJwtCached();
          jwt = newJwt;
          tries = 0;
        } catch (e) {
          const error = e as AxiosError;
          if (error.response?.status === 401 && tries++ > 4) {
            // If we can't get a jwt because we're unauthorized, disconnect...
            this.socket.disconnect();
            tries = 0;
          }

          // We have a 503 Bad Gateway, which means that the server is struggling. We need to increase
          // the timeout...
          if (error.response?.status === 503) {
            isServerDown = true;
          } else {
            isServerDown = false;
          }
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

  async joinChannel(
    roomId: string,
    onError: (reason: string) => void
  ): Promise<JoinChannelResponse> {
    const socket = await this.getSocket();
    return new Promise((resolve, reject) => {
      this.channel = socket.channel(`live:${roomId}`, { version: 2 });

      this.channel
        .join()
        .receive('ok', resp => {
          const result = camelizeKeys(resp) as JoinChannelResponse;
          result.moduleState = resp.module_state; // Don't camelize this!!

          // We rewrite what our reconnect params are by adding the reconnect token.
          // This token makes sure that you can retain state between reconnects and restarts
          // from the server
          // @ts-ignore
          this.channel.joinPush.payload = () => ({
            version: 2,
            reconnect_token: result.reconnectToken,
          });

          this.presence = new Presence(this.channel!);
          this.presence.onSync(() => {
            this.connectionsCount = this.presence.list().length;
          });

          resolve(result);
        })
        .receive('error', (resp: JoinChannelErrorResponse) => {
          if (resp.reason === 'room not found') {
            if (this.channel) {
              this.channel.leave();
            }
            onError(resp.reason);
          }
          reject(camelizeKeys(resp));
        });
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

  private send<T>(event, payload: any = {}, timeout = 10000): Promise<T> {
    const _messageId = this.identifier + this.messageIndex++;
    // eslint-disable-next-line
    payload._messageId = _messageId;
    this.pendingMessages.set(_messageId, payload);

    return new Promise((resolve, reject) => {
      if (this.channel) {
        this.channel
          .push(event, payload, timeout)
          .receive('ok', resolve)
          .receive('error', reject)
          .receive('timeout', () => {
            const error = new Error();
            error.name = 'live-timeout';
            error.message = `Live timeout on '${event}'`;
            reject(error);
          });
      } else {
        // we might try to send messages even when not on live, just
        // ignore it
        // @ts-ignore this is probably not safe but whatever
        resolve(undefined);
      }
    });
  }

  awaitModuleSynced(moduleShortid: string) {
    return Promise.resolve(
      this.clientsManager.get(moduleShortid).awaitSynchronized?.promise
    );
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

    if (operation.ops.length === 1) {
      const [op] = operation.ops;
      if (typeof op === 'number' && op >= 0) {
        // Useless to send a single retain operation, ignore
        return;
      }
    }

    if (moduleShortid.startsWith(OPTIMISTIC_ID_PREFIX)) {
      // Module is an optimistic module, we will send a full code update
      // once the module has been created, until then, send nothing!
      return;
    }

    try {
      this.clientsManager.get(moduleShortid).applyClient(operation);
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

  sendLiveMode(mode: RoomInfo['mode']) {
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

  sendModuleSaved(module: Module) {
    return this.send('module:saved', {
      type: 'module',
      module,
      moduleShortid: module.shortid,
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

  sendChatEnabled(enabled: boolean) {
    return this.send('live:chat_enabled', { enabled });
  }

  sendModuleStateSyncRequest() {
    return this.send('live:module_state', {});
  }

  sendUserViewRange(
    moduleShortid: string | null,
    liveUserId: string,
    viewRange: UserViewRange
  ) {
    if (this.connectionsCount === 1) {
      return Promise.resolve();
    }

    return this.send('user:view-range', {
      liveUserId,
      moduleShortid,
      viewRange,
    });
  }

  sendUserSelection(
    moduleShortid: string | null,
    liveUserId: string,
    selection: UserSelection
  ) {
    if (this.connectionsCount === 1) {
      return Promise.resolve();
    }

    return this.send('user:selection', {
      liveUserId,
      moduleShortid,
      selection,
    });
  }

  async saveModule(module: Module) {
    const client = this.clientsManager.get(module.shortid);
    await client.awaitSynchronized?.promise;

    return this.send<{
      saved_code: string;
      updated_at: string;
      inserted_at: string;
      version: number;
    }>('save', {
      path: module.path,
      revision: client.revision - 1,
    });
  }

  waitForLiveReady() {
    return this.liveInitialized.promise;
  }

  markLiveReady() {
    this.liveInitialized.resolve(undefined);
  }

  reset() {
    this.clientsManager.clear();
    this.liveInitialized.reject(undefined);
    this.liveInitialized = blocker();
  }

  resetClient(moduleShortid: string, revision: number) {
    this.clientsManager.reset(moduleShortid, revision);
  }

  hasClient(moduleShortid: string) {
    return this.clientsManager.has(moduleShortid);
  }

  getClient(moduleShortid: string) {
    return this.clientsManager.get(moduleShortid);
  }

  getAllClients() {
    return this.clientsManager.getAll();
  }

  applyClient(moduleShortid: string, operation: SerializedTextOperation) {
    return this.clientsManager
      .get(moduleShortid)
      .applyClient(TextOperation.fromJSON(operation));
  }

  applyServer(moduleShortid: string, operation: SerializedTextOperation) {
    return this.clientsManager
      .get(moduleShortid)
      .applyServer(TextOperation.fromJSON(operation));
  }

  serverAck(moduleShortid: string) {
    return this.clientsManager.get(moduleShortid).serverAck();
  }

  createClient(moduleShortid: string, revision: number) {
    return this.clientsManager.create(moduleShortid, revision);
  }
}

export default new Live();

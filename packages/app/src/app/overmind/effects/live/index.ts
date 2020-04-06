import {
  Directory,
  IModuleState,
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
import {
  CommentFragment,
  CreateCodeCommentMutationVariables,
  CreateCommentMutationVariables,
} from 'app/graphql/types';
import { camelizeKeys } from 'humps';
import { debounce } from 'lodash-es';
import { SerializedTextOperation, TextOperation } from 'ot';
import { Channel, Presence, Socket } from 'phoenix';
import uuid from 'uuid';

import { OPTIMISTIC_ID_PREFIX } from '../utils';
import clients from './clients';

type Options = {
  onApplyOperation(args: {
    moduleShortid: string;
    operation: TextOperation;
  }): void;
  provideJwtToken(): string;
  onOperationError(payload: {
    moduleShortid: string;
    code: string;
    revision: number;
    saved_code: string;
  }): void;
};

type JoinChannelResponse = {
  liveUserId: string;
  reconnectToken: string;
  roomInfo: RoomInfo;
  moduleState: IModuleState;
};

declare global {
  interface Window {
    socket: any;
  }
}

class Live {
  private identifier = uuid.v4();
  private pendingMessages = new Map();
  private debug = _debug('cs:socket');
  private channel: Channel | null;
  private messageIndex = 0;
  private socket: Socket;
  private presence: Presence;
  private provideJwtToken: () => string;
  private onApplyOperation: (moduleShortid: string, operation: any) => void;
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

    return this.send('operation', {
      moduleShortid,
      operation: this.operationToElixir(operation.toJSON()),
      revision,
    }).catch(error => {
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
    this.onApplyOperation = (moduleShortid, operation) =>
      options.onApplyOperation({
        moduleShortid,
        operation,
      });
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
      this.channel
        .join()
        .receive('ok', resp => {
          const result = camelizeKeys(resp) as JoinChannelResponse;

          // We rewrite what our reconnect params are by adding the reconnect token.
          // This token makes sure that you can retain state between reconnects and restarts
          // from the server
          // @ts-ignore
          this.channel.joinPush.payload = () => ({
            version: 2,
            reconnect_token: result.reconnectToken,
          });

          this.presence = new Presence(this.channel);
          this.presence.onSync(() => {
            this.connectionsCount = this.presence.list().length;
          });

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

  private send<T>(event, payload: any = {}): Promise<T> {
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

  saveModule(moduleShortid: string) {
    return this.send('save', {
      moduleShortid,
    });
  }

  async saveCodeComment(commentPayload: CreateCodeCommentMutationVariables) {
    return this.send<CommentFragment>('save:comment', commentPayload);
  }

  async saveComment(
    commentPayload: CreateCommentMutationVariables
  ): Promise<CommentFragment> {
    return this.send<CommentFragment>('save:comment', commentPayload);
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
      clients.get(moduleShortid).applyClient(operation);
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
      return this.sendDebounced('user:view-range', {
        liveUserId,
        moduleShortid,
        viewRange,
      });
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
    selection: any
  ) {
    if (this.connectionsCount === 1) {
      return this.sendDebounced('user:selection', {
        liveUserId,
        moduleShortid,
        selection,
      });
    }
    return this.send('user:selection', {
      liveUserId,
      moduleShortid,
      selection,
    });
  }

  reset() {
    clients.clear();
  }

  resetClient(moduleShortid: string, revision: number) {
    clients.reset(moduleShortid, revision);
  }

  getAllClients() {
    return clients.getAll();
  }

  applyClient(moduleShortid: string, operation: SerializedTextOperation) {
    return clients
      .get(moduleShortid)
      .applyClient(TextOperation.fromJSON(operation));
  }

  applyServer(moduleShortid: string, operation: SerializedTextOperation) {
    return clients
      .get(moduleShortid)
      .applyServer(TextOperation.fromJSON(operation));
  }

  serverAck(moduleShortid: string) {
    return clients.get(moduleShortid).serverAck();
  }

  createClient(moduleShortid: string, revision: number) {
    return clients.create(
      moduleShortid,
      revision,
      this.onSendOperation,
      this.onApplyOperation
    );
  }

  private sendDebounced = debounce<(event: string, payload: any) => void>(
    (...args) => {
      this.send(...args);
    },
    500
  );
}

export default new Live();

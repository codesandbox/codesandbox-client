import {
  Directory,
  LiveMessageEvent,
  Module,
  RoomInfo,
} from '@codesandbox/common/lib/types';
import _debug from '@codesandbox/common/lib/utils/debug';
import { camelizeKeys } from 'humps';
import { TextOperation } from 'ot';
import { Channel, Socket } from 'phoenix';
import uuid from 'uuid';

import { OPTIMISTIC_ID_PREFIX } from '../utils';
import clientsFactory from './clients';

type Options = {
  onApplyOperation(args: { moduleShortid: string; operation: any }): void;
  provideJwtToken(): string;
  getConnectionsCount(): number;
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

class Live {
  private identifier = uuid.v4();
  private sentMessages = new Map();
  private debug = _debug('cs:socket');
  private channel: Channel | null;
  private messageIndex = 0;
  private clients: ReturnType<typeof clientsFactory>;
  private _socket: Socket;

  private provideJwtToken: () => string;
  private getConnectionsCount: () => number;

  initialize(options: Options) {
    this.clients = clientsFactory(
      (moduleShortid, revision, operation) => {
        this.sendOperation(moduleShortid, revision, operation);
      },
      (moduleShortid, operation) => {
        options.onApplyOperation({
          moduleShortid,
          operation,
        });
      }
    );
    this.provideJwtToken = options.provideJwtToken;
    this.getConnectionsCount = options.getConnectionsCount;
  }

  getSocket() {
    return this._socket || this.connect();
  }

  connect(): Socket {
    if (!this._socket) {
      const protocol = process.env.LOCAL_SERVER ? 'ws' : 'wss';
      this._socket = new Socket(`${protocol}://${location.host}/socket`, {
        params: {
          guardian_token: this.provideJwtToken(),
        },
      });

      this._socket.connect();
      window.socket = this._socket;
      this.debug('Connecting to socket', this._socket);
    }

    return this._socket;
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
          this.sentMessages.clear();
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
        data && data._messageId && this.sentMessages.delete(data._messageId)
      );

      action({
        event: alteredEvent,
        _isOwnMessage,
        data: data == null ? {} : data,
      });

      return data;
    };
  }

  send(event: string, payload: { _messageId?: string; [key: string]: any }) {
    if (this.getConnectionsCount() < 2) {
      return Promise.resolve();
    }

    const _messageId = this.identifier + this.messageIndex++;
    // eslint-disable-next-line
    payload._messageId = _messageId;
    this.sentMessages.set(_messageId, payload);

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

  sendCodeUpdate(moduleShortid: string, operation: any) {
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
    return this.send('live:module_state', {});
  }

  sendUserSelection(moduleShortid: string, liveUserId: string, selection: any) {
    return this.send('user:selection', {
      liveUserId,
      moduleShortid,
      selection,
    });
  }

  getClient(moduleShortid: string) {
    return this.clients.get(moduleShortid);
  }

  getAllClients() {
    return this.clients.getAll();
  }

  applyClient(moduleShortid: string, operation: any) {
    return this.clients
      .get(moduleShortid)
      .applyClient(TextOperation.fromJSON(operation));
  }

  applyServer(moduleShortid: string, operation: any) {
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

  resetClients() {
    this.clients.clear();
  }

  private operationToElixir(ot) {
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

  private sendOperation(moduleShortid, revision, operation) {
    this.send('operation', {
      moduleShortid,
      operation: this.operationToElixir(operation.toJSON()),
      revision: Number(revision),
    });
  }
}

export default new Live();

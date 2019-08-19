import { Socket } from 'phoenix';
import _debug from '@codesandbox/common/lib/utils/debug';
import uuid from 'uuid';
import { TextOperation } from 'ot';
import { camelizeKeys } from 'humps';
import { Module, Directory } from '@codesandbox/common/lib/types';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
import clientsFactory from './clients';

type Options = {
  onApplyOperation(args: { moduleShortid: string; operation: any }): void;
  provideJwtToken(): string;
};

declare global {
  interface Window {
    socket: any;
  }
}

const identifier = uuid.v4();
const sentMessages = new Map();
const debug = _debug('cs:socket');

let channel = null;
let messageIndex = 0;
let clients: ReturnType<typeof clientsFactory>;
let _socket: Socket = null;
let provideJwtToken = null;

export default {
  initialize(options: Options) {
    const live = this;

    clients = clientsFactory(
      (moduleShortid, revision, operation) => {
        live.send('operation', {
          moduleShortid,
          operation,
          revision,
        });
      },
      (moduleShortid, operation) => {
        options.onApplyOperation({
          moduleShortid,
          operation,
        });
      }
    );
    provideJwtToken = options.provideJwtToken;
  },
  getSocket() {
    return _socket;
  },
  connect() {
    if (!_socket) {
      _socket = new Socket(`wss://${location.host}/socket`, {
        params: {
          guardian_token: provideJwtToken(),
        },
      });

      _socket.connect();
      window.socket = _socket;
      debug('Connecting to socket', _socket);
    }
  },
  disconnect() {
    return new Promise((resolve, reject) => {
      channel
        .leave()
        .receive('ok', resp => {
          channel.onMessage = d => d;
          channel = null;
          sentMessages.clear();
          messageIndex = 0;

          return resolve(resp);
        })
        .receive('error', resp => reject(resp));
    });
  },
  joinChannel<T>(roomId: string): Promise<T> {
    const { socket } = this.context;

    channel = socket.getSocket().channel(`live:${roomId}`, {});

    return new Promise((resolve, reject) => {
      channel
        .join()
        .receive('ok', resp => resolve(camelizeKeys(resp) as T))
        .receive('error', resp => reject(camelizeKeys(resp)));
    });
  },
  // TODO: Need to take an action here
  listen(signalPath) {
    const signal = this.context.controller.getSignal(signalPath);
    channel.onMessage = (event: any, data: any) => {
      const disconnected = data == null && event === 'phx_error';
      const alteredEvent = disconnected ? 'connection-loss' : event;

      const _isOwnMessage = Boolean(
        data && data._messageId && sentMessages.delete(data._messageId)
      );

      signal({
        event: alteredEvent,
        _isOwnMessage,
        data: data == null ? {} : data,
      });

      return data;
    };
  },
  send(event: string, payload: { _messageId?: string; [key: string]: any }) {
    const _messageId = identifier + messageIndex++;
    // eslint-disable-next-line
    payload._messageId = _messageId;
    sentMessages.set(_messageId, payload);

    return new Promise((resolve, reject) => {
      if (channel) {
        channel
          .push(event, payload)
          .receive('ok', resolve)
          .receive('error', reject);
      } else {
        reject('Channel is not defined');
      }
    });
  },
  sendModuleUpdate(moduleShortid: string, module?: Module) {
    return this.send('module:saved', {
      type: 'module',
      moduleShortid,
      module,
    });
  },
  sendDirectoryUpdate(directoryShortid: string) {
    return this.send('module:saved', {
      type: 'module',
      directoryShortid,
    });
  },
  sendCodeUpdate(moduleShortid: string, currentCode: string, code: string) {
    const operation = getTextOperation(currentCode, code);

    if (!operation) {
      return;
    }

    try {
      clients.get(moduleShortid).applyClient(TextOperation.fromJSON(operation));
    } catch (e) {
      // Something went wrong, probably a sync mismatch. Request new version
      console.error(
        'Something went wrong with applying OT operation',
        moduleShortid,
        operation
      );
      this.send('live:module_state', {});
    }
  },
  sendUserCurrentModule(moduleShortid: string) {
    this.send('user:current-module', {
      moduleShortid,
    });
  },
  sendDirectoryCreated(directoryShortid: string) {
    this.send('directory:created', {
      type: 'directory',
      directoryShortid,
    });
  },
  sendDirectoryDeleted(directoryShortid: string) {
    this.send(
      'directory:deleted',
      {
        type: 'directory',
        directoryShortid,
      }
      // When should we send module? Should we pass it when we should send it? Probably yeah
      // { sendModule: false }
    );
  },
  sendModuleCreated(moduleShortid: string) {
    this.send('module:created', {
      type: 'module',
      moduleShortid,
    });
  },
  sendModuleDeleted(moduleShortid: string) {
    this.send('module:deleted', {
      type: 'module',
      moduleShortid,
    });
  },
  sendMassCreatedModules(modules: Module[], directories: Directory[]) {
    this.send('module:mass-created', {
      directories,
      modules,
    });
  },
  sendLiveMode(mode: string) {
    this.send('live:mode', {
      mode,
    });
  },
  sendEditorAdded(liveUserId: string) {
    this.send('live:add-editor', {
      editor_user_id: liveUserId,
    });
  },
  sendEditorRemoved(liveUserId: string) {
    this.send('live:remove-editor', {
      editor_user_id: liveUserId,
    });
  },
  sendClosed() {
    this.send('live:close', {});
  },
  sendChat(message: string) {
    this.send('chat', {
      message,
    });
  },
  sendModuleSaved(moduleShortid: string) {
    this.send('module:saved', {
      type: 'module',
      moduleShortid,
    });
  },
  sendChatEnabled(enabled: boolean) {
    this.send('live:chat_enabled', { enabled });
  },
  sendModuleUpdateRequest() {
    this.send('live:module_state', {});
  },
  sendUserSelection(moduleShortid: string, liveUserId: string, selection: any) {
    this.send('user:selection', {
      liveUserId,
      moduleShortid,
      selection,
    });
  },
  getAllClients() {
    return clients.getAll();
  },
  getClient(moduleShortid: string) {
    return clients.get(moduleShortid);
  },
  createClient(moduleShortid: string, revision: number) {
    return clients.create(moduleShortid, revision);
  },
  resetClients() {
    clients.clear();
  },
};

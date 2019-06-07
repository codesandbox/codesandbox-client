import { Socket } from 'phoenix';
import _debug from '@codesandbox/common/lib/utils/debug';

type Options = { provideJwtToken: () => string };

let _socket: Socket = null;
let _options: Options = null;
const debug = _debug('cs:socket');

declare global {
  interface Window {
    socket: any;
  }
}

export default {
  initialize(options: Options) {
    _options = options;
  },
  connect() {
    if (!_socket) {
      _socket = new Socket(`wss://${location.host}/socket`, {
        params: {
          guardian_token: _options.provideJwtToken(),
        },
      });

      _socket.connect();
      window.socket = _socket;
      debug('Connecting to socket', _socket);
    }
  },
  getSocket() {
    if (!_socket) {
      this.connect();
    }

    return _socket;
  },
};

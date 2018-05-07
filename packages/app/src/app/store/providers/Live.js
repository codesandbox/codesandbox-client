import { Provider } from 'cerebral';
import { Socket } from 'phoenix';
import uuid from 'uuid';

const identifier = uuid.v4();
let messageIndex = 0;
const sentMessages = new Map();
let socket = null;
let channel = null;

export default Provider({
  connect() {
    const { state, jwt } = this.context;
    const token = state.get('jwt') || jwt.get();

    socket =
      socket ||
      new Socket(`wss://${location.host}/socket`, {
        params: {
          guardian_token: token,
        },
      });

    socket.connect();
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
  joinChannel(roomId: string) {
    channel = socket.channel(`live:${roomId}`, {});

    return new Promise((resolve, reject) => {
      channel
        .join()
        .receive('ok', resp => resolve(resp))
        .receive('error', resp => reject(resp));
    });
  },
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
  send(event: string, payload: Object) {
    const _messageId = identifier + messageIndex++;
    // eslint-disable-next-line
    payload._messageId = _messageId;
    sentMessages.set(_messageId, payload);

    return new Promise((resolve, reject) => {
      channel
        .push(event, payload)
        .receive('ok', resolve)
        .receive('error', reject);
    });
  },
});

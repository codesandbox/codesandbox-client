import { Provider } from 'cerebral';
import { Socket } from 'phoenix';

let socket = null;
let channel = null;

export default Provider({
  connect() {
    const { state, jwt } = this.context;
    const token = state.get('jwt') || jwt.get();

    socket = new Socket(`wss://${location.host}/socket`, {
      params: {
        guardian_token: token,
      },
    });

    socket.connect();
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
      const alteredEvent =
        data == null && event === 'phx_err' ? 'connection-loss' : event;

      signal({ event: alteredEvent, data: data == null ? {} : data });

      return data;
    };
  },
  send(event: string, payload: Object) {
    return new Promise((resolve, reject) => {
      channel
        .push(event, payload)
        .receive('ok', resolve)
        .receive('error', reject);
    });
  },
});

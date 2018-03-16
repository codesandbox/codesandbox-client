import { Provider } from 'cerebral';
import { Socket } from 'phoenix';
import { camelizeKeys } from 'humps';

import { host } from 'common/utils/url-generator';

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
        .receive('ok', resp => resolve(camelizeKeys(resp)))
        .receive('error', resp => reject(camelizeKeys(resp)));
    });
  },
  listen(signalPath) {
    const signal = this.context.controller.getSignal(signalPath);
    channel.onMessage = (event: any, data: any) => {
      signal({ event, data: camelizeKeys(data) });

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

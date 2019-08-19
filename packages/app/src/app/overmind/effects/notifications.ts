import { Socket, Channel } from 'phoenix';

type Options = {
  provideSocket: () => Socket;
};

let channel: Channel = null;
let _options: Options = null;

/*
  TODO: Refactor to pass in data instead of using context
*/
export default {
  initialize(options: Options) {
    _options = options;
  },
  disconnect() {
    return new Promise((resolve, reject) => {
      channel
        .leave()
        .receive('ok', resp => {
          channel.onMessage = d => d;
          channel = null;

          return resolve(resp);
        })
        .receive('error', resp => reject(resp));
    });
  },
  joinChannel(userId: string): Promise<{ unread: number }> {
    const socket = _options.provideSocket();

    channel = socket.channel(`notification:${userId}`, {});

    return new Promise((resolve, reject) => {
      channel
        .join()
        .receive('ok', resp => resolve(resp))
        .receive('error', resp => reject(resp));
    });
  },
  listen(action: (message: { event: string; data: any }) => void) {
    channel.onMessage = (event: any, data: any) => {
      const disconnected = data == null && event === 'phx_error';
      const alteredEvent = disconnected ? 'connection-loss' : event;

      action({
        event: alteredEvent,
        data: data == null ? {} : data,
      });

      return data;
    };
  },
};

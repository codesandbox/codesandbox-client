import { Channel, Socket } from 'phoenix';

type Options = {
  provideSocket: () => Promise<Socket>;
};

let channel: Channel | null = null;
let _options: Options | null = null;

/*
  TODO: Refactor to pass in data instead of using context
*/
export default {
  initialize(options: Options) {
    _options = options;
  },
  disconnect() {
    return new Promise((resolve, reject) => {
      if (!channel) {
        return;
      }
      channel
        .leave()
        .receive('ok', resp => {
          if (!channel) {
            return;
          }
          channel.onMessage = d => d;
          channel = null;

          resolve(resp);
        })
        .receive('error', resp => reject(resp));
    });
  },
  async joinChannel(userId: string): Promise<{ unread: number }> {
    if (!_options) {
      return Promise.reject();
    }
    const socket = await _options.provideSocket();

    channel = socket.channel(`notification:${userId}`, {});

    return new Promise((resolve, reject) => {
      if (!channel) {
        return;
      }
      channel
        .join()
        .receive('ok', resp => resolve(resp))
        .receive('error', resp => reject(resp));
    });
  },
  listen(action: (message: { event: string; data: any }) => void) {
    if (!channel) {
      return;
    }

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

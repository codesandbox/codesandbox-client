import { Provider } from 'cerebral';

let channel = null;

export default Provider({
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
  joinChannel() {
    const { socket, state } = this.context;

    const userId = state.get('user.id');

    channel = socket.getSocket().channel(`notification:${userId}`, {});

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

      signal({
        event: alteredEvent,
        data: data == null ? {} : data,
      });
      return data;
    };
  },
});

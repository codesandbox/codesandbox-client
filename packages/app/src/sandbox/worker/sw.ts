import { invariant } from 'outvariant';
import { CHANNEL_NAME, IWorkerPongMessage, MessageSentToWorker } from './types';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});

self.addEventListener('message', async event => {
  if (typeof event.data !== 'object' || event.data.$channel !== CHANNEL_NAME) {
    return;
  }

  const message = event.data as MessageSentToWorker;
  switch (message.$type) {
    // case 'worker/init': {
    //   const nextRelayPort = event.ports[0];

    //   invariant(
    //     relayPortPromise.state === 'pending',
    //     'Failed to initialize relay: relay port promise already fulfilled from previous evaluation.'
    //   );

    //   /**
    //    * @fixme Looks like upon shell restart, the worker is still running,
    //    * so this promise is already resolved. Resolving it again with
    //    * the correct message port does nothing, and it keeps pointing
    //    * to the previous (incorrect) message port.
    //    */
    //   relayPortPromise.resolve(nextRelayPort);
    //   break;
    // }

    case 'worker/ping': {
      // We are only interested in clients sending this.
      if (!(event.source instanceof Client)) {
        return;
      }

      const client = await self.clients.get(event.source.id);
      if (client) {
        const pong: IWorkerPongMessage = {
          $channel: CHANNEL_NAME,
          $type: 'worker/pong',
        };

        console.debug(pong);

        // Send back the pong message to keep the client/worker
        // communication from becoming idle (i.e. terminated).
        client.postMessage(pong);
      }
      break;
    }
  }
});

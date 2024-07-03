import { invariant } from 'outvariant';

import { debug, getServiceWorker, preventStaleTermination } from './utils';
import {
  CHANNEL_NAME,
  IPreviewInitMessage,
  IPreviewReadyMessage,
  IPreviewResponseMessage,
  IWorkerInitMessage,
} from './types';
import { DeferredPromise } from './promise';

// Create a message channel for communication with the Service Worker.
const workerChannel = new MessageChannel();

const workerReadyPromise = new DeferredPromise<ServiceWorker>();

workerReadyPromise.then(worker => {
  debug('[relay] worker is ready, initializing MessageChannel...');

  // Always post the initial MessageChannel message to the worker
  // as soon as the worker is ready. This is done once.
  const workerInitMessage: IWorkerInitMessage = {
    $channel: CHANNEL_NAME,
    $type: 'worker/init',
  };
  worker.postMessage(workerInitMessage, [workerChannel.port2]);

  return worker;
});

const parentPortPromise = new DeferredPromise<MessagePort>();
window.addEventListener(
  'message',
  (event: MessageEvent<IPreviewInitMessage>) => {
    debug('[relay]', event.data);
    if (event.data.$type === 'preview/init') {
      const parentPort = event.ports[0];
      parentPort.onmessage = async (evt: MessageEvent) => {
        if (
          typeof evt.data === 'object' &&
          evt.data.$channel === CHANNEL_NAME &&
          evt.data.$type === 'preview/response'
        ) {
          const msg: IPreviewResponseMessage = evt.data;
          workerChannel.port1.postMessage(msg);
        }
      };
      parentPortPromise.resolve(parentPort);
    }
  }
);

export async function startServiceWorker() {
  const worker = await getServiceWorker().catch(error => {
    console.error(
      '[relay] Failed to ensure the relay has a Service Worker registered. See details below.'
    );
    console.error(error);
  });

  await navigator.serviceWorker.ready;

  invariant(
    worker,
    '[relay] Failed to retrieve the worker instance: worker not found'
  );
  preventStaleTermination(worker);

  // TODO: remove before flight
  window.addEventListener('beforeunload', async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      // eslint-disable-next-line no-await-in-loop
      await registration.unregister();
    }

    debug('[relay] Unregister all SW');
  });

  workerReadyPromise.resolve(worker);

  debug('[relay] Worker ready');

  // Wait until the parent sends the init event
  // via the MessageChannel, acknowledging that it recognized the relay.
  const parentPort = await parentPortPromise;
  debug('[relay] Parent port received', parentPort);

  const readyMessage: IPreviewReadyMessage = {
    $channel: CHANNEL_NAME,
    $type: 'preview/ready',
  };
  parentPort.postMessage(readyMessage);
}

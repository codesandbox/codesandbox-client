import { invariant } from 'outvariant';

import { getServiceWorker, preventStaleTermination } from './utils';

export async function startServiceWorker() {
  const worker = await getServiceWorker().catch(error => {
    console.error(
      'Failed to ensure the relay has a Service Worker registered. See details below.'
    );
    console.error(error);
  });

  await navigator.serviceWorker.ready;

  invariant(worker, 'Failed to retrieve the worker instance: worker not found');
  preventStaleTermination(worker);

  console.debug('SW READY');
}

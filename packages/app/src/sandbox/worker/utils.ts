/* eslint-disable no-console */

import { invariant } from 'outvariant';
// @ts-ignore
import SandpackWorker from 'worker-loader?publicPath=/&name=sw.[hash:8].worker.js!./sw';
import { CHANNEL_NAME, IWorkerPingMessage } from './types';

const __SERVICE_WORKER_BUNDLE_NAME = SandpackWorker.toString()
  .replace('function() {\n  return new Worker("/" + "', '')
  .replace('");\n}', '');
const workerUrl = new URL(__SERVICE_WORKER_BUNDLE_NAME, location.origin).href;

const DEBUG = true;
const debug = (...args) => {
  if (DEBUG) console.debug(...args);
};

export async function getServiceWorker(): Promise<ServiceWorker | null> {
  invariant(
    'serviceWorker' in navigator,
    'Failed to start the relay Service Worker: Service Worker API is not supported in this browser'
  );

  /**
   * Registers the relay Service Worker anew.
   */
  const registerWorker = async (): Promise<ServiceWorker | null> => {
    const registration = await navigator.serviceWorker.register(
      __SERVICE_WORKER_BUNDLE_NAME,
      {
        scope: '/',
      }
    );
    return getWorkerInstance(registration);
  };

  // Unregisters irrelevant worker registrations.
  const registrations = await navigator.serviceWorker.getRegistrations();
  debug('all registrations', location, registrations);

  await Promise.all(
    // @ts-ignore
    registrations.map(registration => {
      const worker = getWorkerInstance(registration);

      // Unregister any worker that shouldn't be there.
      if (worker && worker.scriptURL !== workerUrl) {
        debug(
          'found irrelevant worker registration, unregistering...',
          worker,
          registration
        );
        return registration.unregister();
      }
    })
  );

  // Get the existing Service Worker controller, if any.
  const { controller } = navigator.serviceWorker;

  // No controller means the relay does not have any Service Worker registered.
  if (!controller) {
    debug('relay is not controlled by a worker, registering a new worker...');
    return registerWorker();
  }

  if (controller) {
    debug('found a crontoller', controller);
  }

  // If the controller has the same script as the expected worker,
  // this means the correct worker is already handling the page.
  if (controller.scriptURL === workerUrl) {
    debug('relay is controlled by the correct worker', controller.scriptURL);
    return controller;
  }

  const [controllerRegistration, registration] = await Promise.all([
    navigator.serviceWorker.getRegistration(controller.scriptURL),
    navigator.serviceWorker.getRegistration(workerUrl),
  ]);

  debug('controller registration:', controllerRegistration);
  debug('worker registration:', registration);

  // If there's no registration associated with the correct worker,
  // unregister whichever existing controller and register the worker anew.
  if (!registration) {
    debug(
      'no registration found for "%s", unregistering controller and registering a new worker...',
      workerUrl
    );
    await controllerRegistration?.unregister();
    return registerWorker();
  }

  // Waiting registration means the correct worker is queued but
  // hasn't been installed/activated yet. Promote it by updating.
  if (registration.waiting) {
    debug('found waiting registration, promoting...');
    await registration.update();
    const worker = getWorkerInstance(registration);

    invariant(
      worker,
      'Failed to retrieve the worker instance after promotion: worked does not exist'
    );
    invariant(
      registration.active,
      'Failed to promove a waiting Service Worker: expected the worker state to be "active" but got "%s"',
      worker.state
    );

    return worker;
  }

  return null;
}

function getWorkerInstance(
  registration: ServiceWorkerRegistration
): ServiceWorker | null {
  return registration.installing || registration.waiting || registration.active;
}

/**
 * Establish a ping/pong messages between the client and the worker.
 * This prevent their communication from becoming idle, which causes
 * some browsers to terminate the worker after a period of inactivity.
 */
export function preventStaleTermination(worker: ServiceWorker): void {
  const keepaliveInterval = setInterval(() => {
    const pingMessage: IWorkerPingMessage = {
      $channel: CHANNEL_NAME,
      $type: 'worker/ping',
    };

    debug(pingMessage);

    worker.postMessage(pingMessage);
  }, 5000);

  worker.addEventListener('statechange', () => {
    // Stop the keepalive if the worker becomes redundant
    // (e.g. get unregistered or force-reloaded).
    if (worker.state === 'redundant') {
      debug('Stop the keepalive');
      clearInterval(keepaliveInterval);
    }
  });
}

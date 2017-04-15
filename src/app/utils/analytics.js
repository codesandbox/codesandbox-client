// @flow
import _debug from 'app/utils/debug';
import type { CurrentUser } from 'common/types';

const debug = _debug('cs:analytics');

const heapAvailable = () => typeof window.heap === 'function';
const sentryAvailable = () => typeof window.Raven === 'object';

export default function track(event: string, data: Object) {
  if (!heapAvailable()) return;

  debug(`Tracking event ${event} with data`, data);
  if (process.env.NODE_ENV === 'production') {
    window.heap.track(event, data);
  }
}

function identifyHeap(user: CurrentUser) {
  if (!heapAvailable()) return;

  if (process.env.NODE_ENV === 'production') {
    window.heap.identify(user.username);
    window.heap.addUserProperties({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

function identifySentry(user: CurrentUser) {
  if (!sentryAvailable()) return;

  window.Raven.setUserContext({
    email: user.email,
    id: user.id,
    username: user.username,
  });
}

export function identify(user: CurrentUser) {
  debug(`Identified ${user.username}`);
  identifyHeap(user);
  identifySentry(user);
}

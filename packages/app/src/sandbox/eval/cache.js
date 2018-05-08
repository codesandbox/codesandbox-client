// Responsible for consuming and syncing with the server/local cache
import localforage from 'localforage';
import _debug from 'app/utils/debug';
import type { default as Manager } from './manager';

import { SCRIPT_VERSION } from '../';

const debug = _debug('cs:compiler:cache');

const host = process.env.CODESANDBOX_HOST;

localforage.config({
  name: 'CodeSandboxApp',
  storeName: 'sandboxes', // Should be alphanumeric, with underscores.
  description:
    'Cached transpilations of the sandboxes, for faster initialization time.',
});

// Prewarm store
localforage.keys();

function shouldSaveOnlineCache(firstRun: boolean) {
  if (!firstRun) {
    return false;
  }

  if (!window.__SANDBOX_DATA__) {
    return true;
  }

  return false;
}

export async function saveCache(
  sandboxId: string,
  managerModuleToTranspile: any,
  manager: Manager,
  firstRun: boolean
) {
  const managerState = {
    ...manager.serialize(),
  };
  managerState.entry = managerModuleToTranspile
    ? managerModuleToTranspile.path
    : null;

  try {
    if (process.env.NODE_ENV === 'development') {
      debug(
        'Saving cache of ' +
          (JSON.stringify(managerState).length / 1024).toFixed(2) +
          'kb to localStorage'
      );
    }
    localforage.setItem(manager.id, managerState);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }
    this.clearCache();
  }

  if (shouldSaveOnlineCache(firstRun)) {
    const stringifiedManagerState = JSON.stringify(managerState);

    debug(
      'Saving cache of ' +
        (stringifiedManagerState.length / 1024).toFixed(2) +
        'kb to CodeSandbox API'
    );

    return window
      .fetch(`${host}/api/v1/sandboxes/${sandboxId}/cache`, {
        method: 'POST',
        body: JSON.stringify({
          version: SCRIPT_VERSION,
          data: stringifiedManagerState,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(x => x.json())
      .catch(e => {
        console.error('Something went wrong while saving cache.');
        console.error(e);
      });
  }

  return Promise.resolve(false);
}

function findCacheToUse(cache1, cache2) {
  if (!cache1 && !cache2) {
    return null;
  }

  if (cache1 && !cache2) {
    return cache1;
  }

  if (cache2 && !cache1) {
    return cache2;
  }

  return cache2.timestamp > cache1.timestamp ? cache2 : cache1;
}

export async function consumeCache(manager: Manager) {
  const cacheData = window.__SANDBOX_DATA__;
  const localData = await localforage.getItem(manager.id);

  const cache = findCacheToUse(cacheData && cacheData.data, localData);
  if (cache) {
    const version = SCRIPT_VERSION;

    if (cache.version === version) {
      debug(
        `Loading cache from ${cache === localData ? 'localStorage' : 'API'}`,
        cache
      );

      await manager.load(cache);

      return true;
    }
  }

  return false;
}

// Responsible for consuming and syncing with the server/local cache
import localforage from 'localforage';
import _debug from '@codesandbox/common/lib/utils/debug';
import Manager from './manager';

import { SCRIPT_VERSION } from '..';

const debug = _debug('cs:compiler:cache');

const host = process.env.CODESANDBOX_HOST;

const MAX_CACHE_SIZE = 1024 * 1024 * 7;
let APICacheUsed = false;

try {
  localforage.config({
    name: 'CodeSandboxApp',
    storeName: 'sandboxes', // Should be alphanumeric, with underscores.
    description:
      'Cached transpilations of the sandboxes, for faster initialization time.',
  });

  // Prewarm store
  localforage.keys();
} catch (e) {
  console.warn('Problems initializing IndexedDB store.');
  console.warn(e);
}

function shouldSaveOnlineCache(firstRun: boolean, changes: number) {
  if (!firstRun || changes > 0) {
    return false;
  }

  if (!(window as any).__SANDBOX_DATA__) {
    return true;
  }

  return false;
}

export function clearIndexedDBCache() {
  return localforage.clear();
}

export async function saveCache(
  sandboxId: string,
  managerModuleToTranspile: any,
  manager: Manager,
  changes: number,
  firstRun: boolean
) {
  if (!sandboxId) {
    return Promise.resolve(false);
  }

  const managerState = {
    ...(await manager.serialize({
      entryPath: managerModuleToTranspile
        ? managerModuleToTranspile.path
        : null,
      optimizeForSize: true,
    })),
  };

  try {
    if (process.env.NODE_ENV === 'development') {
      debug(
        'Saving cache of ' +
          (JSON.stringify(managerState).length / 1024).toFixed(2) +
          'kb to indexedDB'
      );
    }
    await localforage.setItem(manager.id, managerState);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }
    manager.clearCache();
  }

  if (shouldSaveOnlineCache(firstRun, changes) && SCRIPT_VERSION) {
    const stringifiedManagerState = JSON.stringify(managerState);

    if (stringifiedManagerState.length > MAX_CACHE_SIZE) {
      return Promise.resolve(false);
    }

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
        if (process.env.NODE_ENV === 'development') {
          console.error('Something went wrong while saving cache.');
          console.error(e);
        }
      });
  }

  return Promise.resolve(false);
}

export function deleteAPICache(sandboxId: string): Promise<any> {
  if (APICacheUsed) {
    debug('Deleting cache of API');
    return window
      .fetch(`${host}/api/v1/sandboxes/${sandboxId}/cache`, {
        method: 'DELETE',
        body: JSON.stringify({
          version: SCRIPT_VERSION,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(x => x.json())
      .catch(e => {
        console.error('Something went wrong while deleting cache.');
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

export function ignoreNextCache() {
  try {
    localStorage.setItem('ignoreCache', 'true');
  } catch (e) {
    console.warn(e);
  }
}

export async function consumeCache(manager: Manager) {
  try {
    const shouldIgnoreCache = localStorage.getItem('ignoreCache');
    if (shouldIgnoreCache) {
      localStorage.removeItem('ignoreCache');

      return false;
    }

    const cacheData = (window as any).__SANDBOX_DATA__;
    const localData = await localforage.getItem(manager.id);

    const cache = findCacheToUse(cacheData && cacheData.data, localData);
    if (cache) {
      const version = SCRIPT_VERSION;

      if (cache.version === version) {
        if (cache === localData) {
          APICacheUsed = false;
        } else {
          APICacheUsed = true;
        }

        debug(
          `Loading cache from ${cache === localData ? 'localStorage' : 'API'}`,
          cache
        );

        await manager.load(cache);

        return true;
      }
    }

    return false;
  } catch (e) {
    console.warn('Problems consuming cache');
    console.warn(e);

    return false;
  }
}

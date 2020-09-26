// Responsible for consuming and syncing with the server/local cache
import _debug from '@codesandbox/common/lib/utils/debug';
import { Manager, cache } from 'sandpack-core';

const debug = _debug('cs:compiler:cache');

export async function saveCache(
  sandboxId: string,
  managerModuleToTranspile: any,
  manager: Manager,
  changes: number,
  firstRun: boolean,
  cacheProvider: cache.CacheProvider
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
          'kb'
      );
    }
    return cacheProvider.save(manager.id, managerState, {
      changes,
      firstRun,
    });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }
  }

  return Promise.resolve(false);
}

export function deleteCache(
  sandboxId: string,
  version: string,
  cacheProvider: cache.CacheProvider
): Promise<any> {
  return cacheProvider.delete(sandboxId, version);
}

export function ignoreNextCache() {
  try {
    localStorage.setItem('ignoreCache', 'true');
  } catch (e) {
    console.warn(e);
  }
}

export async function consumeCache(
  manager: Manager,
  cacheProvider: cache.CacheProvider
) {
  try {
    const shouldIgnoreCache =
      localStorage.getItem('ignoreCache') ||
      localStorage.getItem('ignoreCacheDev');
    if (shouldIgnoreCache) {
      localStorage.removeItem('ignoreCache');

      return false;
    }

    const managerCache = await cacheProvider.load(manager.id);
    if (managerCache) {
      if (managerCache.version === manager.version) {
        debug(`Loading cache`, managerCache);
        await manager.load(managerCache);

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

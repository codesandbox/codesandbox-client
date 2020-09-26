import {
  CacheProvider,
  ManagerCache,
  CacheContext,
} from 'sandpack-core/lib/cache';

type WindowData = {
  data: ManagerCache;
  latestSha: string;
  version: string;
};

const host = process.env.CODESANDBOX_HOST;

/**
 * Cache provider that checks on the window whether a cache is available, if there is use that.
 */
export class APICacheProvider implements CacheProvider {
  private shouldSaveCacheOnline(cacheContext: CacheContext) {
    if (!cacheContext.firstRun || cacheContext.changes > 0) {
      return false;
    }

    if (!(window as any).__SANDBOX_DATA__) {
      return true;
    }

    return false;
  }

  constructor(private maxCacheSize: number = 1024 * 1024 * 20) {}

  async initialize() {}

  async load(id: string) {
    const cacheData: WindowData | undefined = (window as any).__SANDBOX_DATA__;
    if (!cacheData) {
      return undefined;
    }

    if (cacheData.data.id === id) {
      return cacheData.data;
    }

    return undefined;
  }

  async save(id: string, cache: ManagerCache, cacheContext: CacheContext) {
    if (!this.shouldSaveCacheOnline(cacheContext)) {
      return;
    }

    const stringifiedManagerState = JSON.stringify(cache);

    if (stringifiedManagerState.length > this.maxCacheSize) {
      return;
    }

    await window
      .fetch(`${host}/api/v1/sandboxes/${id}/cache`, {
        method: 'POST',
        body: JSON.stringify({
          version: cache.version,
          data: JSON.stringify(cache),
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

  async delete(id: string, version: string) {
    await window
      .fetch(`${host}/api/v1/sandboxes/${id}/cache`, {
        method: 'DELETE',
        body: JSON.stringify({
          version,
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

  clear() {
    return Promise.resolve();
  }
}

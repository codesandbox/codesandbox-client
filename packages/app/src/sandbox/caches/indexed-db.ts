import localforage from 'localforage';
import { CacheProvider, ManagerCache } from 'sandpack-core/lib/cache';

export class IndexedDBCacheProvider implements CacheProvider {
  async initialize() {
    try {
      localforage.config({
        name: 'CodeSandboxApp',
        storeName: 'sandboxes',
        description:
          'Cached transpilations of the sandboxes, for faster initialization time.',
      });

      // Prewarm store
      localforage.keys();
    } catch (e) {
      console.warn('Problems initializing IndexedDB store.');
      console.warn(e);
    }
  }

  async load(id: string) {
    try {
      const result = await localforage.getItem<ManagerCache>(id);
      return result;
    } catch (e) {
      return undefined;
    }
  }

  async save(id: string, state: ManagerCache) {
    try {
      await localforage.setItem(id, state);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error(e);
      }
    }
  }

  clear() {
    return localforage.clear();
  }

  delete(id: string, version: string) {
    return localforage.removeItem(id);
  }
}

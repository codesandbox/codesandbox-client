/* eslint-disable no-await-in-loop, no-restricted-syntax */
import sortBy from 'lodash/sortBy';
import {
  CacheProvider,
  ManagerCache,
  CacheContext,
} from 'sandpack-core/lib/cache';

/**
 * This provider takes multiple providers, and tries to use them first-serve. This way you can have
 * fallback cache providers (eg. indexedDB -> localStorage -> Window -> API).
 *
 * For loading it will load all caches, and compare the timestamp (always get the latest).
 * For saving it will save to all caches.
 */
export class MergedCacheProvider implements CacheProvider {
  constructor(private providers: CacheProvider[]) {}

  async initialize() {
    for (const provider of this.providers) {
      await provider.initialize();
    }
  }

  async save(id: string, cache: ManagerCache, context: CacheContext) {
    await Promise.all(
      this.providers.map(provider => provider.save(id, cache, context))
    );
  }

  async load(id: string) {
    const caches = (
      await Promise.all(this.providers.map(p => p.load(id)))
    ).filter(Boolean) as ManagerCache[];

    const newestCache = sortBy(caches, c => c.timestamp)[0];

    return newestCache;
  }

  async clear() {
    for (const provider of this.providers) {
      await provider.clear();
    }
  }

  async delete(id: string, version: string) {
    for (const provider of this.providers) {
      await provider.delete(id, version);
    }
  }
}

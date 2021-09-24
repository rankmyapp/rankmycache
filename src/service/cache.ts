import { CacheAdapter } from '../adapters/cache-adapter-interface';
import { AvailableProviders } from '../adapters/cache-adapters';
import { availableProviders } from '../adapters/cache-providers';
import { CacheOptions } from '../config/config-options-interface';
import { CacheServiceInterface } from './cache-interface';

export class RankMyCache implements CacheServiceInterface {
  cacheAdapter: CacheAdapter<AvailableProviders>;

  constructor(cacheOptions: CacheOptions) {
    this.cacheAdapter = availableProviders(cacheOptions);
  }

  get<T>(key: string): Promise<T> {
    return this.cacheAdapter.get<T>(key);
  }

  set<T>(key: string, data: T): Promise<void> {
    return this.cacheAdapter.set<T>(key, data);
  }

  delete(key: string): Promise<void> {
    return this.cacheAdapter.delete(key);
  }
}

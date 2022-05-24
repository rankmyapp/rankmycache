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

  set<T>(
    key: string,
    data: T,
    secondsToExpire?: number | false,
  ): Promise<void> {
    return this.cacheAdapter.set<T>(key, data, secondsToExpire);
  }

  delete(key: string): Promise<void> {
    return this.cacheAdapter.delete(key);
  }

  getSetMembers(key: string): Promise<string[]> {
    return this.cacheAdapter.getSetMembers(key);
  }

  addToSet<T>(key: string, value: T | T[]): Promise<void> {
    return this.cacheAdapter.addToSet(key, value);
  }

  removeFromSet<T>(key: string, value: T | T[]): Promise<void> {
    return this.cacheAdapter.removeFromSet(key, value);
  }

  isSetMember<T>(key: string, value: T | T[]): Promise<boolean> {
    return this.cacheAdapter.isSetMember(key, value);
  }
}

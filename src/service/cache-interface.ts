import { CacheAdapter } from '../adapters/cache-adapter-interface';
import { AvailableProviders } from '../adapters/cache-adapters';

export interface CacheServiceInterface {
  cacheAdapter: CacheAdapter<AvailableProviders>;

  get<T>(key: string): Promise<T>;
  set<T>(key: string, data: T, secondsToExpire?: number | false): Promise<void>;
  delete(key: string): Promise<void>;
  getSetMembers(key: string): Promise<string[]>;
  addToSet<T>(key: string, value: T | T[]): Promise<void>;
  removeFromSet<T>(key: string, value: T | T[]): Promise<void>;
  isSetMember<T>(key: string, value: T | T[]): Promise<boolean>;
}

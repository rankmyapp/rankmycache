import { CacheAdapter } from '../adapters/cache-adapter-interface';
import { AvailableProviders } from '../adapters/cache-adapters';

export interface CacheServiceInterface {
  cacheAdapter: CacheAdapter<AvailableProviders>;

  get<T>(key: string): Promise<T>;
  set<T>(key: string, data: T, secondsToExpire?: number | false): Promise<void>;
  delete(key: string): Promise<void>;
}

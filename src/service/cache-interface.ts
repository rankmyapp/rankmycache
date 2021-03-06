import { CacheAdapter } from '../adapters/cache-adapter-interface';
import { AvailableProviders } from '../adapters/cache-adapters';

export type SetValueType = string | number;

export interface CacheServiceInterface {
  cacheAdapter: CacheAdapter<AvailableProviders>;

  get<T>(key: string): Promise<T>;
  set<T>(key: string, data: T, secondsToExpire?: number | false): Promise<void>;
  delete(key: string): Promise<void>;
  getSetMembers(key: string): Promise<string[] | null>;
  addToSet<T extends SetValueType>(key: string, value: T | T[]): Promise<void>;
  removeFromSet<T extends SetValueType>(
    key: string,
    value: T | T[],
  ): Promise<void>;
  isSetMember<T extends SetValueType>(key: string, value: T): Promise<boolean>;
  expire(key: string, secondsToExpire: number): Promise<void>;
}

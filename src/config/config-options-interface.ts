import { CacheProviders } from '../enums/cache-providers';

export interface CacheOptions {
  type: CacheProviders;
  host: string;
  port: number;
  password?: string;
  requestTimeout?: number;
  keyPrefix?: string;
}

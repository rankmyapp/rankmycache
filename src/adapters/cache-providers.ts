import { CacheOptions } from '../config/config-options-interface';
import { CacheProviders } from '../enums/cache-providers';
import { CacheAdapter } from './cache-adapter-interface';
import { AvailableProviders } from './cache-adapters';
import { InMemoryAdapter } from './in-memory-adapter';
import { IORedisAdapter } from './ioredis-adapter';

export const availableProviders = (
  options: CacheOptions,
): CacheAdapter<AvailableProviders> | never => {
  switch (options.type) {
    case CacheProviders.IOREDIS: {
      return new IORedisAdapter(options);
    }
    case CacheProviders.IN_MEMORY: {
      return new InMemoryAdapter();
    }
    default: {
      throw new Error(`Provider ${options.type} is not available`);
    }
  }
};

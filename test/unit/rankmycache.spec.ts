import { CacheServiceInterface } from '../../src/service/cache-interface';
import { CacheProviders } from '../../src/enums';
import { RankMyCache } from '../../src';

type MockData = {
  id: number;
  name: string;
};

let rankMyCache: CacheServiceInterface;
describe('RankMyCache', () => {
  beforeEach(async () => {
    rankMyCache = new RankMyCache({
      type: CacheProviders.IN_MEMORY,
      host: 'host',
      password: 'password',
      port: 1000,
      requestTimeout: 100,
    });

    const mockData = {
      id: 1,
      name: 'mock',
    };

    await rankMyCache.set('mock-key', mockData);
  });

  it('should return null if data has not been set', async () => {
    const cacheData = await rankMyCache.get('non-existent-mock-key');

    expect(cacheData).toBeNull();
  });

  it('should get cache data', async () => {
    const cacheData = await rankMyCache.get<MockData>('mock-key');

    expect(cacheData.id).toBe(1);
    expect(cacheData.name).toBe('mock');
  });

  it('should save cache data', async () => {
    const mockSetData = {
      id: 2,
      name: 'mock-set-data',
    };

    await rankMyCache.set('mock-set-key', mockSetData);

    const savedData = await rankMyCache.get<MockData>('mock-set-key');

    expect(savedData.id).toBe(mockSetData.id);
    expect(savedData.name).toBe(mockSetData.name);
  });

  it('should delete saved cache data', async () => {
    const mockSetData = {
      id: 2,
      name: 'mock-delete-data',
    };

    await rankMyCache.set('mock-delete-key', mockSetData);

    await rankMyCache.delete('mock-delete-key');

    const data = await rankMyCache.get<MockData>('mock-delete-key');

    expect(data).toBeNull();
  });
});

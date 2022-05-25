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

  it('should add single item to set', async () => {
    const setKey = 'test-set';
    const item = 'test-item';

    await rankMyCache.addToSet(setKey, item);

    const setItems = await rankMyCache.getSetMembers(setKey);

    expect(setItems).toEqual(expect.arrayContaining([item]));
  });

  it('should add multiple items to a set', async () => {
    const setKey = 'test-set';
    const items = ['test-item-1', 'test-item-2'];

    await rankMyCache.addToSet(setKey, items);

    const setItems = await rankMyCache.getSetMembers(setKey);

    expect(setItems).toEqual(expect.arrayContaining(items));
  });

  it('should remove an item from a set', async () => {
    const setKey = 'test-set';
    const items = ['test-item-1', 'test-item-2'];

    await rankMyCache.addToSet(setKey, items);

    await rankMyCache.removeFromSet(setKey, items[0]);

    const setItems = await rankMyCache.getSetMembers(setKey);

    expect(setItems).not.toEqual(expect.arrayContaining([items[0]]));
    expect(setItems).toEqual(expect.arrayContaining([items[1]]));
  });

  it('should remove multiple items from a set', async () => {
    const setKey = 'test-set';
    const items = ['test-item-1', 'test-item-2', 'test-item-3'];

    await rankMyCache.addToSet(setKey, items);

    await rankMyCache.removeFromSet(setKey, [items[0], items[1]]);

    const setItems = await rankMyCache.getSetMembers(setKey);

    expect(setItems).not.toEqual(expect.arrayContaining([items[0]]));
    expect(setItems).not.toEqual(expect.arrayContaining([items[1]]));
    expect(setItems).toEqual(expect.arrayContaining([items[2]]));
  });

  it('should check if an item is in a set', async () => {
    const setKey = 'test-set';
    const items = ['test-item-1', 'test-item-2', 'test-item-3'];
    const itemNotIn = 'test-item-not-in';

    await rankMyCache.addToSet(setKey, items);

    await expect(rankMyCache.isSetMember(setKey, items[1])).resolves.toBe(true);

    await expect(rankMyCache.isSetMember(setKey, itemNotIn)).resolves.toBe(
      false,
    );
  });

  it('should expire a cache after a given time', async () => {
    const cacheKey = 'test-set';
    const cacheSet = ['1', '2', '3'];

    await rankMyCache.addToSet(cacheKey, cacheSet);

    await rankMyCache.expire(cacheKey, 1);

    let data = await rankMyCache.getSetMembers(cacheKey);

    expect(data).toEqual(expect.arrayContaining(cacheSet));

    // Wait 2 seconds
    await new Promise((res) => {
      setTimeout(
        res,
        2 * 1000, // 2 seconds
      );
    });

    data = await rankMyCache.getSetMembers(cacheKey);

    expect(data).toBeNull();
  });
});

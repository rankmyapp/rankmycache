import { CacheAdapter, SetValueType } from './cache-adapter-interface';

export type InMemory = {
  [key: string]: string | Set<unknown>;
};

export class InMemoryAdapter implements CacheAdapter<InMemory> {
  client: InMemory = {};

  timeout: number;

  async get<T>(key: string): Promise<T> {
    const data = this.client[key];

    if (!data || data instanceof Set) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  async set<T>(key: string, data: T): Promise<void> {
    const encodedData = JSON.stringify(data);

    this.client[key] = encodedData;
  }

  async delete(key: string): Promise<void> {
    delete this.client[key];
  }

  handleError(err: Error): null {
    if (err) {
      return null;
    }

    return null;
  }

  async getSetMembers(key: string): Promise<string[]> {
    const foundSet = this.client[key];

    return (
      (foundSet &&
        foundSet instanceof Set &&
        Array.from(foundSet).map(String)) ||
      null
    );
  }

  async addToSet<T extends SetValueType>(
    key: string,
    value: T | T[],
  ): Promise<void> {
    const valuesToAdd = Array.isArray(value) ? value : [value];

    const foundSet = this.client[key];

    if (foundSet && foundSet instanceof Set) {
      valuesToAdd.map((value) => foundSet.add(value));
    } else {
      this.client[key] = new Set(valuesToAdd);
    }
  }

  async removeFromSet<T extends SetValueType>(
    key: string,
    value: T | T[],
  ): Promise<void> {
    const valuesToRemove = Array.isArray(value) ? value : [value];

    const foundSet = this.client[key];

    if (foundSet && foundSet instanceof Set) {
      valuesToRemove.map((value) => foundSet.delete(value));

      if (foundSet.size === 0) {
        delete this.client[key];
      }
    }
  }

  async isSetMember<T extends SetValueType>(
    key: string,
    value: T,
  ): Promise<boolean> {
    const foundSet = this.client[key];

    return foundSet && foundSet instanceof Set && foundSet.has(value);
  }

  async expire(key: string, ttl: number): Promise<void> {
    setTimeout(() => {
      delete this.client[key];
    }, ttl * 1000);
  }
}

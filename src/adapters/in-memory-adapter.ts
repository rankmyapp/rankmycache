import { CacheAdapter } from './cache-adapter-interface';

type InMemory = {
  [key: string]: string;
};

export class InMemoryAdapter implements CacheAdapter<InMemory> {
  client: InMemory = {};

  timeout: number;

  async get<T>(key: string): Promise<T> {
    const data = this.client[key];

    if (!data) {
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
}

import * as Bluebird from 'bluebird';
import IORedis, { Redis } from 'ioredis';
import { CacheOptions } from '../config/config-options-interface';
import { CacheAdapter } from './cache-adapter-interface';

export class IORedisAdapter implements CacheAdapter<Redis> {
  client: Redis;

  timeout: number;

  constructor({ host, port, password, requestTimeout = 150 }: CacheOptions) {
    this.client = new IORedis({
      host,
      port,
      password,
      retryStrategy: () => null,
      reconnectOnError: () => false,
      connectTimeout: 200,
      keepAlive: 1000,
    });
    // @ts-ignore
    IORedis.Promise = Bluebird;
    this.timeout = requestTimeout;
  }

  async get<T>(key: string): Promise<T> {
    try {
      if (this.client.status !== 'ready') {
        return null;
      }

      const redisPromise = (this.client.get(key) as Bluebird<string>).timeout(
        this.timeout,
        'ERR_TIMEOUT',
      );

      const data = await redisPromise;

      const parsedData = JSON.parse(data) as T;

      return parsedData;
    } catch (err) {
      return this.handleError(err);
    }
  }

  async set<T>(key: string, data: T): Promise<void> {
    try {
      if (this.client.status !== 'ready') {
        return null;
      }

      const encodedData = JSON.stringify(data);

      const redisPromise = (
        this.client.set(key, encodedData) as Bluebird<'OK'>
      ).timeout(this.timeout, 'ERR_TIMEOUT');

      await redisPromise;

      return null;
    } catch (err) {
      return this.handleError(err);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.client.status !== 'ready') {
        return null;
      }

      const redisPromise = (this.client.del(key) as Bluebird<number>).timeout(
        this.timeout,
        'ERR_TIMEOUT',
      );

      await redisPromise;

      return null;
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(err: Error): null {
    if (err.message !== 'ERR_TIMEOUT') {
      this.client = null;
    }

    return null;
  }
}

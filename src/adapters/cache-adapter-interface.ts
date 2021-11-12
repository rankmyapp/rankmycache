export interface CacheAdapter<V> {
  client: V;
  timeout: number;

  get<T>(key: string): Promise<T>;
  set<T>(key: string, data: T, ttl?: number | false): Promise<void>;
  delete(key: string): Promise<void>;
  handleError(err: Error): null;
}

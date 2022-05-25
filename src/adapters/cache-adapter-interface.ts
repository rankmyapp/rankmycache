export type SetValueType = string | number;
export interface CacheAdapter<V> {
  client: V;
  timeout: number;

  get<T>(key: string): Promise<T>;
  set<T>(key: string, data: T, ttl?: number | false): Promise<void>;
  delete(key: string): Promise<void>;
  handleError(err: Error): null;
  getSetMembers(key: string): Promise<string[] | null>;
  addToSet<T extends SetValueType>(key: string, value: T | T[]): Promise<void>;
  removeFromSet<T extends SetValueType>(
    key: string,
    value: T | T[],
  ): Promise<void>;
  isSetMember<T extends SetValueType>(key: string, value: T): Promise<boolean>;
  expire(key: string, ttl: number): Promise<void>;
}

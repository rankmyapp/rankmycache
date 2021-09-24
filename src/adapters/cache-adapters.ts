import { Redis } from 'ioredis';

type InMemory = {
  [key: string]: string;
};

export type AvailableProviders = Redis | InMemory;

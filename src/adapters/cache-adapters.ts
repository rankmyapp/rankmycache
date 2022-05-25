import { Redis } from 'ioredis';
import { InMemory } from './in-memory-adapter';

export type AvailableProviders = Redis | InMemory;

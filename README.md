# rankmycache

An easy-to-use cache providing service.

# Getting Started

## Table of Contents

* [Instalation](#installation)
  * [With NPM](#with-npm)
  * [With Yarn](#with-yarn)
* [Usage](#usage)
  * [Setting Data](#setting-data)
  * [Getting Data](#getting-data)
  * [Deleting Data](#deleting-data)
  * [Handling Errors](#handling-errors)

## Instalation

### With NPM
```console
npm i rankmycache
```

### With Yarn
```console
yarn add rankmycache
```

## Usage
Currently there are 2 providers:

* ioredis
```typescript
enum CacheProviders {
  IOREDIS = 'ioredis',
  // ...
}
```

* memory (Recommended only for testing purposes)
```typescript
enum CacheProviders {
  IN_MEMORY = 'memory',
  // ...
}
```

Creating a Cache Service instance is as simple as:
```typescript 
import { RankMyCache, CacheProviders } from 'rankmycache';

const cacheService = new RankMyCache({
  type: CacheProviders.IOREDIS,
  host: 'hostname',
  port: 6379,
  password: 'secret', // optional
  keyPrefix: 'cache-', // optional
  requestTimeout: 100, // optional
  ttl: 300 // default seconds to expire, is also optional 
});
```

### Setting Data

Sending data to your cache provider is done by sending the key related to the payload and, of course, the payload as a Object:
```typescript
// without expiration
await cacheService.set('new-data', {
  name: 'data',
  ok: true,
});

// with custom expiration time
await cacheService.set('new-data', {
  name: 'data',
  ok: true,
}, 500);

// if you wish to override default expiration time and save cache data for an indefinite amount of time
await cacheService.set('new-data', {
  name: 'data',
  ok: true,
}, false);
```

### Getting Data

Getting data from your provider is also pretty simple, just send the key and wait for the parsed response:
```typescript
const data = await cacheService.get('new-data');

console.log(data);

/*
  {
    name: 'data',
    ok: true
  }
*/
```

### Deleting Data

Deleting data is also pretty simple, just pass the key and it'll go away:
```typescript
await cacheService.delete('new-data');
```

## Handling Errors

One of the core concepts of using cache in an application is to function as a fallback for when data is already stored there, working as a faster, secondary source of data. Therefore, it shouldn't be neither slow nor throw errors when data is not available or it exceeds the request's timeout set previously. The cache service provided by this library knows this and won't throw errors when any kind of problem occurs, be it small, like exceeding the timeout, or major, like disconnecting from provider. Instead, it'll just return null when any request made by the service throws an error.
```typescript
const data = await cacheService.get('errored-key');

console.log(data); // null
```
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
* [Using Sets](#using-sets)
  * [Add To Set](#add-to-set)
  * [Get Set Members](#get-set-members)
  * [Remove From Set](#remove-from-set)
  * [Is Set Member](#is-set-member)
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

## Using Sets

It is also possible to store sets of **unique** data in your cache. By adding data to a set, the cache will create an array of unique items to add your data.

### Add To Set

To create a new set and populate it with data, or to add data to an existing set, use the `addToSet` method. It can handle adding a single item or an array of items and it will automatically handle creating the set if it doesn't exist:

```ts
// Adding a single item
await cacheService.addToSet('set-key', 'set-item');

// Adding multiple items
await cacheService.addToSet('set-key', ['set-item-1', 'set-item-2']);
```
### Get Set Members

To access all items in a set of data and return them as an array, use the `getSetMembers` method:

```ts
await cacheService.addToSet('set-key', ['set-item-1', 'set-item-2']);

// Querying set data
const items = await cacheService.getSetMembers('set-key');

console.log(items) // ['set-item-1', 'set-item-2']
```

### Remove From Set

To remove items from a set, use the `removeFromSet` method. Just like `addToSet`, it can also recieve an item or an array of items to be removed:

```ts
await cacheService.addToSet('set-key', ['item-1', 'item-2', 'item-3', 'item-4']);

// Removing single item
await cacheService.removeFromSet('set-key', 'item-3');

// Removing multiple items at once
await cacheService.removeFromSet('set-key', ['item-1', 'item-2']);

const items = await cacheService.getSetMembers('set-key');

console.log(items) // ['item-4']
```

### Is Set Member

To check if an item is a member of a given set, use the `isSetMember` method:

```ts
await cacheService.addToSet('set-key', ['item-1', 'item-2']);

const isMember = await cacheService.isSetMember('set-key', 'item-2');

console.log(isMember); // true
```
## Handling Errors

One of the core concepts of using cache in an application is to function as a fallback for when data is already stored there, working as a faster, secondary source of data. Therefore, it shouldn't be neither slow nor throw errors when data is not available or it exceeds the request's timeout set previously. The cache service provided by this library knows this and won't throw errors when any kind of problem occurs, be it small, like exceeding the timeout, or major, like disconnecting from provider. Instead, it'll just return null when any request made by the service throws an error.
```typescript
const data = await cacheService.get('errored-key');

console.log(data); // null
```
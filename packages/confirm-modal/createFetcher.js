import { createCache, createResource } from 'simple-cache-provider';

export default function createFetcher(resolver) {
  let cache = createCache();
  let resource = createResource(resolver);
  return {
    read(key) {
      return resource.read(cache, key);
    },
  };
}

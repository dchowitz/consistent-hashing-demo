import BinarySearchTree from "./BinarySearchTree";

export type ConsistentHashingState = {
  servers: string[];
  serverHashes: number[];
  keys: string[];
  keyHashes: number[];
  serverKeyMap: ServerKeyMap;
  sortedServerKeyCounts: number[];
};

export type ServerKeyMap = { [server: string]: string[] };

export default class ConsistentHashing {
  #servers = new BinarySearchTree<string>();
  #keys = new Set<string>();

  addServer(server: string) {
    this.#servers.insert(hash(server), server);
  }

  removeServer(server: string) {
    this.#servers.remove(hash(server));
  }

  addKey(key: string) {
    this.#keys.add(key);
  }

  removeKey(key: string) {
    this.#keys.delete(key);
  }

  lookupServer(key: string) {
    let server = this.#servers.findNearestGreaterThan(hash(key));
    if (server === undefined) {
      // either there are no servers or
      // there is no server-hash greater than key-hash
      // -> search again from beginning of hash space [0, END]
      server = this.#servers.findNearestGreaterThan(0);
    }
    return server?.value;
  }

  inspect() {
    const serverNodes = this.#servers.toOrderedArray();
    const keys = [...this.#keys.values()];

    const serverKeyMap = serverNodes.reduce((map, s) => {
      map[s.value] = [];
      return map;
    }, {} as ServerKeyMap);

    if (serverNodes.length > 0) {
      this.#keys.forEach((key) => {
        const lookup = this.lookupServer(key);
        if (lookup !== undefined) {
          serverKeyMap[lookup].push(key);
        }
      });
    }

    const serverKeyCounts = Object.values(serverKeyMap).map((keys) => keys.length);

    return {
      servers: serverNodes.map((n) => n.value),
      serverHashes: serverNodes.map((n) => n.key),
      keys,
      keyHashes: keys.map(hash).sort((a, b) => a - b),
      serverKeyMap,
      sortedServerKeyCounts: serverKeyCounts.sort((a, b) => a - b),
    };
  }
}

const MIN_HASH = 0x00;
const MAX_HASH = 0xffffffff;
export { MIN_HASH, MAX_HASH };

/**
 * xmur3 hash (32bit), based on https://stackoverflow.com/a/47593316/339272
 */
export function hash(str: string) {
  let h = 1779033703 ^ str.length;

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);

  return (h ^= h >>> 16) >>> 0;
}

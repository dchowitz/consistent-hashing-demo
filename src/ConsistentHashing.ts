import BinarySearchTree from "./BinarySearchTree";

export const emptyConsistentHashingState: ConsistentHashingState = {
  servers: [],
  sortedServerHashes: [],
  serverHashMap: {},
  keys: [],
  keyHashes: [],
  serverKeyMap: {},
  sortedServerKeyCounts: [],
};

export type ConsistentHashingState = {
  servers: string[];
  sortedServerHashes: number[];
  serverHashMap: ServerHashMap;
  keys: string[];
  keyHashes: number[];
  serverKeyMap: ServerKeyMap;
  sortedServerKeyCounts: number[];
};

// TODO - could consolidate both
export type ServerHashMap = { [server: string]: number[] };
export type ServerKeyMap = { [server: string]: string[] };

// each server can be represented by multiple nodes on the hash ring
const VIRTUAL_SERVER_NODES = Array.apply(null, new Array(3)).map((_, i) => i);

export default class ConsistentHashing {
  // server nodes in hash order
  #serversSortedByHash = new BinarySearchTree<string>();

  // names of physical servers
  #servers = new Set<string>();

  // keys, each one is associated with a single virtual server node
  #keys = new Set<string>();

  addServer(server: string) {
    this.#servers.add(server);
    virtualServerHashes(server).forEach((h) => {
      this.#serversSortedByHash.insert(h, server);
    });
  }

  removeServer(server: string) {
    this.#servers.delete(server);
    virtualServerHashes(server).forEach((h) => {
      this.#serversSortedByHash.remove(h);
    });
  }

  addKey(key: string) {
    this.#keys.add(key);
  }

  removeKey(key: string) {
    this.#keys.delete(key);
  }

  lookupServer(key: string) {
    let server = this.#serversSortedByHash.findNearestGreaterThan(hash(key));
    if (server === undefined) {
      // either there are no servers or
      // there is no server-hash greater than key-hash
      // -> search again from beginning of hash space
      server = this.#serversSortedByHash.findNearestGreaterThan(0);
    }
    return server?.value;
  }

  // TODO - return getHashRange etc.
  inspect() {
    const serverNodes = this.#serversSortedByHash.toOrderedArray();

    // TODO - holding the keys here is questionable
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
      servers: [...this.#servers.values()],
      sortedServerHashes: serverNodes.map((n) => n.key),
      serverHashMap: serverNodes.reduce((result, n) => {
        const current = result[n.value] || [];
        result[n.value] = [...current, n.key];
        return result;
      }, {} as ServerHashMap),
      keys,
      keyHashes: keys.map(hash).sort((a, b) => a - b),
      serverKeyMap,
      sortedServerKeyCounts: serverKeyCounts.sort((a, b) => a - b),
    };
  }
}

// determines the hashes for a given server
function virtualServerHashes(server: string) {
  return VIRTUAL_SERVER_NODES.map((i) => hash(server + i));
}

const MIN_HASH = 0x00;
const MAX_HASH = 0xffffffff;

/**
 * xmur3 hash (32bit), based on https://stackoverflow.com/a/47593316/339272
 */
function hash(str: string) {
  let h = 1779033703 ^ str.length;

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);

  return (h ^= h >>> 16) >>> 0;
}

type HashRange =
  | { type: "partial"; start: number; end: number }
  | { type: "all"; end: number }
  | undefined;

function getHashRange(serverHash: number, sortedServerHashes: number[]): HashRange {
  if (sortedServerHashes.length === 1) {
    return { type: "all", end: serverHash };
  }

  const endIdx = sortedServerHashes.findIndex((h) => h >= serverHash);
  let startIdx = endIdx - 1;
  if (startIdx < 0) {
    startIdx = sortedServerHashes.length - 1;
  }

  const start = sortedServerHashes[startIdx];
  const end = serverHash > 0 ? serverHash - 1 : MAX_HASH; // a key hash is mapped to it's nearest server node with a greater hash value

  if (start === end) {
    return undefined;
  }

  return { type: "partial", start, end };
}

function getSuccessorWrapping(hash: number, sortedHashes: number[]) {
  if (sortedHashes.length < 2) {
    return undefined;
  }

  const idx = sortedHashes.indexOf(hash);
  if (idx === -1) {
    return undefined;
  }

  const inc = idx + 1;
  return sortedHashes[inc < sortedHashes.length ? inc : 0];
}

export {
  MIN_HASH,
  MAX_HASH,
  hash,
  HashRange,
  virtualServerHashes,
  getHashRange,
  getSuccessorWrapping,
};

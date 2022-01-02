import BinarySearchTree from "./BinarySearchTree";

export const emptyConsistentHashingState: ConsistentHashingState = {
  instance: undefined,
  servers: [],
  sortedServerHashes: [],
  serverHashMap: {},
  keys: [],
  keyHashes: [],
  serverKeyMap: {},
  sortedServerKeyCounts: [],
  virtualServerHashes: (server: string) => [],
  serversByHash: {},
};

export type ConsistentHashingState = {
  instance?: ConsistentHashing;
  servers: string[];
  sortedServerHashes: number[];
  serverHashMap: ServerHashMap;
  keys: string[];
  keyHashes: number[];
  serverKeyMap: ServerKeyMap;
  sortedServerKeyCounts: number[];
  virtualServerHashes: (server: string) => number[];
  serversByHash: { [hash: number]: string };
};

// TODO - could consolidate both
export type ServerHashMap = { [server: string]: number[] };
export type ServerKeyMap = { [server: string]: string[] };

export default class ConsistentHashing {
  // server nodes in hash order
  #serversSortedByHash = new BinarySearchTree<string>();

  // names of physical (non-virtual) servers
  #servers = new Set<string>();

  // keys, each one is associated with a single virtual server node
  #keys = new Set<string>();

  // each server can be represented by multiple nodes on the hash ring
  VIRTUAL_SERVER_NODES: number[];

  // allows lookup of server by virtual server
  #virtualServerMap = new Map() as Map<string, string>;

  constructor(virtualNodesCount: number) {
    this.VIRTUAL_SERVER_NODES = Array.apply(null, new Array(virtualNodesCount)).map(
      (_, i) => i
    );
  }

  addServer(server: string) {
    this.#servers.add(server);
    this.#virtualServerNames(server).forEach((virtualName) => {
      this.#serversSortedByHash.insert(hash(virtualName), virtualName);
      this.#virtualServerMap.set(virtualName, server);
    });
  }

  removeServer(server: string) {
    this.#servers.delete(server);
    this.#virtualServerNames(server).forEach((virtualName) => {
      this.#serversSortedByHash.remove(hash(virtualName));
      this.#virtualServerMap.delete(virtualName);
    });
  }

  addKey(key: string) {
    this.#keys.add(key);
  }

  removeKey(key: string) {
    this.#keys.delete(key);
  }

  lookupVirtualServer(key: string) {
    let virtualServer = this.#serversSortedByHash.findNearestGreaterThan(hash(key));
    if (virtualServer === undefined) {
      // either there are no servers or
      // there is no server-hash greater than key-hash
      // -> search again from beginning of hash space
      virtualServer = this.#serversSortedByHash.findNearestGreaterThan(0);
    }
    return virtualServer?.value;
  }

  lookupServer(key: string) {
    const virtualServer = this.lookupVirtualServer(key);
    return virtualServer ? this.#virtualServerMap.get(virtualServer) : undefined;
  }

  getServerByVirtualServer(virtualServer: string) {
    return this.#virtualServerMap.get(virtualServer);
  }

  #virtualServerNames(server: string) {
    return this.VIRTUAL_SERVER_NODES.map((i) => server + "_" + i);
  }

  partitionSizesByServer() {
    let lastHash = 0;
    const sizes = {} as { [server: string]: number };
    const nodes = this.#serversSortedByHash.toOrderedArray();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const server = this.#virtualServerMap.get(node.value);
      if (server) {
        sizes[server] = (sizes[server] || 0) + node.key - lastHash;
      }
      lastHash = node.key;
    }

    // add rest to first node
    if (nodes.length > 0) {
      const firstServer = this.#virtualServerMap.get(nodes[0].value);
      if (firstServer) {
        sizes[firstServer] += MAX_HASH - nodes[nodes.length - 1].key;
      }
    }

    // normalize
    Object.keys(sizes).forEach((k) => (sizes[k] = sizes[k] / MAX_HASH));
    return sizes;
  }

  // vehicel to trigger react re-renders (used as state)
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

    // todo - we could basically return `this` and expose all info via dedicated methods
    return {
      instance: this,
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
      virtualServerHashes: (server: string) => this.#virtualServerNames(server).map(hash),
      serversByHash: serverNodes.reduce((result, n) => {
        result[n.key] = n.value;
        return result;
      }, {} as { [hash: number]: string }),
    };
  }
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

export type HashRange =
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

export { MIN_HASH, MAX_HASH, hash, getHashRange, getSuccessorWrapping };

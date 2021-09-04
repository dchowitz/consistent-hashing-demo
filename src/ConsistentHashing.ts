import BinarySearchTree from "./BinarySearchTree";
import hash from "./xmur3";

export { hash };

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
      // we consider the hash space a ring
      // possible optimization: track the max-server-hash in order
      // to have always one invocation of findNearest...
      server = this.#servers.findNearestGreaterThan(0);
    }
    return server?.value;
  }

  inspect() {
    const serverNodes = this.#servers.toOrderedArray();
    const keys = [...this.#keys.values()];

    return {
      servers: serverNodes.map((n) => n.value).sort(),
      serverHashes: serverNodes.map((n) => n.key),
      keys,
      keyHashes: keys.map(hash),
    };
  }
}

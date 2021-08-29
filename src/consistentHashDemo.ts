import BinarySearchTree from "./BinarySearchTree";
import hash from "./xmur3";

const servers = new BinarySearchTree<string>();
const keys = new Set<string>();

export { addServer, removeServer, addKey, removeKey };

function addServer(server: string) {
  servers.insert(hash(server), server);
}

function removeServer(server: string) {
  servers.remove(hash(server));
}

function addKey(key: string) {
  keys.add(key);
}

function removeKey(key: string) {
  keys.delete(key);
}

function getServer(key: string) {
  let server = servers.findNearestGreaterThan(hash(key));
  if (server === undefined) {
    // either there are no servers or
    // there is no server-hash greater than key-hash
    // -> search again from beginning of hash space [0, END]
    // we consider the hash space a ring
    // possible optimization: track the max-server-hash in order
    // to have always one invocation of findNearest...
    server = servers.findNearestGreaterThan(0);
  }
  return server?.value;
}

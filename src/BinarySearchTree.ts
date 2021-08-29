type Data<T> = { key: number; value: T };

type Node<T> = Data<T> & {
  left?: Node<T>;
  right?: Node<T>;
};

export default class BinarySearchTree<T> {
  root?: Node<T>;

  /**
   * Returns the tree nodes (key, value) pairs as an array,
   * ordered ascending by keys.
   */
  toOrderedArray() {
    const result: Data<T>[] = [];
    this.inorder((n) => result.push({ key: n.key, value: n.value }));
    return result;
  }

  /**
   * Emits all tree nodes via inorder traversal.
   * Keys are ordered ascending.
   */
  inorder(callback: (n: Node<T>) => void) {
    if (!this.root) return;
    const stack: Node<T>[] = [this.root];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current.left) {
        stack.push({ ...current, left: undefined });
        stack.push(current.left);
      } else {
        callback({ ...current });
        if (current.right) {
          stack.push(current.right);
        }
      }
    }
  }

  /**
   * Create a new leaf node, unless there is already
   * a node with the given key, in which case we just
   * update its value.
   */
  insert(key: number, value: T) {
    const node = { key, value };
    if (!this.root) {
      // special case for first insert
      this.root = node;
      return;
    }

    let current = this.root;
    while (current) {
      if (current.key > key) {
        if (current.left) {
          current = current.left;
        } else {
          current.left = node;
          break;
        }
      } else if (current.key < key) {
        if (current.right) {
          current = current.right;
        } else {
          current.right = node;
          break;
        }
      } else {
        // equal key, update value
        current.value = value;
        break;
      }
    }
  }

  remove(key: number) {
    let current = this.root;
    let currentParent: Node<T> | undefined;

    while (current && current.key !== key) {
      if (current.key > key) {
        currentParent = current;
        current = current.left;
      } else {
        currentParent = current;
        current = current.right;
      }
    }

    if (!current) return;

    if (!current.left && !current.right) {
      // node to remove is a leaf
      if (!currentParent) {
        // ... and root (single node tree)
        this.root = undefined;
      } else if (current === currentParent.left) {
        currentParent.left = undefined;
      } else {
        currentParent.right = undefined;
      }
    } else if (current.left && !current.right) {
      // node to remove has only left child, so just replace it
      current.key = current.left.key;
      current.value = current.left.value;
      current.right = current.left.right;
      current.left = current.left.left;
    } else if (current.right && !current.left) {
      // node to remove has only right child, so just replace it
      current.key = current.right.key;
      current.value = current.right.value;
      current.left = current.right.left;
      current.right = current.right.right;
    } else {
      // node to remove has both childs, so find the inorder successor node
      // (beginning from the right child node leaf)
      // and replace current's key and value with it
      let successor = current.right!;
      let successorParent = current;
      while (successor.left) {
        successorParent = successor;
        successor = successor.left;
      }

      current.key = successor.key;
      current.value = successor.value;

      if (successorParent === current) {
        // current's right node has no left child
        successorParent.right = undefined;
      } else {
        successorParent.left = undefined;
      }
    }
  }

  findNearestGreaterThan(key: number) {
    let current = this.root;
    let lastFound: Node<T> | undefined;

    while (current) {
      if (current.key > key) {
        lastFound = current;
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return lastFound;
  }

  print() {
    let lines: string[] = [];
    if (this.root) {
      lines = this.#print(this.root);
    }

    return lines.map((l) => l.trimEnd());
  }

  #print(node: Node<T>): string[] {
    const leftLines = node.left ? this.#print(node.left) : [];
    const leftSpace = " ".repeat(leftLines[0]?.length ?? 0);

    const rightLines = node.right ? this.#print(node.right) : [];
    const rightSpace = " ".repeat(rightLines[0]?.length ?? 0);

    const count = Math.max(leftLines.length, rightLines.length);
    const lines = [leftSpace + node.key.toString() + rightSpace];
    const midSpace = " ".repeat(node.key.toString().length);

    for (let i = 0; i < count; i++) {
      const line = (leftLines[i] || leftSpace) + midSpace + (rightLines[i] || rightSpace);
      lines.push(line);
    }

    return lines;
  }
}

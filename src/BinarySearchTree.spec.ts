import BinarySearchTree from "./BinarySearchTree";

describe("insert", () => {
  test("single node", () => {
    const bst = new BinarySearchTree();
    bst.insert(4, undefined);
    expect(bst.print()).toStrictEqual(["4"]);
  });
  test("empty tree", () => {
    const bst = new BinarySearchTree();
    expect(bst.print()).toStrictEqual([]);
  });
  test("three nodes", () => {
    const bst = new BinarySearchTree();
    bst.insert(4, undefined);
    bst.insert(2, undefined);
    bst.insert(7, undefined);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      " 4",
      "2 7",
    ]);
  });
  test("unbalanced towards left", () => {
    const bst = new BinarySearchTree();
    bst.insert(1000, undefined);
    bst.insert(900, undefined);
    bst.insert(50, undefined);
    bst.insert(1, undefined);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "      1000",
      "   900",
      " 50",
      "1",
    ]);
  });
  test("unbalanced towards left, each with a single right node", () => {
    const bst = new BinarySearchTree();
    bst.insert(1000, undefined);
    bst.insert(900, undefined);
    bst.insert(50, undefined);
    bst.insert(1, undefined);
    bst.insert(1001, undefined);
    bst.insert(901, undefined);
    bst.insert(51, undefined);
    bst.insert(2, undefined);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "            1000",
      "      900       1001",
      "  50     901",
      "1   51",
      " 2",
    ]);
  });
  test("unbalanced towards right", () => {
    const bst = new BinarySearchTree();
    bst.insert(1, undefined);
    bst.insert(50, undefined);
    bst.insert(900, undefined);
    bst.insert(1000, undefined);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "1",
      " 50",
      "   900",
      "      1000",
    ]);
  });
  test("unbalanced towards right, each with a single left node", () => {
    const bst = new BinarySearchTree();
    bst.insert(1, undefined);
    bst.insert(50, undefined);
    bst.insert(900, undefined);
    bst.insert(1000, undefined);
    bst.insert(-1, undefined);
    bst.insert(49, undefined);
    bst.insert(899, undefined);
    bst.insert(999, undefined);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "  1",
      "-1   50",
      "   49     900",
      "       899      1000",
      "             999",
    ]);
  });
  test("big tree", () => {
    const bst = new BinarySearchTree();
    bst.insert(77, undefined);
    bst.insert(342, undefined);
    bst.insert(255, undefined);
    bst.insert(80, undefined);
    bst.insert(766, undefined);
    bst.insert(333, undefined);
    bst.insert(432, undefined);
    bst.insert(350, undefined);
    bst.insert(40, undefined);
    bst.insert(55, undefined);
    bst.insert(47, undefined);
    bst.insert(15, undefined);
    bst.insert(7, undefined);
    bst.insert(12, undefined);
    bst.insert(14, undefined);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "             77",
      "       40              342",
      "     15    55    255            766",
      "7        47    80   333      432",
      " 12                       350",
      "   14",
    ]);
  });
});

describe("remove", () => {
  test("node from empty tree does nothing", () => {
    const bst = new BinarySearchTree();
    bst.remove(42);
    expect(bst.print()).toStrictEqual([]);
  });

  test("last node", () => {
    const bst = new BinarySearchTree();
    bst.insert(42, undefined);
    bst.remove(42);
    expect(bst.print()).toStrictEqual([]);
  });

  test("left leaf", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "   6",
      " 4       15",
      "3 5  10      20",
      "    9  11  18  22",
    ]);
    bst.remove(9);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "   6",
      " 4      15",
      "3 5 10      20",
      "      11  18  22",
    ]);
  });

  test("right leaf", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "   6",
      " 4       15",
      "3 5  10      20",
      "    9  11  18  22",
    ]);
    bst.remove(5);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "  6",
      " 4      15",
      "3   10      20",
      "   9  11  18  22",
    ]);
  });

  test("node with left child only", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "   6",
      " 4     15",
      "3 5  10    20",
      "    9    18  22",
    ]);
    bst.remove(10);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "   6",
      " 4   15",
      "3 5 9    20",
      "       18  22",
    ]);
  });

  test("node with right child only", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "   6",
      " 4     15",
      "3 5  10  20",
      "    9      22",
    ]);
    bst.remove(20);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "   6",
      " 4     15",
      "3 5  10  22",
      "    9",
    ]);
  });

  test("node with both childs, and right child is leaf", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "   6",
      " 4     15",
      "3 5  10  20",
      "    9      22",
    ]);
    bst.remove(4);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "  6",
      " 5    15",
      "3   10  20",
      "   9      22",
    ]);
  });

  test("node with both childs, and right child is tree", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "   6",
      " 4     15",
      "3 5  10    20",
      "    9    18  22",
    ]);
    bst.remove(15);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "   6",
      " 4     18",
      "3 5  10  20",
      "    9      22",
    ]);
  });

  test("root", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "   6",
      " 4     15",
      "3 5  10    20",
      "    9    18  22",
    ]);
    bst.remove(6);
    expect(bst.print()).toStrictEqual([
      // prettier-ignore
      "   9",
      " 4    15",
      "3 5 10    20",
      "        18  22",
    ]);
  });
});

describe("toOrderedArray", () => {
  test("returns empty array for empty tree", () => {
    const bst = new BinarySearchTree<string>();
    expect(bst.toOrderedArray()).toStrictEqual([]);
  });

  test("returns array with single item for tree with single node", () => {
    const bst = new BinarySearchTree<string>();
    bst.insert(1, "root");
    expect(bst.toOrderedArray()).toStrictEqual([{ key: 1, value: "root" }]);
  });

  test("returns nodes in ascending order", () => {
    const bst = new BinarySearchTree<string>();
    bst.insert(6, "root");
    bst.insert(3, "left");
    bst.insert(9, "right");
    expect(bst.toOrderedArray().map((i) => i.key)).toStrictEqual([3, 6, 9]);
  });
});

describe("findNearestGreaterThan", () => {
  test("in a balanced tree", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "  6",
      "3   9",
      " 4 8",
    ]);

    expect(bst.findNearestGreaterThan(0)?.value).toBe("3");
    expect(bst.findNearestGreaterThan(3)?.value).toBe("4");
    expect(bst.findNearestGreaterThan(5)?.value).toBe("6");
    expect(bst.findNearestGreaterThan(7)?.value).toBe("8");
    expect(bst.findNearestGreaterThan(8.5)?.value).toBe("9");
    expect(bst.findNearestGreaterThan(9)).toBeUndefined();
    expect(bst.findNearestGreaterThan(10)).toBeUndefined();
  });

  test("in a unbalanced towards left tree", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "    9",
      "   8",
      "  6",
      " 4",
      "3",
    ]);

    expect(bst.findNearestGreaterThan(0)?.value).toBe("3");
    expect(bst.findNearestGreaterThan(3)?.value).toBe("4");
    expect(bst.findNearestGreaterThan(5)?.value).toBe("6");
    expect(bst.findNearestGreaterThan(7)?.value).toBe("8");
    expect(bst.findNearestGreaterThan(8.5)?.value).toBe("9");
    expect(bst.findNearestGreaterThan(9)).toBeUndefined();
    expect(bst.findNearestGreaterThan(10)).toBeUndefined();
  });

  test("finds nearest in an unbalanced towards right tree", () => {
    const bst = createFromPrint([
      // prettier-ignore
      "3",
      " 4",
      "  6",
      "   8",
      "    9",
    ]);

    expect(bst.findNearestGreaterThan(0)?.value).toBe("3");
    expect(bst.findNearestGreaterThan(3)?.value).toBe("4");
    expect(bst.findNearestGreaterThan(5)?.value).toBe("6");
    expect(bst.findNearestGreaterThan(7)?.value).toBe("8");
    expect(bst.findNearestGreaterThan(8.5)?.value).toBe("9");
    expect(bst.findNearestGreaterThan(9)).toBeUndefined();
    expect(bst.findNearestGreaterThan(10)).toBeUndefined();
  });
});

function createFromPrint(lines: string[]) {
  const bst = new BinarySearchTree<string>();
  for (let i = 0; i < lines.length; i++) {
    const parts = (lines[i] || "").trim().replace(/\s+/g, " ").split(" ");
    for (let j = 0; j < parts.length; j++) {
      const key = parseInt(parts[j], 10);
      if (isNaN(key)) {
        throw new Error("got non-integer key: " + parts[j]);
      }
      bst.insert(key, key.toString());
    }
  }
  return bst;
}

describe("test helpers", () => {
  test("createFromPrint", () => {
    const lines = [
      // prettier-ignore
      "   6",
      " 4       15",
      "3 5  10      20",
      "    9  11  18  22",
    ];
    expect(createFromPrint(lines).print()).toStrictEqual(lines);
  });
});

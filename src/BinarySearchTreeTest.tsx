import * as React from "react";
import BinarySearchTree from "./BinarySearchTree";

export default function BinarySearchTreeTest() {
  const bstRef = React.useRef(new BinarySearchTree<string>());
  const bst = bstRef.current;
  const [addValue, setAddValue] = React.useState("");
  const [lines, setLines] = React.useState<string[]>([]);

  const onAddNode = () => {
    if (addValue === "") return;
    const key = parseInt(addValue, 10);
    if (!isNaN(key)) {
      bst.insert(key, addValue);
    }
    setAddValue("");
    setLines(bst.print());
  };

  const onReset = () => {
    bstRef.current = new BinarySearchTree<string>();
    setLines([]);
  };
  return (
    <section>
      <h2>Binary Search Tree Test</h2>
      <div>
        <input type="number" style={{ width: "7ch" }} value={addValue} onChange={(e) => setAddValue(e.target.value)} />{" "}
        <button onClick={onAddNode} disabled={addValue === ""}>
          add node
        </button>
        <button onClick={onReset} disabled={lines.length === 0}>
          reset
        </button>
      </div>
      <pre>
        {lines.map((l, i) => (
          <React.Fragment key={i}>
            {l}
            <br />
          </React.Fragment>
        ))}
      </pre>
    </section>
  );
}

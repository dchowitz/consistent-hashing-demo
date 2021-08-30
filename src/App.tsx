import React from "react";
import BinarySearchTree from "./BinarySearchTree";

export default function App() {
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
    <div>
      <h1>Consistent Hashing Demo</h1>
      <ul>
        <li>show hash ring with servers and keys</li>
        <li>add server</li>
        <li>remove server</li>
        <li>add key</li>
        <li>remove key</li>
        <li>reset, remove all servers and keys</li>
        <li>on hovering/selecting a key the corresponding server node is shown</li>
        <li>provide toggle for having virtual server nodes (or not)</li>
        <li>populate a big set of random keys</li>
        <li>on adding removing a server, highlight the keys assigned to another server</li>
      </ul>
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
    </div>
  );
}

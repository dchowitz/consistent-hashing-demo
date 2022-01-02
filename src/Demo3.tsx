import * as React from "react";
import CircularHashSpace from "./visualization/CircularHashSpace";
import ConsistentHashing, { ConsistentHashingState, MAX_HASH } from "./ConsistentHashing";

const MIN_NODES = 1;
const MAX_NODES = 100;
const colors = ["var(--glitch-blue-light)", "var(--glitch-pink)", "var(--glitch-yellow)"];

export default function Demo2(props: { initialNodes: string[] }) {
  const [virtualNodes, setVirtualNodes] = React.useState(1);
  const [csState, setCsState] = React.useState<ConsistentHashingState | undefined>();
  const [selectedNode, setSelectedNode] = React.useState(props.initialNodes[0]);

  React.useEffect(() => {
    const cs = new ConsistentHashing(virtualNodes);
    props.initialNodes.forEach((n) => cs.addServer(n));
    setCsState(cs.inspect());
  }, [virtualNodes]);

  const partitionSizesByServer = csState?.instance?.partitionSizesByServer();

  const nodeColors = props.initialNodes.reduce((result, n, i) => {
    result[n] = colors[i];
    return result;
  }, {} as { [node: string]: string });

  return (
    <>
      <h2>Quick Demo - Virtual Nodes</h2>
      <div>
        <label htmlFor="count">Virtual nodes</label>
        <input
          name="count"
          type="number"
          min={MIN_NODES}
          max={MAX_NODES}
          value={virtualNodes}
          onChange={(e) => setVirtualNodes(parseInt(e.target.value))}
          style={{ marginLeft: "1rem" }}
        />
        <button
          style={{ marginLeft: "0.5rem" }}
          onClick={() => setVirtualNodes((x) => x + 1)}
          disabled={virtualNodes === MAX_NODES}
        >
          +
        </button>
        <button
          style={{ marginLeft: "0.5rem" }}
          onClick={() => setVirtualNodes((x) => x - 1)}
          disabled={virtualNodes === MIN_NODES}
        >
          -
        </button>
      </div>
      <div>
        {partitionSizesByServer &&
          props.initialNodes.map((k) => (
            <button
              key={k}
              style={{
                marginTop: "1rem",
                marginRight: "0.5rem",
                background: nodeColors[k],
                border: selectedNode === k ? "3px solid black" : undefined,
              }}
              onClick={() => setSelectedNode(k)}
            >
              {k} = {Math.round(partitionSizesByServer[k] * 1000) / 10}%
            </button>
          ))}
      </div>
      {csState && (
        <CircularHashSpace
          state={csState}
          highlightServer={selectedNode}
          serverColors={nodeColors}
        />
      )}
    </>
  );
}

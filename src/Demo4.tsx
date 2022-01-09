import * as React from "react";
import CircularHashSpace from "./visualization/CircularHashSpace";
import ConsistentHashing from "./ConsistentHashing";
import { colors } from "./Shared";
import KeyInput from "./KeyInput";

const MIN_NODES = 1;
const MAX_NODES = 99;

export default function Demo4(props: { initialNodes: string[] }) {
  const cs = React.useRef(new ConsistentHashing(1)).current;
  const [csState, setCsState] = React.useState(cs.inspect());
  const [nodeToggles, setNodeToggles] = React.useState<{ [node: string]: boolean }>({});
  const [key, setKey] = React.useState("Enter Key Here");

  function toggle(...nodes: string[]) {
    let toggles = nodeToggles;

    nodes.forEach((n) => {
      toggles = { ...toggles, [n]: !toggles[n] };

      if (toggles[n]) {
        cs.addServer(n);
      } else {
        cs.removeServer(n);
      }
    });

    setNodeToggles(toggles);
    setCsState(cs.inspect());
  }

  React.useEffect(() => {
    toggle(...props.initialNodes.slice(0, 3));
  }, []);

  const nodeColors = props.initialNodes.reduce((result, n, i) => {
    result[n] = colors[i % colors.length];
    return result;
  }, {} as { [node: string]: string });

  return (
    <>
      <h2>Quick Demo - Add &amp; Remove Nodes</h2>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline" }}></div>
      <KeyInput value={key} onChange={setKey} />
      <div>
        {props.initialNodes.map((k) => (
          <button
            key={k}
            style={{
              marginTop: "1rem",
              marginRight: "0.5rem",
              background: !!nodeToggles[k] ? nodeColors[k] : undefined,
            }}
            onClick={() => toggle(k)}
          >
            {k}
          </button>
        ))}
      </div>
      {csState && (
        <CircularHashSpace
          state={csState}
          highlightKey={key}
          highlightServer={cs.lookupServer(key)}
          serverColors={nodeColors}
          showLabels
          showArrow
          showStartEnd
        />
      )}
    </>
  );
}

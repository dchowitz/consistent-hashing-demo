import * as React from "react";
import CircularHashSpace from "./visualization/CircularHashSpace";
import ConsistentHashing from "./ConsistentHashing";

export default function Demo2(props: {
  virtualNodesCount: number;
  initialNodes: string[];
}) {
  const csRef = React.useRef(new ConsistentHashing(props.virtualNodesCount));
  const cs = csRef.current;
  const [csState, setCsState] = React.useState(cs.inspect());
  const [key, setKey] = React.useState("Enter Key Here");

  React.useEffect(() => {
    props.initialNodes.forEach((n) => cs.addServer(n));
    setCsState(cs.inspect());
  }, []);

  return (
    <>
      <h2>Quick Demo - Assigning Keys to Nodes</h2>
      <input
        placeholder="Key"
        type="text"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
        }}
        style={{ width: "25ch" }}
      />
      <CircularHashSpace
        state={csState}
        highlightKey={key}
        highlightServer={cs.lookupVirtualServer(key)}
        showLabels
        showArrow
        showStartEnd
      />
    </>
  );
}

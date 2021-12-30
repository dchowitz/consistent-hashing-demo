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
  const [key, setKey] = React.useState("What's up?");

  React.useEffect(() => {
    props.initialNodes.forEach((n) => cs.addServer(n));
    setCsState(cs.inspect());
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 20,
          zIndex: -1,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularHashSpace
          state={csState}
          highlightKey={key}
          highlightServer={cs.lookupVirtualServer(key)}
          showLabels
          showArrow
        />
      </div>
      <input
        type="text"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
    </div>
  );
}

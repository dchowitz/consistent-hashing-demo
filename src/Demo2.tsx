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
  const [key, setKey] = React.useState("a key");

  React.useEffect(() => {
    props.initialNodes.forEach((n) => cs.addServer(n));
    setCsState(cs.inspect());
  }, []);

  return (
    <>
      <div
        style={{
          height: 400,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", zIndex: -1 }}>
            {csState && (
              <CircularHashSpace
                state={csState}
                highlightKey={key}
                highlightServer={cs.lookupVirtualServer(key)}
                showLabels
                showArrow
              />
            )}
          </div>
          <div
            style={{
              width: 400,
              height: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

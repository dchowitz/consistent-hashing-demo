import * as React from "react";
import CircularHashSpace from "./visualization/CircularHashSpace";
import ConsistentHashing from "./ConsistentHashing";
import { colors } from "./Shared";
import KeyInput from "./KeyInput";

export default function Demo2(props: { initialNodes: string[] }) {
  const csRef = React.useRef(new ConsistentHashing(1));
  const cs = csRef.current;
  const [csState, setCsState] = React.useState(cs.inspect());
  const [key, setKey] = React.useState("Enter Key Here");

  const nodeColors = props.initialNodes.reduce((result, n, i) => {
    result[n] = colors[i];
    return result;
  }, {} as { [node: string]: string });

  React.useEffect(() => {
    props.initialNodes.forEach((n) => cs.addServer(n));
    setCsState(cs.inspect());
  }, []);

  return (
    <>
      <h2>Quick Demo - Assigning Keys to Nodes</h2>
      <KeyInput value={key} onChange={setKey} />
      <CircularHashSpace
        state={csState}
        highlightKey={key}
        highlightServer={cs.lookupServer(key)}
        serverColors={nodeColors}
        showLabels
        showArrow
        showStartEnd
      />
    </>
  );
}

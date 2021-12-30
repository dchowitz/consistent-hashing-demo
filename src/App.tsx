import React from "react";
import Demo2 from "./Demo2";

export default function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1>Consistent Hashing Demo</h1>
      <Demo2 virtualNodesCount={1} initialNodes={["node-11", "node-13", "node-21"]} />
    </div>
  );
}
